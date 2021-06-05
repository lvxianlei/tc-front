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

export interface IContractSettingProps {
    readonly id: string;
}
export interface IContractSettingRouteProps extends RouteComponentProps<IContractSettingProps>, WithTranslation {}
export interface IContractSettingState extends IAbstractSaleOrderSettingState {}

/**
 * Contract Setting
 */
class SaleOrderSetting extends AbstractSaleOrderSetting<IContractSettingRouteProps, IContractSettingState> {

    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const saleOrder: ISaleOrder = await RequestUtil.get<ISaleOrder>(`/tower-market/saleOrder/${ this.props.match.params.id }`);
        this.setState({
            saleOrder: saleOrder
        });
        saleOrder.productVos = saleOrder.productVos?.map<IProductVo>((product: IProductVo, index: number): IProductVo => {
            return {
                ...product,
                index: index + 1
            };
        });
        this.getForm()?.setFieldsValue({
            productVos: saleOrder.productVos,
            totalWeight: saleOrder.orderQuantity,
            totalPrice: saleOrder.taxPrice,
            totalAmount: saleOrder.taxAmount,
            orderQuantity: saleOrder.orderQuantity,
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
        return await RequestUtil.put('/tower-customer/customer', {
            ...values,
            id: Number(this.props.match.params.id)
        });
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

export default withRouter(withTranslation()(SaleOrderSetting));