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
         const planValue: IPaymentPlanDto[] = this.getForm()?.getFieldsValue(true).paymentPlanDtos;
         let totalRate: number = 0;
         planValue.map<number>((item: IPaymentPlanDto): number => {
             return totalRate = parseFloat((Number(item.returnedRate) + Number(totalRate)).toFixed(2));
         })
         let totalAmount: number = 0;
             planValue.map<number>((item: IPaymentPlanDto): number => {
                 return  totalAmount = parseFloat((Number(item.returnedAmount) + Number(totalAmount)).toFixed(2));
             })
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
         values.customerInfoDto = {
             ...(this.state.contract?.customerInfoDto),
             customerLinkman: values.customerLinkman,
             customerPhone: values.customerPhone
         };
         values.signCustomerId = this.state.contract?.signCustomerId;
         if( totalRate < 100) {
             message.error('计划回款总占比必须等于100');
             return Promise.reject(false);
         } else if( totalRate > 100 ) {
             message.error('计划回款总占比必须等于100');
             return Promise.reject(false);
         } else if( totalAmount < values.contractAmount ) {
             message.error('计划回款总金额必须等于合同总价');
             return Promise.reject(false);
         } else if( totalAmount > values.contractAmount ) {
             message.error('计划回款总金额必须等于合同总价');
             return Promise.reject(false);
         } else {
             return await RequestUtil.post('/tower-market/contract', values);
         }
     }
 }
 
 export default withRouter(withTranslation()(MaterialExtractionNew));
 