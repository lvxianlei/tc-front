/**
 * @author zyc
 * @copyright © 2021 
 */
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IFormItemGroup } from '../../../components/AbstractFillableComponent';

import RequestUtil from '../../../utils/RequestUtil';
import AbstractSaleOrderSetting, { IAbstractSaleOrderSettingState, ISaleOrder, IProductVo } from './AbstractSaleOrderSetting';

export interface IChangeProductProps {
    readonly id: string;
}
export interface IChangeProductRouteProps extends RouteComponentProps<IChangeProductProps>, WithTranslation {}
export interface IChangeProductState extends IAbstractSaleOrderSettingState {}

/**
 * Contract Setting
 */
class ChangeProduct extends AbstractSaleOrderSetting<IChangeProductRouteProps, IChangeProductState> {

    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const saleOrder: ISaleOrder = await RequestUtil.get<ISaleOrder>(`/tower-market/saleOrder/${ this.props.match.params.id }`);
        this.setState({
            saleOrder: saleOrder,
            isChangeProduct: true
        });
        saleOrder.productDtos = saleOrder.productDtos?.map<IProductVo>((product: IProductVo, index: number): IProductVo => {
            return {
                ...product,
                index: index + 1
            };
        });
        this.setState({
            saleOrder: {
                ...saleOrder,
                contractInfoDto: saleOrder.contractInfoVo
            }
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
        return await RequestUtil.post(`/tower-market/saleOrder/submitProductContentChangeAudit?saleOrderId=${ values.productDtos[0].saleOrderId }`, {
            ...values.productDtos
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

export default withRouter(withTranslation()(ChangeProduct));