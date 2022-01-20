/**
 * @author zyc
 * @copyright © 2021
 */
import { FormProps, Input, InputNumber, Select, TableColumnType, TableProps } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import AbstractFillableComponent, { IAbstractFillableComponentState } from '../../../components/AbstractFillableComponent';
import { IRenderedSection } from '../../../utils/SummaryRenderUtil';
import moment from 'moment';
import styles from './AbstractSaleOrderSetting.module.less'
import ContractSelectionComponent from '../../../components/ContractSelectionModal';
import { DataType } from '../../../components/AbstractSelectableModal';
import { currencyTypeOptions, productTypeOptions, saleTypeOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
import { IProduct } from '../../IProduct';
import { IContract } from '../../IContract';
import layoutStyles from '../../../layout/Layout.module.less';
import { GetRowKey } from 'rc-table/lib/interface';
import { doNumber } from "../../../utils/KeepDecimals";
export interface IAbstractSaleOrderSettingState extends IAbstractFillableComponentState {
    readonly saleOrder?: ISaleOrder;
    readonly orderQuantity?: number;
    readonly newOption: IOption;
    readonly columns?: TableColumnType<object>[];
    readonly isSetting?: boolean;
}

export interface ISaleOrder {
    readonly id?: number;
    readonly saleOrderNumber?: number;
    readonly contractInfoDto?: IContractInfoDto;
    readonly orderQuantity?: number;
    readonly type?: number;
    readonly taxAmount: number;
    readonly taxPrice?: number;
    readonly taxRate: number;
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
    orderProductDtos?: IProductVo[];
    readonly purchaseOrderNumber?: string;
    readonly guaranteeType?: string;
    readonly totalWeight: number;
    readonly totalAmount: number;
    readonly totalPrice?: number;
    readonly orderProductVos: IProductVo[];
    readonly productChangeRecordVos?: IProductVo[];
    readonly contractInfoVo?: IContractInfoDto;
    readonly saleType?: number;
}

export interface ManagementSaleOrder extends ISaleOrder {
    orderWeight?: number;
    orderProjectName?: string;
    saleType?: number;
    salesman?: string;
    productType?: string;
    voltageGrade?: string;
}

export interface IProductVo extends IProduct {
    readonly num?: number;
    readonly productCategoryId?: string | number;
    readonly productId?: string | number;
}

export interface IContractInfoDto extends IContract {
    readonly orderDeliveryTime?: object;
    readonly contractId?: string;
    readonly orderProjectName?: string;
    readonly saleOrderNumber?: string;
    readonly purchaseOrderNumber?: string; // 合同编号
}

interface IOption {
    readonly value: number;
    readonly label: number;
}

export enum ChargeType {
    ORDER_TOTAL_WEIGHT = 0,   //订单总重
    UNIT_PRICE = 1,   //产品单价
}
/**
 * Abstract SaleOrder Setting
 */
export default abstract class AbstractSaleOrderSetting<P extends RouteComponentProps, S extends IAbstractSaleOrderSettingState> extends AbstractFillableComponent<P, S> {

    public state: S = this.getState();

    /**
     * @description Gets state
     * @returns state 
     */
    protected getState(): S {
        return {
            saleOrder: undefined,
            orderQuantity: 0,
            columns: this.getColumns(),
            isSetting: false
        } as S;
    }

    /**
     * @override
     * @description Gets form props
     * @returns form props 
     */
    protected getFormProps(): FormProps {
        return {
            ...super.getFormProps(),
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 16,
                offset: 1
            }
        };
    }

    public componentDidUpdate(): void {
        const orderQuantity: number | undefined = this.state.orderQuantity;
        this.getForm()?.setFieldsValue({ orderQuantity: orderQuantity });
    }

    /**
     * @override
     * @description Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return "/prom/order";
    }

    public onSelect = (selectedRows: DataType[] | any): void => {
        const saleOrder: ISaleOrder | undefined = this.state.saleOrder;
        if (selectedRows && selectedRows.length > 0) {
            const modalSelectedValue: IContractInfoDto = {
                internalNumber: selectedRows[0].internalNumber,
                projectName: selectedRows[0].projectName,
                customerCompany: selectedRows[0].customerCompany,
                signCustomerName: selectedRows[0].signCustomerName,
                signContractTime: selectedRows[0].signContractTime,
                deliveryTime: selectedRows[0].deliveryTime,
                currencyType: selectedRows[0].currencyType,
                chargeType: selectedRows[0].chargeType,
                orderDeliveryTime: moment(selectedRows[0].deliveryTime),
                contractId: selectedRows[0].id,
                signCustomerId: selectedRows[0].signCustomerId,
                signUserName: selectedRows[0].signUserName,
                contractNumber: selectedRows[0].contractNumber,
                saleType: selectedRows[0].saleType,
                purchaseOrderNumber: selectedRows[0].purchaseOrderNumber, // 关联合同编号
            };
            this.setState({
                saleOrder: {
                    ...(saleOrder || { taxAmount: 0, taxRate: 0, totalWeight: 0, totalAmount: 0, orderProductVos: [] }),
                    contractInfoDto: { ...modalSelectedValue },
                    orderProductDtos: []
                },
                orderQuantity: 0
            })
            if (selectedRows[0].chargeType === ChargeType.UNIT_PRICE) {
                this.getForm()?.setFieldsValue({ contractInfoDto: { ...modalSelectedValue }, ...modalSelectedValue, orderProductDtos: [] });
            } else {
                this.getForm()?.setFieldsValue({ contractInfoDto: { ...modalSelectedValue }, ...modalSelectedValue, orderProductDtos: [] });
            }
            this.getUnitByChargeType();
            this.getColumnsChange(selectedRows[0].chargeType);
        }
    }

    /**
     * @description 计价方式判断产品信息列表显示
     */
    public getColumnsChange(value: number | string): void {
        const columns: TableColumnType<object>[] = this.getColumns();
        if (value === ChargeType.UNIT_PRICE) {
            columns.splice(9, 1);
        }
        this.setState({
            columns: columns
        })
    }

    /**
     * @description 计价方式判断单位
     */
    public getUnitByChargeType = (): void => {
        const saleOrder: ISaleOrder | undefined = this.getForm()?.getFieldsValue(true);
        let orderProductDtos: IProductVo[] = this.getForm()?.getFieldsValue(true).orderProductDtos;
        orderProductDtos = orderProductDtos && orderProductDtos.map(items => {
            if (saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE) {
                return items = {
                    ...items,
                    unit: '基'
                }
            } else {
                return items = {
                    ...items,
                    unit: 'kg'
                }
            }
        })
        this.getForm()?.setFieldsValue({ orderProductDtos: orderProductDtos });
    }

    /**
     * @description 税率自定义option
     */
    public addNewOption = (value: string): void => {
        this.setState({
            newOption: {
                label: parseFloat(parseFloat(value).toFixed(4)),
                value: parseFloat(parseFloat(value).toFixed(4))
            }
        });
    }

    /**
     * @description 根据税率计算不含税金额
     */
    public getAmount = (): void => {
        const saleOrderValue: any = this.getForm()?.getFieldsValue(true);
        const orderWeight: number = saleOrderValue.orderWeight;
        const price: number = saleOrderValue.price;
        let amount: number | undefined = 0;
        amount = orderWeight * price;
        this.getForm()?.setFieldsValue({ amount: doNumber(amount, 4) });
    }

    /**
     * @description 根据税率计算含税金额
     */
    public getTaxAmount = (): void => {
        const saleOrderValue: any = this.getForm()?.getFieldsValue(true);
        const orderWeight: number = saleOrderValue.orderWeight;
        const taxPrice: number = saleOrderValue.taxPrice;
        let taxAmount: number | undefined = 0;
        taxAmount = orderWeight * taxPrice;
        this.getForm()?.setFieldsValue({ taxAmount: doNumber(taxAmount, 4) });
    }

    /**
     * 根据含税单价以及税率计算不含税单价:
     *      不含税单价 = 含税单价 / （1+税率/100），保留4位小数
     */
    public unitPriceExcludingTax = ():void => {
        // const saleOrderValue:any = this.getForm()?.getFieldsValue(true);
        // console.log("sddddddddddd", saleOrderValue)
        // const taxPrice: number = saleOrderValue.taxPrice * 1; // 含税单价
        // const taxRate: number = saleOrderValue.taxRate * 1; // 税率
        // let result: number | undefined = 0;
        // result = taxPrice / (1 + taxRate  / 100);
        // this.getForm()?.setFieldsValue({ price: doNumber(result, 4) });
    }

    /**
     * @description 含税金额改变改变含税单价
     *  公式：含税单价 = 含税金额/订单重量
     */
    public amountBlur = (): void => {
        const saleOrderValue: any = this.getForm()?.getFieldsValue(true);
        const taxAmount: number = saleOrderValue.taxAmount * 1;
        const orderWeight: number = saleOrderValue.orderWeight * 1;
        if (orderWeight > 0) {
            const result = taxAmount / orderWeight;
            const taxRate: number = saleOrderValue.taxRate * 1; // 税率
            let result1: number | undefined = 0;
            result1 = result / (1 + taxRate  / 100);
            this.getForm()?.setFieldsValue({ taxPrice: doNumber(result, 4), price: doNumber(result, 4) });
        }
    }

    /**
     * @description 订单总重-改变含税金额计算改变单行金额
     */
    public getPriceAfterChangeAmount = (): void => {
        const saleOrder: ISaleOrder | undefined = this.getForm()?.getFieldsValue(true);
        let orderProductDtos: IProductVo[] = this.getForm()?.getFieldsValue(true).orderProductDtos;
        orderProductDtos = orderProductDtos && orderProductDtos.map(items => {
            return items = {
                ...items,
                price: saleOrder?.totalPrice || undefined
            }
        })
        this.setState({
            saleOrder: {
                ...(saleOrder || { taxAmount: 0, taxRate: 0, totalWeight: 0, totalAmount: 0, orderProductVos: [] }),
                orderProductDtos: [...(orderProductDtos || [])],
                contractInfoDto: this.state.saleOrder?.contractInfoDto
            }
        })
        this.getForm()?.setFieldsValue({ orderProductDtos: [...(orderProductDtos || [])] });
    }

    /**
     * @description 订单总重-计算含税单价
     */
    public getPrice = (): void => {
        const saleOrder: ISaleOrder = this.getForm()?.getFieldsValue(true);
        const orderProductDtos: IProductVo[] = this.getForm()?.getFieldsValue(true).orderProductDtos || [];
        if (orderProductDtos.length > 0) {
            let totalPrice: number | undefined = 0;
            totalPrice = saleOrder.taxAmount / saleOrder.totalWeight || undefined;
            totalPrice = totalPrice && parseFloat(totalPrice.toFixed(4));
            orderProductDtos.map<void>((items: IProductVo, ind: number): void => {
                orderProductDtos[ind] = {
                    ...orderProductDtos[ind],
                    totalAmount: totalPrice && parseFloat((totalPrice * (orderProductDtos[ind].num || 0) || 0).toFixed(4)),
                    price: totalPrice
                }
            })
            this.getForm()?.setFieldsValue({ totalPrice: totalPrice, taxPrice: totalPrice, orderProductDtos: orderProductDtos });
        }
    }

    public getFormItemGroups(): any {
        const saleOrder: ManagementSaleOrder | undefined = this.state
            .saleOrder as ManagementSaleOrder;
        return [
            [
                {
                    title: "基础信息",
                    itemCol: {
                        span: 6,
                    },
                    itemProps: [
                        {
                            label: "采购订单号",
                            name: "purchaseOrderNumber",
                            initialValue: saleOrder?.purchaseOrderNumber,
                            children: <Input maxLength={50} disabled={true} />,
                        },
                        {
                            label: "内部合同编号",
                            name: "contractNumber",
                            initialValue: saleOrder?.contractInfoDto?.contractNumber,
                            rules: [
                                {
                                    required: true,
                                    message: "请选择内部合同编号",
                                },
                            ],
                            children: (
                                <Input
                                    value={saleOrder?.contractInfoDto?.contractNumber}
                                    disabled={true}
                                    suffix={
                                        <ContractSelectionComponent
                                            onSelect={this.onSelect}
                                            selectKey={[saleOrder?.contractInfoDto?.contractId]}
                                            projectId={(this.props.match.params as any).projectId}
                                            status={1}
                                        />
                                    }
                                />
                            ),
                        },
                        {
                            label: "内部合同编号",
                            name: "internalNumber",
                            initialValue: saleOrder?.contractInfoDto?.internalNumber,
                            children: <Input disabled={true} />,
                        },
                        {
                            label: "订单工程名称",
                            name: "orderProjectName",
                            initialValue: saleOrder?.contractInfoDto?.orderProjectName,
                            rules: [
                                {
                                    required: true,
                                    message: "请输入订单工程名称",
                                },
                            ],
                            children: <Input />,
                        },
                        {
                            label: "业主单位",
                            name: "customerCompany",
                            initialValue: saleOrder?.contractInfoDto?.customerCompany,
                            children: <Input disabled={true} />,
                        },
                        {
                            label: "合同签订单位",
                            name: "signCustomerName",
                            initialValue: saleOrder?.contractInfoDto?.signCustomerName,
                            children: <Input disabled={true} />,
                        },
                        {
                            label: "合同签订日期",
                            name: "signContractTime",
                            initialValue: saleOrder?.contractInfoDto?.signContractTime,
                            children: <Input disabled={true} />,
                        },
                        {
                            label: "合同要求交货日期",
                            name: "deliveryTime",
                            initialValue: saleOrder?.contractInfoDto?.deliveryTime,
                            children: <Input disabled={true} />,
                        },
                        {
                            label: "产品类型",
                            name: "productType",
                            initialValue: saleOrder?.productType,
                            children: <Select>
                                {productTypeOptions &&
                                    productTypeOptions.map(({ id, name }, index) => {
                                        return (
                                            <Select.Option key={index} value={id}>
                                                {name}
                                            </Select.Option>
                                        );
                                    })}
                            </Select>,
                            rules: [
                                {
                                    required: true,
                                    message: "请选择产品类型",
                                },
                            ]
                        },
                        {
                            label: "电压等级",
                            name: "voltageGrade",
                            initialValue: saleOrder?.voltageGrade,
                            children: <Select>
                                {voltageGradeOptions &&
                                    voltageGradeOptions.map(({ id, name }, index) => {
                                        return (
                                            <Select.Option key={index} value={id}>
                                                {name}
                                            </Select.Option>
                                        );
                                    })}
                            </Select>,
                            // rules: [
                            //     {
                            //         required: true,
                            //         message: "请选择电压等级",
                            //     },
                            // ]
                        },
                        {
                            label: "币种",
                            name: "currencyType",
                            initialValue:
                                saleOrder?.contractInfoDto?.currencyType ||
                                (currencyTypeOptions &&
                                    currencyTypeOptions.length > 0 &&
                                    currencyTypeOptions[0].id),
                            children: (
                                <Select disabled={true}>
                                    {currencyTypeOptions &&
                                        currencyTypeOptions.map(({ id, name }, index) => {
                                            return (
                                                <Select.Option key={index} value={id}>
                                                    {name}
                                                </Select.Option>
                                            );
                                        })}
                                </Select>
                            ),
                        },
                        {
                            label: "订单重量",
                            name: "orderWeight",
                            initialValue: saleOrder?.orderWeight || "0.00000000",

                            children: <InputNumber className={layoutStyles.width100} step="0.00000001" max={99999999.9999} onChange={() => { this.getAmount(); this.amountBlur(); this.unitPriceExcludingTax()}} />,
                        },
                        {
                            label: "含税金额",
                            name: "taxAmount",
                            initialValue: saleOrder?.taxAmount || "0.0000",
                            rules: [
                                {
                                    required: true,
                                    message: "请输入含税金额",
                                },
                            ],
                            children: (
                                <InputNumber
                                    min="0"
                                    step="0.0001"
                                    stringMode={false}
                                    precision={4}
                                    onChange={this.amountBlur}
                                    className={layoutStyles.width100}
                                />
                            ),
                        },
                        {
                            label: "不含税金额",
                            name: "amount",
                            initialValue: saleOrder?.amount || "0.0000",
                            children: <Input prefix="￥" disabled={true} readOnly={true} />,
                        },
                        {
                            label: "含税单价",
                            name: "taxPrice",
                            initialValue: saleOrder?.taxPrice || "0.0000",
                            rules: [
                                {
                                    required: true,
                                    message: "请输入含税单价",
                                },
                            ],
                            children: <InputNumber step="0.0001" precision={4} disabled={true} max={999999999999.99} />,
                        },
                        {
                            label: "不含税单价",
                            name: "price",
                            initialValue: saleOrder?.price || "0.0000",
                            rules: [
                                {
                                    required: true,
                                    message: "请输入不含税单价",
                                },
                            ],
                            children: <InputNumber step="0.0001" precision={4} onChange={this.getAmount} max={999999999999.99} disabled={true} />,
                        },
                        {
                            label: "税率",
                            name: "taxRate",
                            initialValue: (saleOrder?.taxRate && saleOrder?.taxRate !== -1) ? saleOrder?.taxRate : 13,
                            rules: [
                                {
                                    required: true,
                                    message: "请输入税率",
                                },
                            ],
                            children: (
                                <InputNumber
                                    min={0}
                                    step="0.01"
                                    stringMode={false}
                                    precision={2}
                                    max={100}
                                    className={layoutStyles.width100}
                                    onChange={() => {
                                        this.unitPriceExcludingTax();
                                        this.getAmount();
                                    }}
                                />
                            ),
                        },
                        {
                            label: "外汇金额",
                            name: "foreignExchangeAmount",
                            initialValue:
                                saleOrder?.foreignExchangeAmount || "0.00",
                            children: (
                                <InputNumber
                                    min={0}
                                    step="0.01"
                                    stringMode={false}
                                    precision={2}
                                    max={999999999999.99}
                                    className={layoutStyles.width100}
                                />
                            ),
                        },
                        {
                            label: "汇率",
                            name: "exchangeRate",
                            initialValue:
                                saleOrder?.exchangeRate || "0.0000",
                            children: (
                                <InputNumber
                                    min={0}
                                    step="0.0001"
                                    max={999999999999.99}
                                    stringMode={false}
                                    precision={4}
                                    className={layoutStyles.width100}
                                />
                            ),
                        },
                        {
                            label: "销售类型",
                            name: "saleType",
                            initialValue: [-1, "-1"].includes(saleOrder?.saleType as any) ? undefined : saleOrder?.saleType,
                            children: (
                                <Select disabled={true}
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                >
                                    {saleTypeOptions &&
                                        saleTypeOptions.map(({ id, name }, index) => {
                                            return (
                                                <Select.Option key={index} value={id}>
                                                    {name}
                                                </Select.Option>
                                            );
                                        })}
                                </Select>
                            ),
                        },
                        {
                            label: "外汇单价",
                            name: "foreignPrice",
                            initialValue:
                                saleOrder?.foreignPrice || "0.00",
                            children: (
                                <InputNumber
                                    min={0}
                                    step="0.01"
                                    stringMode={false}
                                    precision={2}
                                    max={999999999999.99}
                                    className={layoutStyles.width100}
                                />
                            ),
                        },
                        // {
                        //     label: "保函类型",
                        //     name: "guaranteeType",
                        //     initialValue:
                        //         saleOrder?.guaranteeType === "-1"
                        //             ? undefined
                        //             : saleOrder?.guaranteeType,
                        //     children: (
                        //         <Select maxLength={50} className={layoutStyles.width100}>
                        //             <Select.Option value="履约保函">履约保函</Select.Option>
                        //             <Select.Option value="预付款保函">预付款保函</Select.Option>
                        //             <Select.Option value="质保保函以及履约保函">质保保函以及履约保函</Select.Option>
                        //             <Select.Option value="预付款保函和质保保函">预付款保函和质保保函</Select.Option>
                        //         </Select>
                        //     ),
                        // },
                        {
                            label: "销售业务员",
                            name: "salesman",
                            initialValue: saleOrder?.salesman,
                            rules: [
                                {
                                    required: false,
                                    message: "请输入销售业务员",
                                },
                            ],
                            children: <Input maxLength={20} />,
                        },
                        // {
                        //     label: "港口费用",
                        //     name: "portCharge",
                        //     initialValue:
                        //         saleOrder?.portCharge || "0.00",
                        //     children: (
                        //         <InputNumber
                        //             min={0}
                        //             step="0.01"
                        //             stringMode={false}
                        //             precision={2}
                        //             max={999999999999.99}
                        //             className={layoutStyles.width100}
                        //         />
                        //     ),
                        // },
                        {
                            label: "保函金额",
                            name: "guaranteeAmount",
                            initialValue:
                                saleOrder?.guaranteeAmount || "0.00",
                            children: (
                                <InputNumber
                                    min={0}
                                    step="0.01"
                                    stringMode={false}
                                    precision={2}
                                    max={999999999999.99}
                                    className={layoutStyles.width100}
                                />
                            ),
                        },

                        // {
                        //     label: "海运及保险费",
                        //     name: "insuranceCharge",
                        //     initialValue:
                        //         saleOrder?.insuranceCharge || "0.00",
                        //     children: (
                        //         <InputNumber
                        //             min={0}
                        //             step="0.01"
                        //             stringMode={false}
                        //             precision={2}
                        //             max={999999999999.99}
                        //             className={layoutStyles.width100}
                        //         />
                        //     ),
                        // },
                        // {
                        //     label: "出口信用保险",
                        //     name: "creditInsurance",
                        //     initialValue:
                        //         saleOrder?.creditInsurance || "0.00",
                        //     children: (
                        //         <InputNumber
                        //             min={0}
                        //             step="0.01"
                        //             stringMode={false}
                        //             precision={2}
                        //             max={999999999999.99}
                        //             className={layoutStyles.width100}
                        //         />
                        //     ),
                        // },
                        // {
                        //     label: "佣金",
                        //     name: "commissionCharge",
                        //     initialValue:
                        //         saleOrder?.commissionCharge || "0.00",
                        //     children: (
                        //         <InputNumber
                        //             min={0}
                        //             step="0.01"
                        //             stringMode={false}
                        //             precision={2}
                        //             max={999999999999.99}
                        //             className={layoutStyles.width100}
                        //         />
                        //     ),
                        // },
                        {
                            label: "备注",
                            name: "description",
                            initialValue: saleOrder?.description,
                            children: (
                                <Input.TextArea
                                    rows={5}
                                    showCount={true}
                                    maxLength={300}
                                    placeholder="请输入备注信息"
                                />
                            ),
                        },
                    ],
                },
            ],
        ];
    }
    /**
      * @implements
      * @description Gets table columns
      * @param item 
      * @returns table columns 
      */
    public getColumns(): TableColumnType<object>[] {
        return []
    }

    /**
     * @description Gets table props
     * @param item 
     * @returns table props 
     */
    protected getTableProps(): TableProps<object> {
        return {
            rowKey: this.getTableRowKey(),
            bordered: true,
            dataSource: [...(this.state.saleOrder?.orderProductDtos || [])],
            columns: this.state.columns,
            pagination: false,
            scroll: { x: 1200 }
        };
    }

    public selectAddRow = (selectedRows: DataType[] | any) => {
        const saleOrder: ISaleOrder | undefined = this.getForm()?.getFieldsValue(true);
        let orderProductDtos: IProductVo[] | undefined = saleOrder?.orderProductDtos || [];
        let totalWeight: number | undefined = saleOrder?.totalWeight || 0;
        if (selectedRows && selectedRows.length > 0) {
            const product: IProductVo = {
                productId: selectedRows[0].productId,
                productCategoryId: selectedRows[0].productCategoryId,
                status: 0,
                lineName: selectedRows[0].lineName,
                productType: selectedRows[0].productType,
                productCategoryName: selectedRows[0].productCategoryName,
                productNumber: selectedRows[0].productNumber,
                voltageGrade: selectedRows[0].voltageGrade,
                productHeight: selectedRows[0].productHeight,
                num: selectedRows[0].productWeight,
                unit: this.state.saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE ? '基' : 'kg',
                price: this.state.saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE ? undefined : saleOrder?.totalPrice,
                totalAmount: this.state.saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE ? undefined : Number.parseFloat(((saleOrder?.totalPrice || 0) * selectedRows[0].productWeight).toFixed(4)),
                tender: '',
                description: selectedRows[0].description
            };
            orderProductDtos.push(product);
            totalWeight = (Number(totalWeight) + Number(selectedRows[0].productWeight)) || 0;
            this.setState({
                saleOrder: {
                    ...(saleOrder || { taxAmount: 0, taxRate: 0, totalWeight: 0, totalAmount: 0, orderProductVos: [] }),
                    orderProductDtos: orderProductDtos,
                    contractInfoDto: this.state.saleOrder?.contractInfoDto
                }
            })
            this.getForm()?.setFieldsValue({ ...saleOrder, orderProductDtos: [...(orderProductDtos || [])], totalWeight: totalWeight, contractInfoDto: this.state.saleOrder?.contractInfoDto });
        }
        let orderQuantity: number | undefined = this.state.orderQuantity;
        if (this.state.saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE) {
            if (orderQuantity !== undefined) {
                orderQuantity = Number(orderQuantity) + 1;
                this.setState({
                    orderQuantity: orderQuantity
                })
            }
        } else {
            this.getPrice();
            this.getPriceAfterChangeAmount();
            const saleOrderValue: ISaleOrder = this.getForm()?.getFieldsValue(true);
            if (orderQuantity !== undefined) {
                this.setState({
                    orderQuantity: saleOrderValue.totalWeight
                })
            }
        }
        this.getUnitByChargeType();
    }

    /**
     * @description Renders extra sections
     * @returns extra sections 
     */
    public renderExtraSections(): IRenderedSection[] {
        return []
    }

    /**
     * @protected
     * @description Gets table row key
     * @returns table row key 
     */
    protected getTableRowKey(): string | GetRowKey<object> {
        return 'num';
    }
}