/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IFormItemGroup } from '../../../components/AbstractFillableComponent';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractContractSetting, { IAbstractContractSettingState, IattachDTO, IContract, IPaymentPlanDto } from './AbstractContractSetting';
import moment from 'moment'

export interface IContractSettingProps {
    readonly id: string;
}
export interface IContractSettingRouteProps extends RouteComponentProps<IContractSettingProps>, WithTranslation {}
export interface IContractSettingState extends IAbstractContractSettingState {}
 
interface IRegion {
    readonly name: string;
    readonly code: string;
    children: IRegion[];
}
 /**
  * Contract Setting
  */
class ContractSetting extends AbstractContractSetting<IContractSettingRouteProps, IContractSettingState> {
 
    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const contract: IContract = await RequestUtil.get<IContract>(`/tower-market/contract/${ this.props.match.params.id }`);
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
        contract.attachInfoDtos = contract.attachVos?.map<IattachDTO>((attach: IattachDTO, index: number): IattachDTO => {
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
            id: contract.id,
            internalNumber: contract.internalNumber,
            projectName: contract.projectName,
            simpleProjectName: contract.simpleProjectName,
            winBidType: contract.winBidType,
            saleType: contract.saleType,
            signCustomerName: contract.signCustomerName,
            signContractTime: moment(contract.signContractTime),
            signUserName: contract.signUserName,
            deliveryTime: moment(contract.deliveryTime),
            reviewTime: moment(contract.reviewTime),
            chargeType: contract.chargeType,
            salesman: contract.salesman,
            region: contract.region || [],
            countryCode: contract.countryCode,
            contractAmount: contract.contractAmount,
            currencyType: contract.currencyType,
            description: contract.description,
            planType: contract.planType,
            paymentPlanDtos: contract.paymentPlanDtos,
            attachInfoDtos: contract?.attachInfoDtos,
            customerCompany: contract.customerInfoVo?.customerCompany,
            customerLinkman: contract.customerInfoVo?.customerLinkman,
            customerPhone: contract.customerInfoVo?.customerPhone
        });
        const region: [] = this.state.contract.region;
        let regionInfoData: IRegion[] =  this.state.regionInfoData;
        if(region.length > 0) {
            region.map(async (item: string) => {
                const index: number = regionInfoData.findIndex((regionInfo: IRegion) => regionInfo.code === item);
                const resData: IRegion[] = await RequestUtil.get(`/tower-system/region/${ item }`);
                regionInfoData[index].children = resData;
                console.log(regionInfoData)
            })
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
        values.customerInfoDto = this.state.contract?.customerInfoDto;
        values.signContractTime = moment(values.signContractTime).format('YYYY-MM-DD');
        values.deliveryTime = moment(values.deliveryTime).format('YYYY-MM-DD');
        values.reviewTime = moment(values.reviewTime).format('YYYY-MM-DD HH:mm');
        values.paymentPlanDtos = values.paymentPlanDtos?.map((plan: IPaymentPlanDto, index: number): IPaymentPlanDto => {
            return {
                ...plan,
                returnedTime: moment(plan.returnedTime).format('YYYY-MM-DD'),
                index: index + 1
            };
        });
        return await RequestUtil.put('/tower-market/contract', {
            ...values,
            id: this.props.match.params.id
        });
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