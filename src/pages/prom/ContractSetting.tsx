/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
 import moment from 'moment';
import React from 'react';
 import { WithTranslation, withTranslation } from 'react-i18next';
 import { RouteComponentProps, withRouter } from 'react-router';
 import { IFormItemGroup } from '../../components/AbstractFillableComponent';
 
 import RequestUtil from '../../utils/RequestUtil';
 import AbstractContractSetting, { IAbstractContractSettingState, IContract } from './AbstractContractSetting';
 
 export interface IContractSettingProps {
     readonly id: string;
 }
 export interface IContractSettingRouteProps extends RouteComponentProps<IContractSettingProps>, WithTranslation {}
 export interface IContractSettingState extends IAbstractContractSettingState {}
 
 /**
  * Contract Setting
  */
 class ContractSetting extends AbstractContractSetting<IContractSettingRouteProps, IContractSettingState> {
 
     /**
      * @description Components did mount
      */
     public async componentDidMount() {
         super.componentDidMount();
         const contract: IContract = await RequestUtil.get<IContract>(`/customer/contract/${ this.props.match.params.id }`);
         
         contract.deliveryTime = moment(contract.deliveryTime)
         console.log(contract)
         this.setState({
            contract: contract
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