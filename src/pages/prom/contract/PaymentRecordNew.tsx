/**
 * @author zyc
 * @copyright © 2021 
 */
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractPaymentRecordSetting, { IAbstractPaymentRecordSettingState, IPaymentRecord } from './AbstractPaymentRecordSetting';
import moment from 'moment'

export interface IPaymentRecordNewProps {
    readonly id: string;
    readonly projectName: string;
    readonly signCustomerId: string;
    readonly signCustomerName: string;
}
export interface IPaymentRecordNewRouteProps extends RouteComponentProps<IPaymentRecordNewProps>, WithTranslation {}
export interface IPaymentRecordNewState extends IAbstractPaymentRecordSettingState {}

 /**
  * Create a new paymentRecord.
  */
class PaymentRecordNew extends AbstractPaymentRecordSetting<IPaymentRecordNewRouteProps, IPaymentRecordNewState> {

    /**
     * @description Components did mount
     */
     public async componentDidMount() {
        super.componentDidMount();
        const paymentRecord: IPaymentRecord | undefined = this.state.paymentRecord;
        this.setState({
            paymentRecord: {
                ...paymentRecord,
                contractId: this.props.match.params.id,
                projectName: this.props.match.params.projectName,
                customerId: this.props.match.params.signCustomerId,
                customerName: this.props.match.params.signCustomerName,
            },
            id: this.props.match.params.id
        });
        this.getForm()?.setFieldsValue({ contractId: this.props.match.params.id,
            projectName: this.props.match.params.projectName,
            customerId: this.props.match.params.signCustomerId,
            customerName: this.props.match.params.signCustomerName, })
    }

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
            customerId: this.state?.paymentRecord?.customerId
        }
        return await RequestUtil.post('/tower-market/paymentRecord', confirmValues);
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

export default withRouter(withTranslation()(PaymentRecordNew));