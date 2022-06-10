/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IFormItemGroup } from '../../../components/AbstractFillableComponent';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractContractSetting, { IAbstractContractSettingState, IAttachDTO, IPaymentPlanDto, ProjectContractInfo } from './AbstractContractSetting';
import moment from 'moment'
import { message } from 'antd';

export interface IContractSettingProps {
    projectId: string;
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
            contract: contract,
            region: (contract.region as any)
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
            signContractTime: contract.signContractTime && moment(contract.signContractTime).format("YYYY-MM-DD"),
            signUserName: contract.signUserName,
            deliveryTime: contract.deliveryTime, // 合同的要求交回日期改为input框
            reviewTime: contract.reviewTime && moment(contract.reviewTime),
            takeOverTime: contract.takeOverTime && moment(contract.takeOverTime).format("YYYY-MM-DD"),
            chargeType: contract.chargeType === -1 ? '' : contract.chargeType,
            salesman: contract.salesman,
            // region: Array.isArray(contract?.region) ? contract?.region : [contract?.region],
            region: this.state.contractAdd.address || "",
            country: contract.country || this.state.contractAdd.country,
            contractAmount: contract.contractAmount,
            currencyType: contract.currencyType,
            description: contract.description,
            planType: contract.planType,
            payType: contract.payType,
            takeOverUser: contract.takeOverUser,
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
            isIta: contract?.isIta,
            payCompanyName: contract?.payCompanyName,

            contractPlanStatus: contract?.contractPlanStatus,
            receivedContractShape: contract?.receivedContractShape,
            contractFraction: contract?.contractFraction,
            contractPage: contract?.contractPage,
            deliveryWay: contract?.deliveryWay,
            deliveryAddress: contract?.deliveryAddress,
            ecpContractNumber: contract?.ecpContractNumber,
        });
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
        values.deliveryTime = values.deliveryTime;
        values.reviewTime = values.reviewTime && moment(values.reviewTime).format('YYYY-MM-DD HH:mm');
        values.paymentPlanDtos = values.paymentPlanDtos?.map((plan: IPaymentPlanDto, index: number): IPaymentPlanDto => {
            return {
                ...plan,
                returnedTime: moment(plan.returnedTime).format('YYYY-MM-DD'),
                period: index + 1
            };
        });
        values.signCustomerId = this.state.contract?.signCustomerId;
        values.region = Array.isArray(values?.region) ? values?.region?.[0] : values?.region;
        values.payServiceManager = this.state.contract?.payServiceManager;
        if (planValue.length > 0) {
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
                    projectId: (this.state.contract as any).projectId,
                    fileIds: this.getAttchsRef()?.getDataSource().map(item => item.id)
                });
            }
        } else {
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