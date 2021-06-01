/**
 * @author zyc
 * @copyright © 2021 
 */
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractPaymentRecordSetting, { IAbstractPaymentRecordSettingState } from './AbstractPaymentRecordSetting';
import moment from 'moment'
import Form from 'antd/lib/form/Form';
import { stringify } from 'query-string';

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
        values.returnedTime =  moment(values.returnedTime).format('YYYY-MM-DD HH:mm');
        //  return Promise.resolve();
        const confirmValues: Record<string, any> = {
            ...values,
            signCustomerId: this.state?.paymentRecord?.signCustomerId
        }
        console.log(confirmValues)
        return await RequestUtil.post('/tower-market/paymentRecord', confirmValues);
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

export default withRouter(withTranslation()(PaymentRecordNew));