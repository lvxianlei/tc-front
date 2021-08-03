/**
 * @author zyc
 * @copyright © 2021
 */
import { Button, Col, DatePicker, Form, FormProps, Input, InputNumber, Popconfirm, Row, Select, Table, TableColumnType, TableProps } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { DeleteOutlined } from '@ant-design/icons';

import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../../components/AbstractFillableComponent';
import { IRenderedSection } from '../../../utils/SummaryRenderUtil';
import moment from 'moment';
import styles from './AbstractSaleOrderSetting.module.less'
import ContractSelectionComponent from '../../../components/ContractSelectionModal';
import { DataType } from '../../../components/AbstractSelectableModal';
import { currencyTypeOptions, productTypeOptions, taxRateOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
import { IProduct } from '../../IProduct';
import { IContract } from '../../IContract';
import layoutStyles from '../../../layout/Layout.module.less';
import TowerSelectionModal from './TowerSelectionModal';
import { GetRowKey } from 'rc-table/lib/interface';

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
}

export interface IProductVo extends IProduct {
    readonly num?: number;
    readonly productCategoryId?: string | number;
    readonly productId?: string | number;
}

export interface IContractInfoDto extends IContract {
    readonly orderDeliveryTime?: object;
    readonly contractId?: string;
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
        const orderQuantity: number | undefined  = this.state.orderQuantity;
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
        if(selectedRows && selectedRows.length > 0 ) {
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
                contractNumber: selectedRows[0].contractNumber
            };
            this.setState({
                saleOrder: {
                    ...(saleOrder || { taxAmount: 0, taxRate: 0, totalWeight: 0, totalAmount: 0,orderProductVos: [] }),
                    contractInfoDto: { ...modalSelectedValue },
                    orderProductDtos: []
                },
                orderQuantity: 0
            })
            if(selectedRows[0].chargeType === ChargeType.UNIT_PRICE) {
                this.getForm()?.setFieldsValue({ contractInfoDto: { ...modalSelectedValue }, ...modalSelectedValue, price: '-', orderProductDtos: [], totalWeight: undefined, totalPrice: '', totalAmount: '', taxAmount: undefined, taxPrice: '', amount: '', orderQuantity: ''});
            } else {
                this.getForm()?.setFieldsValue({ contractInfoDto: { ...modalSelectedValue }, ...modalSelectedValue, price: 0, orderProductDtos: [], totalWeight: undefined, totalPrice: '', totalAmount: '', taxAmount: undefined, taxPrice: '', amount: '', orderQuantity: ''});
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
        if(value === ChargeType.UNIT_PRICE) {
            columns.splice(9, 1);
        }
        this.setState({
            columns: columns
        })
    }

