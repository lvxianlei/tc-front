/**
 * @author zyc
 * @copyright © 2021
 */
import { Button, Col, DatePicker, Form, FormProps, Input, InputNumber, Row, Select, Table, TableColumnType, TableProps } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { DeleteOutlined } from '@ant-design/icons';

import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../../components/AbstractFillableComponent';
import { IRenderedSection } from '../../../utils/SummaryRenderUtil';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';
import ConfirmableButton from '../../../components/ConfirmableButton';
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
    readonly isChangeProduct: boolean;
    
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
    productDtos?: IProductVo[];
    readonly purchaseOrderNumber?: string;
    readonly guaranteeType?: string;
    readonly totalWeight: number;
    readonly totalAmount: number;
    readonly totalPrice?: number;
    readonly productVos: IProductVo[];
    readonly productChangeRecordVos?: IProductVo[];
    readonly contractInfoVo?: IContractInfoDto;
}

export interface IProductVo extends IProduct {
    readonly num?: number;
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
            isChangeProduct: false,
            orderQuantity: 0
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
                signCustomerId: selectedRows[0].signCustomerId
            };
            this.setState({
                saleOrder: {
                    ...(saleOrder || { taxAmount: 0, taxRate: 0, totalWeight: 0, totalAmount: 0,productVos: [] }),
                    contractInfoDto: { ...modalSelectedValue },
                    productDtos: []
                },
                orderQuantity: 0
            })
            this.getForm()?.setFieldsValue({ contractInfoDto: { ...modalSelectedValue }, ...modalSelectedValue, price: 0, productDtos: [], totalWeight: '', totalPrice: '', totalAmount: '', taxAmount: undefined, taxPrice: '', amount: '', orderQuantity: ''});
            this.getUnitByChargeType();
        }   
    }

    /**
     * @description 计价方式判断单位
     */
    public getUnitByChargeType = () : void => {
        const saleOrder: ISaleOrder | undefined = this.getForm()?.getFieldsValue(true);
        let productDtos: IProductVo[] = this.getForm()?.getFieldsValue(true).productDtos;
        productDtos = productDtos && productDtos.map(items => {
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
        this.getForm()?.setFieldsValue({ productDtos: productDtos });
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
        let amount: number = 0;
        amount = taxAmount / (1 + Number(taxRate)) || 0;
        amount = parseFloat(amount.toFixed(2));
        this.getForm()?.setFieldsValue({ amount: amount });
        this.getPriceAccordTaxRate();
    }

    /**
     * @description 根据税率计算不含税单价
     */
     public getPriceAccordTaxRate = (): void => {
        const saleOrder: ISaleOrder = this.getForm()?.getFieldsValue(true);
        const amount: number = this.getForm()?.getFieldsValue(true).amount;
        const totalWeight: number = saleOrder.totalWeight;
        let price: number = 0;
        price = amount / totalWeight || 0;
        price = parseFloat(price.toFixed(4));
        this.getForm()?.setFieldsValue({ price: price });
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
        let productDtos: IProductVo[] = this.getForm()?.getFieldsValue(true).productDtos;
        productDtos = productDtos && productDtos.map(items => {
            return items ={
                ...items,
                price: saleOrder?.totalPrice || 0
            }
        })
        this.setState({
            saleOrder: {
                ...(saleOrder || { taxAmount: 0, taxRate: 0, totalWeight: 0, totalAmount: 0, productVos: [] }),
                productDtos: [...(productDtos || [])]
            }
        })
        this.getForm()?.setFieldsValue({ productDtos: [...(productDtos || [])] });
    } 
    
    /**
     * @description 订单总重-计算含税单价
     */
    public getPrice = (): void => {
        const saleOrder: ISaleOrder = this.getForm()?.getFieldsValue(true);
        const productDtos: IProductVo[] = this.getForm()?.getFieldsValue(true).productDtos || [];
        if(productDtos.length > 0) {
            let totalPrice: number = 0;
            totalPrice = saleOrder.taxAmount / saleOrder.totalWeight || 0;
            totalPrice = parseFloat(totalPrice.toFixed(4));
            productDtos.map<void>((items: IProductVo, ind: number): void => {
                productDtos[ind] = {
                    ...productDtos[ind],
                    totalAmount: totalPrice * (productDtos[ind].num || 0) || 0,
                    price: totalPrice
                }
            })
            this.getForm()?.setFieldsValue({ totalPrice: totalPrice, taxPrice: totalPrice, productDtos: productDtos });
        }
    }

    /**
     * @description 产品单价-输入产品单价计算总计单价&单行金额
     */
    public priceBlur(index: number): void {
        const saleOrder: ISaleOrder | undefined = this.state.saleOrder;
        const productDtos: IProductVo[] = this.getForm()?.getFieldsValue(true).productDtos;
        const orderQuantity: number | undefined = this.state.orderQuantity;
        if(orderQuantity && productDtos[0] && productDtos[index].price) {
            const price: number | undefined = productDtos[index].price;
            let totalPrice: number = 0;
            let amount: number = 0;
            if(price) {
                amount = price * 1; 
            }
            productDtos.map<void>((items: IProductVo): void => {
                totalPrice = Number(totalPrice) + Number(items.price);
            })
            productDtos[index] = {
                ...productDtos[index],
                totalAmount: amount
            }
            this.setState({
                saleOrder: {
                    ...(saleOrder || { taxAmount: 0, taxRate: 0, totalWeight: 0, totalAmount: 0,productVos: [] }),
                    productDtos: [...productDtos]
                }
            })
            this.getForm()?.setFieldsValue({ taxPrice: parseFloat((totalPrice/orderQuantity).toFixed(4)), totalPrice: parseFloat((totalPrice/orderQuantity || 0).toFixed(4)), productDtos: [...productDtos] });
            this.getTotalAmount();
            this.getAmount();
        }                                                       
    }

    /**
     * @description 产品单价-计算总计金额
     */
     public getTotalAmount(): void {
        const productDtos: IProductVo[] = this.getForm()?.getFieldsValue(true).productDtos;
        let totalAmount: number = 0;
        productDtos.map<number>((items: IProductVo): number => {
            return totalAmount = Number(totalAmount) + Number(items.totalAmount);
        })
        this.getForm()?.setFieldsValue({ taxAmount: totalAmount, totalAmount: totalAmount });
    }

    /**
     * @description 产品信息删除
     */
     public tableDelete(index: number): void {
        const saleOrderValue: ISaleOrder = this.getForm()?.getFieldsValue(true);
        const productDtos: IProductVo[] | undefined = this.getForm()?.getFieldsValue(true).productDtos;
        const saleOrder: ISaleOrder | undefined = this.state.saleOrder;
        const orderQuantity: number | undefined = this.state.orderQuantity;
        if( productDtos && saleOrder?.contractInfoDto?.chargeType === ChargeType.ORDER_TOTAL_WEIGHT ) {
            const num: number = productDtos[index].num || 0;
            let totalWeight: number = saleOrderValue.totalWeight;
            totalWeight = totalWeight - num;
            productDtos?.splice(index, 1);
            if(orderQuantity) {
                this.setState({
                    orderQuantity: totalWeight,
                    saleOrder: {
                        ...saleOrderValue,
                        productDtos: [ ...productDtos ]
                    }
                })
            }
            this.getForm()?.setFieldsValue({ totalWeight: totalWeight, productDtos: [...productDtos] });
            this.getPrice();
            this.getPriceAccordTaxRate();
        } else if( productDtos && saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE ) {
            const price: number | undefined = productDtos[index].price || 0;
            const amount: number | undefined = productDtos[index].totalAmount;
            let totalPrice: number = this.getForm()?.getFieldsValue(true).totalPrice;
            let totalAmount: number = this.getForm()?.getFieldsValue(true).totalAmount;
            productDtos?.splice(index, 1);
            if(price && amount) {
                totalPrice = totalPrice - price;
                totalAmount = totalAmount - amount;
            }
            if(orderQuantity) {
                this.setState({
                    orderQuantity: orderQuantity - 1,
                    saleOrder: saleOrderValue
                })
            }
            this.getForm()?.setFieldsValue({  taxPrice: totalPrice, totalPrice: totalPrice,  taxAmount: totalAmount, totalAmount: totalAmount, productDtos: [...productDtos]  });
        }   
    }

    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        const saleOrder: ISaleOrder | undefined = this.state.saleOrder;
        const orderQuantity: number | undefined = this.state.orderQuantity;
        const readonly: boolean = this.state.isChangeProduct;
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
                children: <Input maxLength={ 50 } disabled={ readonly }/>
            }, {
                label: '关联合同',
                name: 'contractId',
                initialValue: saleOrder?.contractInfoDto?.contractId,
                rules: [{
                    required: true,
                    message: '请选择关联合同'
                }],
                children:
                    <>
                        {
                            readonly ? <Input value={ saleOrder?.contractInfoDto?.contractId }
                            disabled={ readonly }/> : <Input value={ saleOrder?.contractInfoDto?.contractId } suffix={ 
                                <ContractSelectionComponent onSelect={ this.onSelect } selectKey={ [saleOrder?.contractInfoDto?.contractId] }/>
                            } disabled={ readonly }/>
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
                    step="0.01"
                    stringMode={ false } 
                    precision={ 2 }  
                    disabled={ saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE || readonly } 
                    onChange={ this.amountBlur }
                    className={ layoutStyles.width100 }/>
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
                    <Select showSearch onSearch={ this.addNewOption } onChange={ this.getAmount }  disabled={ readonly } getPopupContainer={ triggerNode => triggerNode.parentNode }>
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
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 } disabled={ readonly } className={ layoutStyles.width100 }/>
            }, {
                label: '外汇金额',
                name: 'foreignExchangeAmount',
                initialValue: saleOrder?.foreignExchangeAmount,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 2 } disabled={ readonly } className={ layoutStyles.width100 }/>
            }, {
                label: '外汇单价',
                name: 'foreignPrice',
                initialValue: saleOrder?.foreignPrice,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 } disabled={ readonly } className={ layoutStyles.width100 }/>
            }, {
                label: '保函类型',
                name: 'guaranteeType',
                initialValue: saleOrder?.guaranteeType,
                children:  <Input disabled={ readonly } maxLength={ 50 } className={ layoutStyles.width100 }/>
            }, {
                label: '保函金额',
                name: 'guaranteeAmount',
                initialValue: saleOrder?.guaranteeAmount,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 2 } disabled={ readonly } className={ layoutStyles.width100 }/>
            }, {
                label: '港口费用',
                name: 'portCharge',
                initialValue: saleOrder?.portCharge,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 } disabled={ readonly } className={ layoutStyles.width100 }/>
            }, {
                label: '海运及保险费',
                name: 'insuranceCharge',
                initialValue: saleOrder?.insuranceCharge,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 } disabled={ readonly } className={ layoutStyles.width100 }/>
            }, {
                label: '佣金',
                name: 'commissionCharge',
                initialValue: saleOrder?.commissionCharge,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 } disabled={ readonly } className={ layoutStyles.width100 }/>
            }, {
                label: '出口信用保险',
                name: 'creditInsurance',
                initialValue: saleOrder?.creditInsurance,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 } disabled={ readonly } className={ layoutStyles.width100 }/>
            }, {
                label: '订单交货日期',
                name: 'orderDeliveryTime',
                initialValue: saleOrder?.orderDeliveryTime ? moment(saleOrder?.orderDeliveryTime) : '',
                rules: [{
                    required: true,
                    message: '请选择订单交货日期'
                }],
                children:  <DatePicker format="YYYY-MM-DD"  disabled={ readonly }/>
            }, {
                label: '备注',
                name: 'description',
                initialValue: saleOrder?.description,
                children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息" disabled={ readonly }/>
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
        const readonly: boolean = this.state.isChangeProduct;
        const saleOrder: ISaleOrder | undefined = this.state.saleOrder;
        return [{
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 100,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <>
                    { index + 1 }
                </>
            )
        }, {
            key: 'productStatus',
            title: '状态',
            dataIndex: 'productStatus',
            width: 150,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'productStatus']}>
                    { record.productStatus === 3 ? '已下发' : record.productStatus === 2 ? '审批中' : '待下发' }
                    {/* { this.getForm()?.getFieldsValue(true).productDtos[index]?.productStatus && this.getForm()?.getFieldsValue(true).productDtos[index]?.productStatus === 3 ? '已下发' : this.getForm()?.getFieldsValue(true).productDtos[index]?.productStatus === 2 ? '审批中' : '待下发' } */}
                </Form.Item>
            )
        }, {
            key: 'lineName',
            title: '线路名称',
            dataIndex: 'lineName',
            width: 150,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'lineName']}>
                    <Input maxLength={ 100 } disabled/>
                </Form.Item> 
            )
        }, {
            key: 'productType',
            title: '产品类型',
            dataIndex: 'productType',
            width: 150,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'productType']}>
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
            key: 'productShape',
            title: '塔型',
            dataIndex: 'productShape',
            width: 150,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'productShape']}>
                    <Input disabled maxLength={ 50 }/>
                </Form.Item> 
            )
        }, {
            key: 'productNumber',
            title: '杆塔号',
            dataIndex: 'productNumber',
            width: 150,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'productNumber']}>
                    <Input maxLength={ 50 } disabled/>
                </Form.Item> 
            )
        }, {
            key: 'voltageGrade',
            title: '电压等级',
            dataIndex: 'voltageGrade',
            width: 150,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'voltageGrade']}>
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
                <Form.Item name={['productDtos', index,'productHeight']}>
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
            width: 150,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index, 'unit']} rules= {[{
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
                <Form.Item name={['productDtos', index,'num']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
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
                <Form.Item name={['productDtos', index,'price']} rules= {[{
                    required: true,
                    message: '请输入产品单价'
                }]}>
                    <InputNumber
                        min="0.01"
                        step="0.01"
                        stringMode={ false } 
                        precision={ 2 }
                        disabled={ saleOrder?.contractInfoDto?.chargeType !== ChargeType.UNIT_PRICE || readonly || record.productStatus === 2 || record.productStatus === 3 } 
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
                <Form.Item name={['productDtos', index,'totalAmount']}>
                    <Input disabled/>
                </Form.Item>
            )
        }, {
            key: 'tender',
            title: '标段',
            dataIndex: 'tender',
            width: 150,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index, 'tender']}>
                    <Input disabled={ record.productStatus === 2 || record.productStatus === 3 } maxLength={ 100 }/>
                </Form.Item>
            )
        }, {
            key: 'description',
            title: '备注',
            dataIndex: 'description',
            width: 150,
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index, 'description']}>
                    <Input maxLength={ 50 }/>
                </Form.Item> 
            )
        }, {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 180,
            fixed: 'right',
            render: (_: undefined, record: IProductVo, index: number): React.ReactNode => (
                <ConfirmableButton confirmTitle="要删除该条回款计划吗？"
                    type="link" placement="topRight"
                    onConfirm={ () => { 
                        this.tableDelete(index);
                    } }>
                    <DeleteOutlined />
                </ConfirmableButton>
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
            dataSource: [...(this.state.saleOrder?.productDtos || []) ] ,
            columns: this.getColumns(),
            pagination: false,
            scroll: { x: 1200 }
        };
    }

    public selectAddRow = (selectedRows: DataType[] | any) => {
        const saleOrder: ISaleOrder | undefined = this.getForm()?.getFieldsValue(true);
        let productDtos: IProductVo[] | undefined = saleOrder?.productDtos || [];
        let totalWeight: number | undefined = saleOrder?.totalWeight || 0;
        if(selectedRows && selectedRows.length > 0 ) {
            const product: IProductVo = {
                productStatus: 0,
                lineName: selectedRows[0].lineName,
                productType: selectedRows[0].productType,
                productShape: selectedRows[0].productShape,
                productNumber: selectedRows[0].productNumber,
                voltageGrade: selectedRows[0].voltageGrade,
                productHeight: selectedRows[0].productHeight,
                num: selectedRows[0].productWeight,
                unit: selectedRows[0].unit,
                price: saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE ? undefined : saleOrder?.totalPrice,
                totalAmount: saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE ? undefined : Number.parseFloat(((saleOrder?.totalPrice || 0 ) * selectedRows[0].productWeight).toFixed(2)),
                tender: selectedRows[0].tender,
                description: selectedRows[0].description,
            };
            productDtos.push(product);
            totalWeight = totalWeight + selectedRows[0].productWeight; 
            this.setState({
                saleOrder: {
                    ...(saleOrder || { taxAmount: 0, taxRate: 0, totalWeight: 0, totalAmount: 0,productVos: [] }),
                    productDtos: productDtos
                }
            })
            this.getForm()?.setFieldsValue({ ...saleOrder, productDtos: [...(productDtos || [])], totalWeight: totalWeight });
            this.getUnitByChargeType();
        }   
        let orderQuantity: number | undefined = this.state.orderQuantity;
        if(saleOrder?.contractInfoDto?.chargeType === ChargeType.UNIT_PRICE) {
            if(orderQuantity !== undefined) {
                orderQuantity = orderQuantity + 1;
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
        const readonly: boolean = this.state.isChangeProduct;
        
        return [{
            title: '产品信息',
            render: (): React.ReactNode => {
                return (
                    <>
                        <TowerSelectionModal onSelect={ this.selectAddRow } readonly={ readonly } id={ this.state.saleOrder?.contractInfoDto?.contractId }/>
                        <Table { ...this.getTableProps() } summary={pageData => {
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell colSpan={ 9 } index={ 1 }>总结</Table.Summary.Cell>
                                        <Table.Summary.Cell index={ 2 }>
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