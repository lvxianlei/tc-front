/**
 * @author zyc
 * @copyright © 2021
 */
import moment from 'moment';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IFormItemGroup } from '../../../components/AbstractFillableComponent';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractSaleOrderSetting, { IAbstractSaleOrderSettingState, ISaleOrder, IProductVo, IContractInfoDto } from './AbstractSaleOrderSetting';

export interface ISaleOrderSettingProps {
    readonly id: string;
}
export interface ISaleOrderSettingRouteProps extends RouteComponentProps<ISaleOrderSettingProps>, WithTranslation {}
export interface ISaleOrderSettingState extends IAbstractSaleOrderSettingState {}

/**
 * SaleOrder Setting
 */
class SaleOrderSetting extends AbstractSaleOrderSetting<ISaleOrderSettingRouteProps, ISaleOrderSettingState> {

    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const saleOrder: ISaleOrder = await RequestUtil.get<ISaleOrder>(`/tower-market/saleOrder/${ this.props.match.params.id }`);
        this.setState({
            saleOrder: saleOrder
        });
        saleOrder.productDtos = saleOrder.productVos?.map<IProductVo>((product: IProductVo, index: number): IProductVo => {
            return {
                ...product,
                index: index + 1
            };
        });
        this.setState({
            saleOrder: {
                ...saleOrder,
                productDtos: saleOrder.productVos,
                contractInfoDto: saleOrder.contractInfoVo
            },
            orderQuantity: saleOrder.orderQuantity
        })
        this.getForm()?.setFieldsValue({
            totalWeight: saleOrder.orderQuantity,
            totalPrice: saleOrder.taxPrice,
            totalAmount: saleOrder.taxAmount,
            orderQuantity: saleOrder.orderQuantity,
            chargeType: saleOrder.contractInfoVo?.chargeType,
            contractId: saleOrder.contractInfoVo?.contractId,
            currencyType: saleOrder.contractInfoVo?.currencyType,
            customerCompany: saleOrder.contractInfoVo?.customerCompany,
            deliveryTime: saleOrder.contractInfoVo?.deliveryTime,
            internalNumber: saleOrder.contractInfoVo?.internalNumber,
            projectName: saleOrder.contractInfoVo?.projectName,
            signContractTime: saleOrder.contractInfoVo?.signContractTime,
            signCustomerId: saleOrder.contractInfoVo?.signCustomerId,
            signCustomerName: saleOrder.contractInfoVo?.signCustomerName,
            productDtos: saleOrder.productVos,
        });
    }

    /**
     * @override
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        if (this.state.saleOrder) {
            return super.getFormItemGroups();
        }
        return [];
    }

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
        values = {
            ...values,
            contractInfoDto
        }
        return await RequestUtil.put('/tower-market/saleOrder', {
            ...values,
            id: this.props.match.params.id
        });
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

export default withRouter(withTranslation()(SaleOrderSetting));