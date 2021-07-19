/**
 * @author zyc
 * @copyright © 2021 
 */
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractSaleOrderSetting, { IAbstractSaleOrderSettingState, IContractInfoDto, IProductVo } from './AbstractSaleOrderSetting';
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
        let contractInfoDto: IContractInfoDto = {};
        const contract: IContractInfoDto | undefined = this.state.saleOrder?.contractInfoDto;
        contractInfoDto = {
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
        values.orderProductDtos = this.state.saleOrder?.orderProductDtos && this.state.saleOrder?.orderProductDtos.map((items: IProductVo) => {
            return {
                ...items,
                productCategoryId: items.productCategoryId,
                productId: items.productId
            }
        })
        values = {
            ...values,
            contractInfoDto
        }
        return await RequestUtil.post('/tower-market/saleOrder', values);
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

export default withRouter(withTranslation()(SaleOrderNew));