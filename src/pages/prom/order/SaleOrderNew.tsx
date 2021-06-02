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
        values.orderDeliveryTime = moment(values.orderDeliveryTime).format('YYYY-MM-DD');
        return await RequestUtil.post('/tower-market/SaleOrder', values);
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

export default withRouter(withTranslation()(SaleOrderNew));