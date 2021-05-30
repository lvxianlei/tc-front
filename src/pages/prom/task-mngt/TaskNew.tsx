/**
 * @author lxy
 * @copyright © 2021 
 */
 import { WithTranslation, withTranslation } from 'react-i18next';
 import { RouteComponentProps, withRouter } from 'react-router';
 
 import RequestUtil from '../../../utils/RequestUtil';
 import AbstractTaskSetting, { IAbstractTaskSettingState } from './AbstactTaskSetting';
 import moment from 'moment'
 
 export interface ITaskNewProps {}
 export interface ITaskNewRouteProps extends RouteComponentProps<ITaskNewProps>, WithTranslation {}
 export interface ITaskNewState extends IAbstractTaskSettingState {}
 
 /**
  * Create a new client.
  */
 class TaskNew extends AbstractTaskSetting<ITaskNewRouteProps, ITaskNewState> {
 
     /**
      * @implements
      * @description Determines whether submit on
      * @param values 
      * @returns submit 
      */
     public async onSubmit(values: Record<string, any>): Promise<void> {
        values.signTaskTime = moment(values.signTaskTime).format('YYYY-MM-DD');
        values.deliveryTime = moment(values.deliveryTime).format('YYYY-MM-DD');
        values.reviewTime = moment(values.reviewTime).format('YYYY-MM-DD HH:mm');
        // values.paymentPlanDtos = values.paymentPlanDtos?.map((plan: IPaymentPlanDto, index: number): IPaymentPlanDto => {
        //     return {
        //         ...plan,
        //         returnedTime: moment(plan.returnedTime).format('YYYY-MM-DD'),
        //         index: index + 1
        //     };
        // });
         console.log(values )
         return Promise.resolve();
        //  return await RequestUtil.post('/tower-market/contract', values);
     }
 }
 
 export default withRouter(withTranslation()(TaskNew));