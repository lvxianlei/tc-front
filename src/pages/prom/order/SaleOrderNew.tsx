/**
 * @author zyc
 * @copyright © 2021 
 */
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractSaleOrderSetting, { IAbstractSaleOrderSettingState } from './AbstractSaleOrderSetting';
import moment from 'moment'

export interface ISaleOrderNewProps {}
export interface ISaleOrderNewRouteProps extends RouteComponentProps<ISaleOrderNewProps>, WithTranslation {}
export interface ISaleOrderNewState extends IAbstractSaleOrderSettingState {}

/**
 * Create a new client.
 */
class SaleOrderNew extends AbstractSaleOrderSetting<ISaleOrderNewRouteProps, ISaleOrderNewState> {

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
    public async onSubmit(values: Record<string, any>): Promise<void> {
        // values.signSaleOrderTime = moment(values.signSaleOrderTime).format('YYYY-MM-DD');
        // values.deliveryTime = moment(values.deliveryTime).format('YYYY-MM-DD');
        // values.reviewTime = moment(values.reviewTime).format('YYYY-MM-DD HH:mm');
        // values.paymentPlanDtos = values.paymentPlanDtos?.map((plan: IPaymentPlanDto, index: number): IPaymentPlanDto => {
        //     return {
        //         ...plan,
        //         returnedTime: moment(plan.returnedTime).format('YYYY-MM-DD'),
        //         index: index + 1
        //     };
        // });
    //  return Promise.resolve();
        return await RequestUtil.post('/tower-market/SaleOrder', values);
    }
}

export default withRouter(withTranslation()(SaleOrderNew));