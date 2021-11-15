/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IFormItemGroup } from '../../../components/AbstractFillableComponent';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractContractSetting, { IAbstractContractSettingState, IAttachDTO, IContractInfo, IPaymentPlanDto, IRegion, planType, ProjectContractInfo } from './AbstractContractSetting';
import moment from 'moment'
import { message } from 'antd';

export interface IContractSettingProps {
    readonly id: string;
}
export interface IContractSettingRouteProps extends RouteComponentProps<IContractSettingProps>, WithTranslation { }
export interface IContractSettingState extends IAbstractContractSettingState { }

/**
 * Contract Setting
 */
export class ContractSetting extends AbstractContractSetting<IContractSettingRouteProps, IContractSettingState> {
    requestPath = "/tower-market/contract";

    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const contract = await RequestUtil.get<ProjectContractInfo>(`${this.requestPath}/${this.props.match.params.id}`);
        this.setState({
            contract: contract
        });
        contract.paymentPlanDtos = contract.paymentPlanVos?.map<IPaymentPlanDto>((plan: IPaymentPlanDto, index: number): IPaymentPlanDto => {
            return {
                ...plan,
                returnedTime: moment(plan.returnedTime),
                index: index + 1
            };
        });
        contract.attachInfoDtos = contract.attachVos?.map<IAttachDTO>((attach: IAttachDTO, index: number): IAttachDTO => {
            return {
                ...attach,
                index: index + 1
            };
        })
        this.setState({
            contract: {
                ...contract,
                customerInfoDto: contract.customerInfoVo,
            }
        })

        this.getForm()?.setFieldsValue({
            contractNumber: contract.contractNumber,
            purchaseOrderNumber: contract.purchaseOrderNumber, // 修复采购订单编辑回显有问题
            id: contract.id,
            internalNumber: contract.internalNumber,
            projectName: contract.projectName,
            simpleProjectName: contract.simpleProjectName || '',
            winBidType: contract.winBidType === -1 ? '' : contract.winBidType,
            saleType: contract.saleType === -1 ? '' : contract.saleType,
            signCustomerName: contract.signCustomerName,
            signContractTime: contract.signContractTime && moment(contract.signContractTime),
            signUserName: contract.signUserName,
            deliveryTime: contract.deliveryTime && moment(contract.deliveryTime),
            reviewTime: contract.reviewTime && moment(contract.reviewTime),
            chargeType: contract.chargeType === -1 ? '' : contract.chargeType,
            salesman: contract.salesman,
            region: Array.isArray(contract?.region) ? contract?.region : [contract?.region],
            countryCode: contract.countryCode,
            contractAmount: contract.contractAmount,
            currencyType: contract.currencyType,
            description: contract.description,
            planType: contract.planType,
            paymentPlanDtos: contract.paymentPlanDtos,
            attachInfoDtos: contract?.attachInfoDtos,
            customerCompany: contract.customerInfoVo?.customerCompany,
            customerLinkman: contract.customerInfoVo?.customerLinkman,
            customerPhone: contract.customerInfoVo?.customerPhone,
            productType: contract?.productType === -1 ? '' : contract?.productType,
            voltageGrade: contract?.voltageGrade === -1 ? '' : contract?.voltageGrade,

            contractTotalWeight: contract?.contractTotalWeight,
            contractName: contract?.contractName,
            contractPrice: contract?.contractPrice,
            isIta: contract?.isIta
        });
        const region: string[] | undefined = this.state.contract.region;
        let regionInfoData: IRegion[] = this.state.regionInfoData;
        if (this.state.contract.countryCode === 0) {
            if (region && region.length > 0) {
                const index: number = regionInfoData.findIndex((regionInfo: IRegion) => regionInfo.code === region[0]);
                const resData: IRegion[] = await RequestUtil.get(`/tower-system/region/${region[0]}`);
                regionInfoData[index] = {
                    ...regionInfoData[index],
                    children: resData
                }
                // if(region[1]) {
                //     const childrenIndex: number = regionInfoData[index].children.findIndex((regionInfo: IRegion) => regionInfo.code === region[1]);
                //     const resChildrenData: IRegion[] = await RequestUtil.get(`/tower-system/region/${ region[1] }`);
                //     regionInfoData[index].children[childrenIndex] = {
                //         ...regionInfoData[index].children[childrenIndex],
                //         children: resChildrenData
                //     }
                // }
                this.setState({
                    regionInfoData: regionInfoData
                })
            }
        }
    }

    /**
     * @override
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        if (this.state.contract) {
            return super.getFormItemGroups();
        }
        return [];
    }

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
    public async onSubmit(values: Record<string, any>): Promise<void> {
        const planValue: IPaymentPlanDto[] = this.getForm()?.getFieldsValue(true).paymentPlanDtos;
        let totalRate: number = 0;
        planValue.map<number>((item: IPaymentPlanDto): number => {
            return totalRate = parseFloat((Number(item.returnedRate) + Number(totalRate)).toFixed(2));
        })
        let totalAmount: number = 0;
        planValue.map<number>((item: IPaymentPlanDto): number => {
            return totalAmount = parseFloat((Number(item.returnedAmount) + Number(totalAmount)).toFixed(2));
        })
        values.customerInfoDto = {
            ...(this.state.contract?.customerInfoDto),
            customerLinkman: values.customerLinkman,
            customerPhone: values.customerPhone
        };
        values.signContractTime = values.signContractTime && moment(values.signContractTime).format('YYYY-MM-DD');
        values.deliveryTime = values.deliveryTime && moment(values.deliveryTime).format('YYYY-MM-DD');
        values.reviewTime = values.reviewTime && moment(values.reviewTime).format('YYYY-MM-DD HH:mm');
        values.paymentPlanDtos = values.paymentPlanDtos?.map((plan: IPaymentPlanDto, index: number): IPaymentPlanDto => {
            return {
                ...plan,
                returnedTime: moment(plan.returnedTime).format('YYYY-MM-DD'),
                period: index + 1
            };
        });
        values.signCustomerId = this.state.contract?.signCustomerId;
        console.log(totalAmount, values.contractAmount)
        values.region = Array.isArray(values?.region) ? values?.region?.[0] : values?.region;
        if(planValue.length>0){
            if (totalRate < 100) {
                message.error('计划回款总占比必须等于100');
                return Promise.reject(false);
            } else if (totalRate > 100) {
                message.error('计划回款总占比必须等于100');
                return Promise.reject(false);
            } else if (totalAmount < values.contractAmount) {
                message.error('计划回款总金额必须等于合同总价');
                return Promise.reject(false);
            } else if (totalAmount > values.contractAmount) {
                message.error('计划回款总金额必须等于合同总价');
                return Promise.reject(false);
            } else {
                return await RequestUtil.put('/tower-market/contract', {
                    ...values,
                    id: this.props.match.params.id,
                    projectId: (this.state.contract as any).projectId
                });
            }
        }else{
            message.error('回款计划无数据，需新增！');
            return Promise.reject(false);
        }
    }

    /**
     * @override
     * @description Descriptions product change approval
     * @returns extra operation area 
     */
    protected renderExtraOperationArea(): React.ReactNode {
        return null;
    }
}

export default withRouter(withTranslation()(ContractSetting));