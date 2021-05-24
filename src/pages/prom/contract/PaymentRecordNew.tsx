/**
 * @author zyc
 * @copyright © 2021 
 */
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractPaymentRecordSetting, { IAbstractPaymentRecordSettingState } from './AbstractPaymentRecordSetting';
import moment from 'moment'

export interface IContractNewProps {}
export interface IContractNewRouteProps extends RouteComponentProps<IContractNewProps>, WithTranslation {}
export interface IContractNewState extends IAbstractPaymentRecordSettingState {}

 /**
  * Create a new paymentRecord.
  */
class PaymentRecordNew extends AbstractPaymentRecordSetting<IContractNewRouteProps, IContractNewState> {

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
    public async onSubmit(values: Record<string, any>): Promise<void> {
        values.refundTime = moment(values.refundTime).format('YYYY-MM-DD HH:mm');
        //  return Promise.resolve();
        console.log(values)
        return await RequestUtil.post('/paymentRecord', values);
    }
}

export default withRouter(withTranslation()(PaymentRecordNew));