    /**
     * @description 计价方式判断单位
     */
    public getUnitByChargeType = () : void => {
        const saleOrder: ISaleOrder | undefined = this.getForm()?.getFieldsValue(true);
        let orderProductDtos: IProductVo[] = this.getForm()?.getFieldsValue(true).orderProductDtos;
        orderProductDtos = orderProductDtos && orderProductDtos.map(items => {
            if(saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE) {
                return items ={
                    ...items,
                    unit:  '基'
                }
            } else {
                return items ={
                    ...items,
                    unit:  'kg'
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
        const saleOrderValue: ISaleOrder = this.getForm()?.getFieldsValue(true);
        const taxAmount: number = saleOrderValue.taxAmount;
        const taxRate: number = saleOrderValue.taxRate;
        let amount: number | undefined = 0;
        amount = taxAmount / (1 + Number(taxRate)) || undefined;
        amount = amount && parseFloat(amount.toFixed(4));
        this.getForm()?.setFieldsValue({ amount: amount });
        this.getPriceAccordTaxRate();
    }

    /**
     * @description 根据税率计算不含税单价
     */
     public getPriceAccordTaxRate = (): void => {
        const saleOrder: ISaleOrder = this.getForm()?.getFieldsValue(true);
        const amount: number | undefined = this.getForm()?.getFieldsValue(true).amount;
        const totalWeight: number = saleOrder.totalWeight;
        if(this.state.saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE) {
            this.getForm()?.setFieldsValue({ price: '-' });
        } else {
            let price: number | undefined = 0;
            if(amount && totalWeight > 0) {
                price = amount / totalWeight || undefined;
            } else {
                price = undefined;
            }
            price = price && parseFloat(price.toFixed(4));
            this.getForm()?.setFieldsValue({ price: price });
        }
    }

    /**
     * @description 订单总重改变时总计金额同步&根据税率计算不含税金额
     */
    public amountBlur = (): void => {
        const saleOrderValue: ISaleOrder = this.getForm()?.getFieldsValue(true);
        const taxAmount: number = saleOrderValue.taxAmount;
        this.getPrice();
        this.getForm()?.setFieldsValue({ totalAmount: taxAmount });
        this.getAmount();
        this.getPriceAfterChangeAmount();
    }

    /**
     * @description 订单总重-改变含税金额计算改变单行金额
     */
    public getPriceAfterChangeAmount = () : void => {
        const saleOrder: ISaleOrder | undefined = this.getForm()?.getFieldsValue(true);
        let orderProductDtos: IProductVo[] = this.getForm()?.getFieldsValue(true).orderProductDtos;
        orderProductDtos = orderProductDtos && orderProductDtos.map(items => {
            return items ={
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
        if(orderProductDtos.length > 0) {
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

    /**
     * @description 产品单价-输入产品单价计算总计单价&单行金额
     */
    public priceBlur(index: number): void {
        const saleOrder: ISaleOrder | undefined = this.state.saleOrder;
        const orderProductDtos: IProductVo[] = this.getForm()?.getFieldsValue(true).orderProductDtos;
        const orderQuantity: number | undefined = this.getForm()?.getFieldsValue(true).orderQuantity;
        if(orderQuantity && orderProductDtos[0] && orderProductDtos[index].price) {
            const price: number | undefined = orderProductDtos[index].price;
            let totalPrice: number = 0;
            let amount: number = 0;
            if(price) {
                amount = price * 1; 
            }
            orderProductDtos.map<void>((items: IProductVo): void => {
                totalPrice = Number(totalPrice) + Number(items.price);
            })
            orderProductDtos[index] = {
                ...orderProductDtos[index],
                totalAmount: amount
            }
            this.setState({
                saleOrder: {
                    ...(saleOrder || { taxAmount: 0, taxRate: 0, totalWeight: 0, totalAmount: 0,orderProductVos: [] }),
                    orderProductDtos: [...orderProductDtos],
                }
            })
            this.getForm()?.setFieldsValue({ taxPrice: parseFloat((totalPrice/orderQuantity || 0).toFixed(4)), totalPrice: parseFloat((totalPrice/orderQuantity || 0).toFixed(4)), orderProductDtos: [...orderProductDtos] });
            this.getTotalAmount();
            this.getAmount();
        }                                                       
    }

    /**
     * @description 产品单价-计算总计金额
     */
     public getTotalAmount(): void {
        const orderProductDtos: IProductVo[] = this.getForm()?.getFieldsValue(true).orderProductDtos;
        let totalAmount: number = 0;
        orderProductDtos.map<number>((items: IProductVo): number => {
            return totalAmount = Number(totalAmount) + Number(items.totalAmount || 0);
        })
        this.getForm()?.setFieldsValue({ taxAmount: totalAmount, totalAmount: totalAmount });
    }

    /**
     * @description 产品信息删除
     */
     public tableDelete(index: number): void {
        const saleOrderValue: ISaleOrder = this.getForm()?.getFieldsValue(true);
        const orderProductDtos: IProductVo[] | undefined = this.getForm()?.getFieldsValue(true).orderProductDtos;
        const saleOrder: ISaleOrder | undefined = this.state.saleOrder;
        const orderQuantity: number | undefined = this.state.orderQuantity;
        if(orderProductDtos && saleOrder?.contractInfoDto?.chargeType === ChargeType.ORDER_TOTAL_WEIGHT) {
            console.log(orderProductDtos)
            const num: number = orderProductDtos[index].num || 0;
            let totalWeight: number = saleOrderValue.totalWeight;
            totalWeight = parseFloat((totalWeight - num).toFixed(4));
            
            orderProductDtos?.splice(index, 1);
            if(orderQuantity) {
                this.setState({
                    orderQuantity: totalWeight,
                    saleOrder: {
                        ...saleOrderValue,
                        orderProductDtos: [...orderProductDtos],
                        contractInfoDto: saleOrder.contractInfoDto 
                    }
                })
            }
            this.getForm()?.setFieldsValue({ totalWeight: totalWeight, orderProductDtos: [...orderProductDtos] });
            if(orderProductDtos.length > 0) {
                this.getPrice();
                this.getPriceAccordTaxRate();
            } else {
                this.getForm()?.setFieldsValue({ taxPrice: 0, totalPrice: 0, orderProductDtos: [...orderProductDtos] });
            }
        } else if( orderProductDtos && saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE ) {
            orderProductDtos?.splice(index, 1);
            if(orderQuantity) {
                this.setState({
                    orderQuantity: orderQuantity - 1,
                    saleOrder: { 
                        ...saleOrderValue,
                        contractInfoDto: saleOrder.contractInfoDto
                    }
                })
            }
            this.getForm()?.setFieldsValue({ orderQuantity: orderQuantity && (orderQuantity -1), orderProductDtos: [...orderProductDtos] });
            if(orderProductDtos.length > 0) {
                orderProductDtos.map<void>((items: IProductVo, index: number): void => {
                    this.priceBlur(index)
                })
            } else {
                this.getForm()?.setFieldsValue({ taxPrice: 0, totalPrice: 0, taxAmount: 0, totalAmount: 0, orderProductDtos: [...orderProductDtos] });
            }
            
        }   
        this.getAmount();
    }

    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        const saleOrder: ISaleOrder | undefined = this.state.saleOrder;
        const orderQuantity: number | undefined = this.state.orderQuantity;
        const setting: boolean | undefined = this.state?.isSetting;
        return [[{
            title: '基础信息',
            itemCol: {
                span: 8
            },
            itemProps: [{
                label: '订单编号',
                name: 'saleOrderNumber',
                initialValue: saleOrder?.saleOrderNumber,
                children: <Input disabled placeholder="订单编号自动生成"/>
            }, {
                label: '采购订单号',
                name: 'purchaseOrderNumber',
                initialValue: saleOrder?.purchaseOrderNumber,
                children: <Input maxLength={ 50 }/>
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
                        {
                            setting ? <Input value={ saleOrder?.contractInfoDto?.contractNumber }
                            disabled/> : <Input value={ saleOrder?.contractInfoDto?.contractNumber } suffix={ 
                                <ContractSelectionComponent onSelect={ this.onSelect } selectKey={ [saleOrder?.contractInfoDto?.contractId] } status={ 1 }/>
                            }/>
                        }
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
                name: 'signContractTime',
                initialValue: saleOrder?.contractInfoDto?.signContractTime,
                children:  <Input disabled/>
            },  {
                label: '要求交货日期',
                name: 'deliveryTime',
                initialValue: saleOrder?.contractInfoDto?.deliveryTime,
                children:  <Input disabled/>
            }, {
                label: '计价方式',
                name: 'chargeType',
                initialValue: saleOrder?.contractInfoDto?.chargeType,
                children: (
                    <Select disabled>
                        <Select.Option value={ ChargeType.ORDER_TOTAL_WEIGHT }>订单总价、总重计算单价</Select.Option>
                        <Select.Option value={ ChargeType.UNIT_PRICE }>产品单价、基数计算总价</Select.Option>
                    </Select>
                )
                        
            }, {
                label: '币种',
                name: 'currencyType',
                initialValue: saleOrder?.contractInfoDto?.currencyType || currencyTypeOptions && currencyTypeOptions.length > 0 && currencyTypeOptions[0].id,
                children: (
                    <Select disabled>
                        { currencyTypeOptions && currencyTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={ index } value={ id }>
                                { name }
                            </Select.Option>
                        }) }
                    </Select>
                )
            }, {
                label: '订单数量',
                name: 'orderQuantity',
                initialValue: saleOrder?.orderQuantity || orderQuantity,
                children: <Input disabled suffix={ saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE ? "基" : "kg" }/>
            }, {
                label: '含税金额',
                name: 'taxAmount',
                initialValue: saleOrder?.taxAmount,
                rules: [{
                    required: true,
                    message: '请输入含税金额'
                }],
                children: <InputNumber
                    min="0"
                    step="0.0001"
                    stringMode={ false } 
                    precision={ 4 }  
                    disabled={ saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE } 
                    onChange={ this.amountBlur }
                    className={ layoutStyles.width100 }/>
            }, {
                label: '含税单价',
                name: 'taxPrice',
                initialValue: saleOrder?.taxPrice,
                children: <Input prefix="￥" disabled/>
            }, {
                label: '税率',
                name: 'taxRate',
                initialValue: saleOrder?.taxRate == -1 ? undefined : saleOrder?.taxRate,
                children: 
                    <Select showSearch onSearch={ this.addNewOption } onChange={ this.getAmount } getPopupContainer={ triggerNode => triggerNode.parentNode }>
                        {
                            this.state.newOption ? 
                            <Select.Option key={ this.state.newOption.value } value={ this.state.newOption.label }>{ this.state.newOption.value }</Select.Option> 
                            : ""
                        }
                        { taxRateOptions && taxRateOptions.map(({ id, name }, index) => {
                            return <Select.Option key={ index } value={ name }>
                                { name }
                            </Select.Option>
                        }) }
                    </Select>
            }, {
                label: '不含税金额',
                name: 'amount',
                initialValue: saleOrder?.amount == 0 ? undefined : saleOrder?.amount,
                children: <Input  prefix="￥" disabled/>
            }, {
                label: '不含税单价',
                name: 'price',
                initialValue: saleOrder?.price == 0 ? undefined : saleOrder?.price,
                children: <Input  prefix="￥" disabled/>
            }, {
                label: '汇率',
                name: 'exchangeRate',
                initialValue: saleOrder?.exchangeRate == -1 ? undefined : saleOrder?.exchangeRate,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 } className={ layoutStyles.width100 }/>
            }, {
                label: '外汇金额',
                name: 'foreignExchangeAmount',
                initialValue: saleOrder?.foreignExchangeAmount == -1 ? undefined : saleOrder?.foreignExchangeAmount,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 2 } className={ layoutStyles.width100 }/>
            }, {
                label: '外汇单价',
                name: 'foreignPrice',
                initialValue: saleOrder?.foreignPrice == -1 ? undefined : saleOrder?.foreignPrice,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 } className={ layoutStyles.width100 }/>
            }, {
                label: '保函类型',
                name: 'guaranteeType',
                initialValue: saleOrder?.guaranteeType == '-1' ? undefined : saleOrder?.guaranteeType,
                children:  <Input maxLength={ 50 } className={ layoutStyles.width100 }/>
            }, {
                label: '保函金额',
                name: 'guaranteeAmount',
                initialValue: saleOrder?.guaranteeAmount == -1 ? undefined : saleOrder?.guaranteeAmount,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 2 } className={ layoutStyles.width100 }/>
            }, {
                label: '港口费用',
                name: 'portCharge',
                initialValue: saleOrder?.portCharge == -1 ? undefined : saleOrder?.portCharge,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 } className={ layoutStyles.width100 }/>
            }, {
                label: '海运及保险费',
                name: 'insuranceCharge',
                initialValue: saleOrder?.insuranceCharge == -1 ? undefined : saleOrder?.insuranceCharge,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 } className={ layoutStyles.width100 }/>
            }, {
                label: '佣金',
                name: 'commissionCharge',
                initialValue: saleOrder?.commissionCharge == -1 ? undefined :saleOrder?.commissionCharge,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 } className={ layoutStyles.width100 }/>
            }, {
                label: '出口信用保险',
                name: 'creditInsurance',
                initialValue: saleOrder?.creditInsurance == -1 ? undefined : saleOrder?.creditInsurance,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 } className={ layoutStyles.width100 }/>
            }, {
                label: '订单交货日期',
                name: 'orderDeliveryTime',
                initialValue: saleOrder?.orderDeliveryTime ? moment(saleOrder?.orderDeliveryTime) : '',
                rules: [{
                    required: true,
                    message: '请选择订单交货日期'
                }],
                children:  <DatePicker format="YYYY-MM-DD" />
            }, {
                label: '备注',
                name: 'description',
                initialValue: saleOrder?.description,
                children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息"/>
            }]
        }]];
    }

    /**
      * @implements
      * @description Gets table columns
      * @param item 
      * @returns table columns 
      */
     public getColumns(): TableColumnType<object>[] {
        return [{
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 80,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <>
                    { index + 1 }
                </>
            )
        }, {
            key: 'status',
            title: '状态',
            dataIndex: 'status',
            width: 100,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['orderProductDtos', index,'status']}>
                    { record.status === 3 ? '已下发' : record.status === 2 ? '审批中' : record.status === 1 ? '待下发' : '新建' }
                </Form.Item>
            )
        }, {
            key: 'lineName',
            title: '线路名称',
            dataIndex: 'lineName',
            width: 200,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['orderProductDtos', index,'lineName']}>
                    <Input maxLength={ 100 } disabled/>
                </Form.Item> 
            )
        }, {
            key: 'productType',
            title: '产品类型',
            dataIndex: 'productType',
            width: 200,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['orderProductDtos', index,'productType']}>
                    <Select disabled getPopupContainer={ triggerNode => triggerNode.parentNode }>
                        { productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={ index } value={ id }>
                                { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item> 
            )
        }, {
            key: 'productCategoryName',
            title: '塔型',
            dataIndex: 'productCategoryName',
            width: 200,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['orderProductDtos', index,'productCategoryName']}>
                    <Input disabled maxLength={ 50 }/>
                </Form.Item> 
            )
        }, {
            key: 'productNumber',
            title: '杆塔号',
            dataIndex: 'productNumber',
            width: 150,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['orderProductDtos', index,'productNumber']}>
                    <Input maxLength={ 50 } disabled/>
                </Form.Item> 
            )
        }, {
            key: 'voltageGrade',
            title: '电压等级',
            dataIndex: 'voltageGrade',
            width: 200,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['orderProductDtos', index,'voltageGrade']}>
                    <Select style={{ width: '90%' }} disabled getPopupContainer={ triggerNode => triggerNode.parentNode }>
                        { voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={ index } value={ id }>
                                { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item> 
            )
        }, {
            key: 'productHeight',
            title: '呼高（m）',
            dataIndex: 'productHeight',
            width: 150,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['orderProductDtos', index,'productHeight']}>
                    <InputNumber
                        min="0"
                        step="0.01"
                        stringMode={ false } 
                        precision={ 2 }
                        disabled
                    />
                </Form.Item> 
            )
        }, {
            key: 'unit',
            title: '单位',
            dataIndex: 'unit',
            width: 100,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['orderProductDtos', index, 'unit']} rules= {[{
                    required: true,
                    message: '请输入单位'
                }]} >
                <Input disabled/>
            </Form.Item>
            )
        }, {
            key: 'num',
            title: '数量',
            dataIndex: 'num',
            width: 150,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['orderProductDtos', index,'num']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.0001"
                        precision={ 4 }
                        disabled
                        className={ layoutStyles.width100 }/>
                </Form.Item> 
            )
        },  {
            key: 'price',
            title: '单价',
            dataIndex: 'price',
            width: 150,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['orderProductDtos', index,'price']} rules= {[{
                    required: true,
                    message: '请输入产品单价'
                }]}>
                    <InputNumber
                        min="0.0001"
                        step="0.0001"
                        stringMode={ false } 
                        precision={ 4 }
                        disabled={ this.state?.saleOrder?.contractInfoDto?.chargeType !== ChargeType.UNIT_PRICE  } 
                        onChange={ () => this.priceBlur(index) }
                    />
                </Form.Item>
            )
        }, {
            key: 'totalAmount',
            title: '金额',
            dataIndex: 'totalAmount',
            width: 150,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['orderProductDtos', index,'totalAmount']}>
                    <Input disabled/>
                </Form.Item>
            )
        }, {
            key: 'tender',
            title: '标段',
            dataIndex: 'tender',
            width: 150,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['orderProductDtos', index, 'tender']}>
                    <Input disabled={ record.status === 2 || record.status === 3 } maxLength={ 100 }/>
                </Form.Item>
            )
        }, {
            key: 'description',
            title: '备注',
            dataIndex: 'description',
            width: 150,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['orderProductDtos', index, 'description']}>
                    <Input maxLength={ 50 } disabled/>
                </Form.Item> 
            )
        }, {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 180,
            fixed: 'right',
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Popconfirm 
                    title="要删除该条产品信息吗？"
                    placement="topRight"
                    okText="确认"
                    cancelText="取消"
                    onConfirm={ () => { 
                        this.tableDelete(index);
                    } }
                    disabled={ record.status === 2 || record.status === 3 }
                >
                    <Button type="text" disabled={ record.status === 2 || record.status === 3 } icon={ <DeleteOutlined/> } danger/>
                </Popconfirm>
            )
        }];
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
            dataSource: [...(this.state.saleOrder?.orderProductDtos || []) ] ,
            columns: this.state.columns,
            pagination: false,
            scroll: { x: 1200 }
        };
    }

    public selectAddRow = (selectedRows: DataType[] | any) => {
        const saleOrder: ISaleOrder | undefined = this.getForm()?.getFieldsValue(true);
        let orderProductDtos: IProductVo[] | undefined = saleOrder?.orderProductDtos || [];
        let totalWeight: number | undefined = saleOrder?.totalWeight || 0;
        if(selectedRows && selectedRows.length > 0 ) {
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
                totalAmount: this.state.saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE ? undefined : Number.parseFloat(((saleOrder?.totalPrice || 0 ) * selectedRows[0].productWeight).toFixed(4)),
                tender: '',
                description: selectedRows[0].description
            };
            orderProductDtos.push(product);
            totalWeight = (Number(totalWeight) + Number(selectedRows[0].productWeight)) || 0;   
            this.setState({
                saleOrder: {
                    ...(saleOrder || { taxAmount: 0, taxRate: 0, totalWeight: 0, totalAmount: 0,orderProductVos: [] }),
                    orderProductDtos: orderProductDtos,
                    contractInfoDto: this.state.saleOrder?.contractInfoDto
                }
            })
            this.getForm()?.setFieldsValue({ ...saleOrder, orderProductDtos: [...(orderProductDtos || [])], totalWeight: totalWeight, contractInfoDto: this.state.saleOrder?.contractInfoDto });
            this.getPriceAccordTaxRate();
        }   
        let orderQuantity: number | undefined = this.state.orderQuantity;
        if(this.state.saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE) {
            if(orderQuantity !== undefined) {
                orderQuantity = Number(orderQuantity) + 1;
                this.setState({
                    orderQuantity: orderQuantity
                })
            }
        } else {
            this.getPrice();
            this.getPriceAfterChangeAmount();
            const saleOrderValue: ISaleOrder = this.getForm()?.getFieldsValue(true);
            if(orderQuantity !== undefined) {
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
        return [{
            title: '产品信息',
            render: (): React.ReactNode => {
                const chargeType: string | number | undefined = this.state.saleOrder?.contractInfoDto?.chargeType;
                return (
                    <>
                        <TowerSelectionModal onSelect={ this.selectAddRow } id={ this.state.saleOrder?.contractInfoDto?.contractId } selectKey={ this.state.saleOrder?.orderProductDtos }/>
                        <Table { ...this.getTableProps() } summary={pageData => {
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell colSpan={ 9 } index={ 1 }>总结</Table.Summary.Cell>
                                        <Table.Summary.Cell index={ 2 } className={ chargeType===ChargeType.UNIT_PRICE ? styles.ishidden : undefined }>
                                            <Form.Item name="totalWeight">
                                                <Input disabled/>
                                            </Form.Item>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={ 3 }>  
                                            <Form.Item name="totalPrice">
                                                <Input disabled/>
                                            </Form.Item>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={ 4 }>  
                                            <Form.Item name="totalAmount">
                                                <Input disabled/>
                                            </Form.Item>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            );
                        }}></Table>
                    </>
                );
            }
        }];
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