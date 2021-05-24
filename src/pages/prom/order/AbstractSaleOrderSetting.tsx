/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, DatePicker, Input, Select } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { PlusOutlined } from '@ant-design/icons';


import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../../components/AbstractFillableComponent';

export interface IAbstractSaleOrderSettingState extends IAbstractFillableComponentState {
    readonly saleOrder?: ISaleOrder;
}

export interface ISaleOrder {
    readonly id?: number;
    readonly ordersNumber?: number;
    readonly contractInfoDto?: IContractInfoDto;
    readonly chargeType?: number;
    readonly orderQuantity?: number;
    readonly type?: number;
    readonly taxAmount?: number;
    readonly taxPrice?: number;
    readonly taxRate?: number;
    readonly amount?: number;
    readonly price?: number;
    readonly exchangeRate?: number;
    readonly foreignExchangeAmount?: number;
    readonly foreignPrice?: number;
    readonly guaranteeAmount?: number;
    readonly portCharge?: number;
    readonly insuranceCharge?: number;
    readonly commissionCharge?: number;
    readonly creditInsurance?: number;
    readonly orderDeliveryTime?: string;
    readonly description?: string;
}

interface IContractInfoDto {
    readonly contractNumber?: string;
    readonly internalNumber?: string;
    readonly projectName?: string;
    readonly customerCompany?: string;
    readonly signCustomerName?: string;
    readonly signsaleOrderTime?: string;
    readonly deliveryTime?: string;
}
/**
 * Abstract SaleOrder Setting
 */
export default abstract class AbstractSaleOrderSetting<P extends RouteComponentProps, S extends IAbstractSaleOrderSettingState> extends AbstractFillableComponent<P, S> {

    public state: S = {
        saleOrder: undefined
    } as S;

    /**
     * @override
     * @description Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return "/prom/order";
    }

    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        const saleOrder: ISaleOrder | undefined = this.state.saleOrder;
        return [[{
            title: '基础信息',
            itemProps: [{
                label: '订单编号',
                name: 'ordersNumber',
                initialValue: saleOrder?.ordersNumber,
                rules: [{
                    required: true,
                    message: '请输入订单编号'
                }],
                children: <Input/>
            }, {
                label: '采购订单号',
                name: 'name',
                // initialValue: saleOrder?.name,
                children: <Input/>
            }, {
                label: '关联合同',
                name: 'contractNumber',
                initialValue: saleOrder?.contractInfoDto?.contractNumber,
                rules: [{
                    required: true,
                    message: '请选择关联合同'
                }],
                children:
                    <>
                        {/* <Input value={ saleOrder?.contractInfoDto?.contractNumber } suffix={
                            <Button type="text" target="customerCompany"  onClick={() => this.showModal({tip: "contractNumber"})}>
                                <PlusOutlined />
                            </Button>
                        }/> */}
                        {/* { this.renderModal() } */}
                    </>
            },  {
                label: '内部合同编号',
                name: 'internalNumber',
                initialValue: saleOrder?.contractInfoDto?.internalNumber,
                children: <Input disabled/>
            }, {
                label: '工程名称',
                name: 'projectName',
                initialValue: saleOrder?.contractInfoDto?.projectName,
                children: <Input disabled/>
            },  {
                label: '业主单位',
                name: 'customerCompany',
                initialValue: saleOrder?.contractInfoDto?.customerCompany,
                children: <Input disabled/>
            }, {
                label: '合同签订单位',
                name: 'signCustomerName',
                initialValue: saleOrder?.contractInfoDto?.signCustomerName,
                children: <Input disabled/>
            }, {
                label: '合同签订日期',
                name: 'signsaleOrderTime',
                initialValue: saleOrder?.contractInfoDto?.signsaleOrderTime,
                children:  <Input disabled/>
            },  {
                label: '要求交货日期',
                name: 'deliveryTime',
                initialValue: saleOrder?.contractInfoDto?.deliveryTime,
                children:  <Input disabled/>
            }, {
                label: '计价方式',
                name: 'chargeType',
                initialValue: saleOrder?.chargeType == 1 ? "订单总价、总重计算单价" : "产品单价、基数计算总价",
                children: <Input disabled/>
            }, {
                label: '币种',
                name: 'currencyType',
                // initialValue: saleOrder?.currencyType == 1 ? "RMB人民币" : "USD美元",
                children: <Input disabled/>
            }, {
                label: '订单数量',
                name: 'orderQuantity',
                initialValue: saleOrder?.orderQuantity,
                children: <Input disabled/>
            }, {
                label: '含税金额',
                name: 'taxAmount',
                initialValue: saleOrder?.taxAmount,
                children: <Input  prefix="￥" disabled/>
            }, {
                label: '含税单价',
                name: 'taxPrice',
                initialValue: saleOrder?.taxPrice,
                children: <Input  prefix="￥" disabled/>
            }, {
                label: '税率',
                name: 'taxRate',
                initialValue: saleOrder?.taxRate,
                children: 
                    <Select>
                        <Select.Option value={ 1 }>6.15</Select.Option>
                        <Select.Option value={ 2 }>0.027</Select.Option>
                    </Select>
            }, {
                label: '不含税金额',
                name: 'amount',
                initialValue: saleOrder?.amount,
                children: <Input  prefix="￥" disabled/>
            }, {
                label: '不含税单价',
                name: 'price',
                initialValue: saleOrder?.price,
                children: <Input  prefix="￥" disabled/>
            }, {
                label: '汇率',
                name: 'exchangeRate',
                initialValue: saleOrder?.exchangeRate,
                children:  <Input/>
            }, {
                label: '外汇金额',
                name: 'foreignExchangeAmount',
                initialValue: saleOrder?.foreignExchangeAmount,
                children:  <Input/>
            }, {
                label: '外汇单价',
                // name: 'deliveryTime',
                // initialValue: saleOrder?.deliveryTime,
                children:  <Input/>
            }, {
                label: '保函类型',
                name: 'foreignPrice',
                initialValue: saleOrder?.foreignPrice,
                children:  <Input/>
            }, {
                label: '保函金额',
                name: 'guaranteeAmount',
                initialValue: saleOrder?.guaranteeAmount,
                children:  <Input/>
            }, {
                label: '港口费用',
                name: 'portCharge',
                initialValue: saleOrder?.portCharge,
                children:  <Input/>
            }, {
                label: '海运及保险费',
                name: 'insuranceCharge',
                initialValue: saleOrder?.insuranceCharge,
                children:  <Input/>
            }, {
                label: '佣金',
                name: 'commissionCharge',
                initialValue: saleOrder?.commissionCharge,
                children:  <Input/>
            }, {
                label: '出口信用保险',
                name: 'creditInsurance',
                initialValue: saleOrder?.creditInsurance,
                children:  <Input/>
            }, {
                label: '订单交货日期',
                name: 'orderDeliveryTime',
                initialValue: saleOrder?.orderDeliveryTime,
                rules: [{
                    required: true,
                    message: '请选择订单交货日期'
                }],
                children:  <DatePicker showTime format="YYYY-MM-DD" />
            }, {
                label: '备注',
                name: 'description',
                initialValue: saleOrder?.description,
                children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息"/>
            }]
        }]];
    }
}