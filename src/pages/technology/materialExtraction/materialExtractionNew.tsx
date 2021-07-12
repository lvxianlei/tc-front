/**
 * @author zyc
 * @copyright © 2021 
 */
 import { WithTranslation, withTranslation } from 'react-i18next';
 import { RouteComponentProps, withRouter } from 'react-router';
 
 import RequestUtil from '../../../utils/RequestUtil';
 import AbstractMaterialExtractionSetting, { IAbstractMaterialExtractionSettingState, IPaymentPlanDto, planType } from './AbstractMaterialExtractionSetting';
 import moment from 'moment'
 import { message } from 'antd';
 
 export interface IMaterialExtractionNewProps {}
 export interface IMaterialExtractionNewRouteProps extends RouteComponentProps<IMaterialExtractionNewProps>, WithTranslation {}
 export interface IMaterialExtractionNewState extends IAbstractMaterialExtractionSettingState {}
 
 /**
  * Create a new client.
  */
 class MaterialExtractionNew extends AbstractMaterialExtractionSetting<IMaterialExtractionNewRouteProps, IMaterialExtractionNewState> {
 
     /**
      * @implements
      * @description Determines whether submit on
      * @param values 
      * @returns submit 
      */
     public async onSubmit(values: Record<string, any>): Promise<void> {
        // this.getForm()?.getFieldsValue(true).paymentPlanDtos;
        //  if( ) {
        //      return Promise.reject(false);
        //  } else {
        //      return await RequestUtil.post('/tower-market/contract', values);
        //  }
     }
 }
 
 export default withRouter(withTranslation()(MaterialExtractionNew));
 