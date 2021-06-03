/**
 * @author zyc
 * @copyright © 2021 
 */
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractSaleOrderSetting, { IAbstractSaleOrderSettingState, IContractInfoVo } from './AbstractSaleOrderSetting';
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
        let contractInfoVo: IContractInfoVo = {};
        const contract: IContractInfoVo | undefined = this.state.saleOrder?.contractInfoVo;
        contractInfoVo = {
            chargeType: values.chargeType,
            contractId: contract?.contractId,
            currencyType: values.currencyType,
            customerCompany: values.customerCompany,
            deliveryTime: values.deliveryTime,
            internalNumber: values.internalNumber,
            projectName: values.projectName,
            signContractTime: values.signContractTime,
            signCustomerId: contract?.signCustomerId,
            signCustomerName: values.signCustomerName,
        }
        values = {
            ...values,
            contractInfoVo
        }
        return await RequestUtil.post('/tower-market/saleOrder', values);
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