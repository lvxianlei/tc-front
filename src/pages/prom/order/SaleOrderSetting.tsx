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
import AbstractSaleOrderSetting, { IAbstractSaleOrderSettingState, ISaleOrder, IProductVo, IContractInfoDto, ChargeType } from './AbstractSaleOrderSetting';

export interface ISaleOrderSettingProps {
    readonly id: string;
}
export interface ISaleOrderSettingRouteProps extends RouteComponentProps<ISaleOrderSettingProps>, WithTranslation {}
export interface ISaleOrderSettingState extends IAbstractSaleOrderSettingState {}

/**
 * SaleOrder Setting
 */
export class SaleOrderSetting extends AbstractSaleOrderSetting<ISaleOrderSettingRouteProps, ISaleOrderSettingState> {

    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const saleOrder: ISaleOrder = await RequestUtil.get<ISaleOrder>(`/tower-market/saleOrder/${ this.props.match.params.id }`);
        saleOrder.orderProductDtos = saleOrder.orderProductVos?.map<IProductVo>((product: IProductVo, index: number): IProductVo => {
            return {
                ...product,
                num: product.num == -1 ? undefined : product.num,
                index: index + 1
            };
        });
        this.setState({
            saleOrder: {
                ...saleOrder,
                price: saleOrder.price == -1 ? undefined : saleOrder.price,
                orderProductDtos: saleOrder.orderProductDtos,
                contractInfoDto: saleOrder.contractInfoVo
            },
            orderQuantity: saleOrder.orderQuantity,
            isSetting: true
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
            orderProductDtos: saleOrder.orderProductDtos,
            price: saleOrder.price == -1 ? '-' : saleOrder.price,
        });
        this.getColumnsChange(saleOrder.contractInfoVo?.chargeType || 0);
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
            contractNumber: values.contractNumber
        }
        if(values.chargeType === ChargeType.UNIT_PRICE) {
            values.price = undefined;
        }
        values.orderProductDtos = this.state.saleOrder?.orderProductDtos && this.state.saleOrder?.orderProductDtos.map((items: IProductVo, index: number) => {
            return {
                ...items,
                taskNoticeId: items.taskNoticeId == -1 ? '' : items.taskNoticeId,
                tender: this.getForm()?.getFieldsValue(true).orderProductDtos[index].tender,
                productCategoryId: items.productCategoryId,
                productId: items.productId
            }
        })
        values = {
            ...values,
            exchangeRate: values.exchangeRate === null ? 0 : values.exchangeRate,
            foreignExchangeAmount: values.foreignExchangeAmount === null ? 0 : values.foreignExchangeAmount,
            foreignPrice: values.foreignPrice === null ? 0 : values.foreignPrice,
            guaranteeType: values.guaranteeType === null ? 0 : values.guaranteeType,
            guaranteeAmount: values.guaranteeAmount === null ? 0 : values.guaranteeAmount,
            portCharge: values.portCharge === null ? 0 : values.portCharge,
            insuranceCharge: values.insuranceCharge === null ? 0 : values.insuranceCharge,
            commissionCharge: values.commissionCharge === null ? 0 : values.commissionCharge,
            creditInsurance: values.creditInsurance === null ? 0 : values.creditInsurance,
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