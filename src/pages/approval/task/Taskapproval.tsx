/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
 import React from 'react';
 import { WithTranslation, withTranslation } from 'react-i18next';
 import { RouteComponentProps, withRouter } from 'react-router';
 import { IFormItemGroup } from '../../../components/AbstractFillableComponent';
 
 import RequestUtil from '../../../utils/RequestUtil';
 import AbstractTaskapproval, { IAbstractContractSettingState, IContract, IPaymentPlanDto } from './AbstractTaskapproval';
 import moment from 'moment'
 
 export interface IContractSettingProps {
     readonly id: string;
 }
 export interface IContractSettingRouteProps extends RouteComponentProps<IContractSettingProps>, WithTranslation {}
 export interface IContractSettingState extends IAbstractContractSettingState {}
  
  /**
   * Contract Setting
   */
 class ContractSetting extends AbstractTaskapproval<IContractSettingRouteProps, IContractSettingState> {
  
     /**
      * @description Components did mount
      */
     public async componentDidMount() {
         super.componentDidMount();
         const contract: IContract = await RequestUtil.get<IContract>(`/tower-market/contract/page/${ this.props.match.params.id }`);
         this.setState({
             contract: contract
         });
         contract.paymentPlanDtos = contract.paymentPlanDtos?.map<IPaymentPlanDto>((plan: IPaymentPlanDto, index: number): IPaymentPlanDto => {
             return {
                 ...plan,
                 returnedTime: moment(plan.returnedTime),
                 index: index + 1
             };
         });
         console.log(contract)
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
             salesman: contract.saleType,
             region: [],
             countryCode: contract.countryCode,
             contractAmount: contract.contractAmount,
             currencyType: contract.currencyType,
             description: contract.description,
             planType: contract.planType,
             paymentPlanDtos: contract.paymentPlanDtos,
             attachInfoDtos: contract?.attachInfoDtos
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
         values.customerInfoDto = this.state.contract?.customerInfoDto;
         return await RequestUtil.put('/tower-customer/customer', {
             ...values,
             id: Number(this.props.match.params.id)
         });
     }
 
     /**
      * @override
      * @description Renders save and continue
      * @returns save and continue 
      */
     protected renderSaveAndContinue(): React.ReactNode {
         return null;
     }
 }
  
 export default withRouter(withTranslation()(ContractSetting));