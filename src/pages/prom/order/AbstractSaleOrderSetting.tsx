/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, Col, DatePicker, Form, FormProps, Input, InputNumber, Row, Select } from 'antd';
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

export interface IAbstractSaleOrderSettingState extends IAbstractFillableComponentState {
    readonly saleOrder?: ISaleOrder;
    readonly orderQuantity: number;
    readonly newOption: IOption;
}

export interface ISaleOrder {
    readonly id?: number;
    readonly ordersNumber?: number;
    readonly contractInfoVo?: IcontractInfoVo;
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
    productVos?: IProductVos[];
    readonly purchaseOrderNumber?: string;
    readonly guaranteeType?: string;
    readonly totalWeight: number;
    readonly totalAmount: number;
}

export interface IProductVos {
    readonly index?: number;
    readonly productStatus?: number;
    readonly description?: string;	
    readonly id?: number;
    readonly lineName?: string;
    readonly num: number;
    readonly price: number;
    readonly productHeight?: number;
    readonly productNumber?: string;
    readonly productShape?: string;	
    readonly productType?: number;
    readonly saleOrderId?: number;
    readonly taskNoticeId?: number;
    readonly tender?: string;
    readonly totalAmount: number;
    readonly unit?: string;
    readonly voltageGrade?: number;
}

interface IcontractInfoVo {
    readonly contractNumber?: string;
    readonly internalNumber?: string;
    readonly projectName?: string;
    readonly customerCompany?: string;
    readonly signCustomerName?: string;
    readonly signContractTime?: string;
    readonly deliveryTime?: string;
    readonly currencyType?: number;
    readonly chargeType?: number;
    readonly orderDeliveryTime?: object;
}

interface IOption {
    readonly value: number;
    readonly label: number;
}
/**
 * Abstract SaleOrder Setting
 */
export default abstract class AbstractSaleOrderSetting<P extends RouteComponentProps, S extends IAbstractSaleOrderSettingState> extends AbstractFillableComponent<P, S> {

    public state: S = {
        saleOrder: undefined,
    } as S;

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
                span: 16
            }
        };
    }

    public componentDidUpdate(): void {
        const orderQuantity: number = this.state.orderQuantity;
        this.getForm()?.setFieldsValue({ orderQuantity: orderQuantity })
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
        if(selectedRows.length > 0 ) {
            const select: IcontractInfoVo = {
                contractNumber: selectedRows[0].contractNumber,
                internalNumber: selectedRows[0].internalNumber,
                projectName: selectedRows[0].projectName,
                customerCompany: selectedRows[0].customerCompany,
                signCustomerName: selectedRows[0].signCustomerName,
                signContractTime: selectedRows[0].signContractTime,
                deliveryTime: selectedRows[0].deliveryTime,
                currencyType: selectedRows[0].currencyType,
                chargeType: selectedRows[0].chargeType,
                orderDeliveryTime: moment(selectedRows[0].deliveryTime),
            };
            this.setState({
                saleOrder: {
                    ...(saleOrder || { taxAmount: 0, taxRate: 0, totalWeight: 0, totalAmount: 0 }),
                    contractInfoVo: select
                },
            })
            this.getForm()?.setFieldsValue({ ...select, price: 0  })
        }   
    }

    /**
     * @description 税率select-Option
     */
    public getTaxRateOption(): IOption[] {
        return [
            {
                label: 0.64,
                value: 1
            }, {
                label: 0.007,
                value: 2
            }
        ]
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
        amount = taxAmount / (1 + taxRate);
        amount = parseFloat(amount.toFixed(2));
        this.getForm()?.setFieldsValue({ amount: amount });
        this.getPriceAccordTaxRate();
    }

    /**
     * @description 订单总重失去焦点时总计金额同步&根据税率计算不含税金额
     */
    public amountBlur = (): void => {
        const saleOrderValue: ISaleOrder = this.getForm()?.getFieldsValue(true);
        const taxAmount: number = saleOrderValue.taxAmount;
        this.getPrice();
        this.getForm()?.setFieldsValue({ totalAmount: taxAmount });
        this.getAmount();
    }
    
    /**
     * @description 订单总重-计算含税单价
     */
    public getPrice = (): void => {
        console.log("prie")
        const saleOrder: ISaleOrder = this.getForm()?.getFieldsValue(true);
        const productVos: IProductVos[] = this.getForm()?.getFieldsValue(true).productVos;
        if(productVos.length > 0) {
            let totalPrice: number = 0;
            totalPrice = saleOrder.taxAmount / saleOrder.totalWeight;
            totalPrice = parseFloat(totalPrice.toFixed(4));
            productVos.map<void>((items: IProductVos, ind: number): void => {
                productVos[ind] = {
                    ...productVos[ind],
                    price: totalPrice
                }
            })
            this.getForm()?.setFieldsValue({ totalPrice: totalPrice, taxPrice: totalPrice, productVos: productVos });
        }
    }

    /**
     * @description 根据税率计算不含税单价
     */
     public getPriceAccordTaxRate = (): void => {
        const saleOrder: ISaleOrder = this.getForm()?.getFieldsValue(true);
        const amount: number = this.getForm()?.getFieldsValue(true).amount;
        const totalWeight: number = saleOrder.totalWeight;
        let price: number = 0;
        price = amount / totalWeight;
        price = parseFloat(price.toFixed(4));
        this.getForm()?.setFieldsValue({ price: price });
    }

    /**
     * @description 订单总重-输入产品重量计算总计重量
     */
    public numBlur(index: number): void {
        let productVos: IProductVos[] = this.getForm()?.getFieldsValue(true).productVos;
        if(productVos[index]) {
            if(productVos[index].num) {
                let totalNum: number = 0;
                productVos.map<void>((items: IProductVos): void => {
                    totalNum = Number(totalNum) + Number(items.num);
                })
                this.getForm()?.setFieldsValue({ totalWeight: totalNum });
                this.setState({
                    orderQuantity: totalNum
                })
            }
            this.getPrice();
            this.getPriceAccordTaxRate();
            productVos.map<void>((items: IProductVos, ind: number): void => {
                const num: number = productVos[ind].num;
                const price: number = productVos[ind].price;
                productVos[ind] = {
                    ...productVos[ind],
                    totalAmount: num * price
                }
            })
            this.getForm()?.setFieldsValue({ productVos: productVos });
        }                                                              
    }

    /**
     * @description 产品单价-输入产品单价计算总计单价&单行金额
     */
    public priceBlur(index: number): void {
        const saleOrder: ISaleOrder | undefined = this.state.saleOrder;
        const productVos: IProductVos[] = this.getForm()?.getFieldsValue(true).productVos;
        if(productVos[0]) {
            if(productVos[index].price) {
                const price: number = productVos[index].price;
                let totalPrice: number = 0;
                let amount: number = 0;
                
                if(saleOrder?.contractInfoVo?.chargeType === 2) {
                    amount = price * 1; 
                }
                productVos.map<void>((items: IProductVos): void => {
                    totalPrice = Number(totalPrice) + Number(items.price);
                })
                productVos[index] = {
                    ...productVos[index],
                    totalAmount: amount
                }
                this.getForm()?.setFieldsValue({ taxPrice: totalPrice, totalPrice: totalPrice, productVos: productVos });
                this.getTotalAmount();
                this.getAmount();
            }
        }                                                           
    }

    /**
     * @description 产品单价-计算总计金额
     */
     public getTotalAmount(): void {
        const productVos: IProductVos[] = this.getForm()?.getFieldsValue(true).productVos;
        let totalAmount: number = 0;
        console.log(productVos)
        productVos.map<void>((items: IProductVos): void => {
            totalAmount = Number(totalAmount) + Number(items.totalAmount);
        })
        this.getForm()?.setFieldsValue({ taxAmount: totalAmount, totalAmount: totalAmount });
    }

    /**
     * @description 产品信息删除
     */
     public tableDelete(index: number): void {
        const saleOrderValue: ISaleOrder = this.getForm()?.getFieldsValue(true);
        const saleOrder: ISaleOrder | undefined = this.state.saleOrder;
        const productVos: IProductVos[] = this.getForm()?.getFieldsValue(true).productVos;
        const orderQuantity: number = this.state.orderQuantity;
        this.setState({
            orderQuantity: orderQuantity-1
        })
        if( saleOrder?.contractInfoVo?.chargeType === 1 ) {
            const num: number = productVos[index].num;
            let totalWeight: number = saleOrderValue.totalWeight;
            totalWeight = totalWeight - num;
            this.getForm()?.setFieldsValue({ totalWeight: totalWeight });
            this.getPrice();
        } else if( saleOrder?.contractInfoVo?.chargeType === 2 ) {
            const price: number = productVos[index].price;
            const amount: number = productVos[index].totalAmount;
            let totalPrice: number = this.getForm()?.getFieldsValue(true).totalPrice;
            let totalAmount: number = this.getForm()?.getFieldsValue(true).totalAmount;
            console.log(totalAmount)
            totalPrice = totalPrice - price;
            totalAmount = totalAmount - amount;
            console.log(totalAmount, totalPrice)
            this.getForm()?.setFieldsValue({  taxPrice: totalPrice, totalPrice: totalPrice,  taxAmount: totalAmount, totalAmount: totalAmount  });
        }   
    }

    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        const saleOrder: ISaleOrder | undefined = this.state.saleOrder;
        const orderQuantity: number = this.state.orderQuantity;
        return [[{
            title: '基础信息',
            itemCol: {
                span: 8
            },
            itemProps: [{
                label: '订单编号',
                name: 'ordersNumber',
                initialValue: saleOrder?.ordersNumber,
                children: <Input disabled/>
            }, {
                label: '采购订单号',
                name: 'purchaseOrderNumber',
                initialValue: saleOrder?.purchaseOrderNumber,
                children: <Input/>
            }, {
                label: '关联合同',
                name: 'contractNumber',
                initialValue: saleOrder?.contractInfoVo?.contractNumber,
                rules: [{
                    required: true,
                    message: '请选择关联合同'
                }],
                children:
                    <>
                        <Input value={ saleOrder?.contractInfoVo?.contractNumber } suffix={ 
                            <ContractSelectionComponent onSelect={ this.onSelect } />
                        }/>
                    </>
            },  {
                label: '内部合同编号',
                name: 'internalNumber',
                initialValue: saleOrder?.contractInfoVo?.internalNumber,
                children: <Input disabled/>
            }, {
                label: '工程名称',
                name: 'projectName',
                initialValue: saleOrder?.contractInfoVo?.projectName,
                children: <Input disabled/>
            },  {
                label: '业主单位',
                name: 'customerCompany',
                initialValue: saleOrder?.contractInfoVo?.customerCompany,
                children: <Input disabled/>
            }, {
                label: '合同签订单位',
                name: 'signCustomerName',
                initialValue: saleOrder?.contractInfoVo?.signCustomerName,
                children: <Input disabled/>
            }, {
                label: '合同签订日期',
                name: 'signContractTime',
                initialValue: saleOrder?.contractInfoVo?.signContractTime,
                children:  <Input disabled/>
            },  {
                label: '要求交货日期',
                name: 'deliveryTime',
                initialValue: saleOrder?.contractInfoVo?.deliveryTime,
                children:  <Input disabled/>
            }, {
                label: '计价方式',
                name: 'chargeType',
                initialValue: saleOrder?.contractInfoVo?.chargeType,
                children: (
                    <Select disabled>
                        <Select.Option value={ 1 }>订单总价、总重计算单价</Select.Option>
                        <Select.Option value={ 2 }>产品单价、基数计算总价</Select.Option>
                    </Select>
                )
                        
            }, {
                label: '币种',
                name: 'currencyType',
                initialValue: saleOrder?.contractInfoVo?.currencyType,
                children: (
                    <Select disabled>
                        <Select.Option value={ 1 }>RMB人民币</Select.Option>
                        <Select.Option value={ 2 }>USD美元</Select.Option>
                    </Select>
                )
            }, {
                label: '订单数量',
                name: 'orderQuantity',
                initialValue: saleOrder?.orderQuantity || orderQuantity,
                children: <Input disabled/>
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
                    disabled={ saleOrder?.contractInfoVo?.chargeType === 2 } 
                    onBlur={ this.amountBlur }/>
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
                    <Select showSearch onSearch={ this.addNewOption } onChange={ this.getAmount }>
                        {
                            this.state.newOption ? 
                            <Select.Option key={ this.state.newOption.value } value={ this.state.newOption.label }>{ this.state.newOption.value }</Select.Option> 
                            : ""
                        }
                        { this.getTaxRateOption().map<React.ReactNode>((items: IOption): React.ReactNode => {
                            return <Select.Option key={ items.value } value={items.label}>{items.label}</Select.Option>;
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
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 }/>
            }, {
                label: '外汇金额',
                name: 'foreignExchangeAmount',
                initialValue: saleOrder?.foreignExchangeAmount,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 2 }/>
            }, {
                label: '外汇单价',
                name: 'foreignPrice',
                initialValue: saleOrder?.foreignPrice,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 }/>
            }, {
                label: '保函类型',
                name: 'guaranteeType',
                initialValue: saleOrder?.guaranteeType,
                children:  <Input/>
            }, {
                label: '保函金额',
                name: 'guaranteeAmount',
                initialValue: saleOrder?.guaranteeAmount,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 2 }/>
            }, {
                label: '港口费用',
                name: 'portCharge',
                initialValue: saleOrder?.portCharge,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 }/>
            }, {
                label: '海运及保险费',
                name: 'insuranceCharge',
                initialValue: saleOrder?.insuranceCharge,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 }/>
            }, {
                label: '佣金',
                name: 'commissionCharge',
                initialValue: saleOrder?.commissionCharge,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 }/>
            }, {
                label: '出口信用保险',
                name: 'creditInsurance',
                initialValue: saleOrder?.creditInsurance,
                children:  <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 }/>
            }, {
                label: '订单交货日期',
                name: 'orderDeliveryTime',
                initialValue: moment(saleOrder?.orderDeliveryTime),
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
     * @description Renders extra sections
     * @returns extra sections 
     */
    public renderExtraSections(): IRenderedSection[] {
        const saleOrder: ISaleOrder | undefined = this.state.saleOrder;
        console.log(saleOrder)
        return [{
            title: '产品信息',
            render: (): React.ReactNode => {
                return (
                    <>
                        <Form.List name="productVos" initialValue={ saleOrder?.productVos || [] }>
                            {
                                (fields: FormListFieldData[], operation: FormListOperation): React.ReactNode => {
                                    return (
                                        <>
                                            <Button type="primary" onClick={ () => {
                                                operation.add();
                                                const orderQuantity: number = this.state.orderQuantity;
                                                if( saleOrder?.contractInfoVo?.chargeType === 1 ) {
                                                    const saleOrderValue: ISaleOrder = this.getForm()?.getFieldsValue(true);
                                                    this.setState({
                                                        orderQuantity: saleOrderValue.totalWeight
                                                    })
                                                } else {
                                                    this.setState({
                                                        orderQuantity: orderQuantity+1
                                                    })
                                                }
                                            } } className={ styles.addBtn }>新增</Button>
                                            <Row  className={ styles.FormHeader }>
                                                <Col span={ 1 }></Col>
                                                <Col span={ 1 }>序号</Col>
                                                <Col span={ 1 }>状态</Col>
                                                <Col span={ 2 }>* 线路名称</Col>
                                                <Col span={ 2 }>产品类型</Col>
                                                <Col span={ 2 }>* 塔型</Col>
                                                <Col span={ 2 }>* 杆塔号</Col>
                                                <Col span={ 2 }>* 电压等级</Col>
                                                <Col span={ 1 }>呼高（米）</Col>
                                                <Col span={ 2 } className={ saleOrder?.contractInfoVo?.chargeType === 2 ? styles.isShow : '' }>* 重量（吨）</Col>
                                                <Col span={ 2 }>单价</Col>
                                                <Col span={ 2 }>金额</Col>
                                                <Col span={ 2 }>标段</Col>
                                                <Col span={ 2 }>备注</Col>
                                            </Row>
                                            {
                                                fields.map<React.ReactNode>((field: FormListFieldData, index: number): React.ReactNode => (
                                                    <Row key={ `${ field.name }_${ index }` } className={ styles.FormItem }>
                                                        <Col span={ 1 }>
                                                            <ConfirmableButton confirmTitle="要删除该条回款计划吗？"
                                                                type="link" placement="topRight"
                                                                onConfirm={ () => { 
                                                                    this.tableDelete(index);
                                                                    operation.remove(index); 
                                                                } }>
                                                                <DeleteOutlined />
                                                            </ConfirmableButton>
                                                        </Col>
                                                        <Col span={ 1 }>{ index + 1 }</Col>
                                                        <Col span={ 1 }>
                                                            <Form.Item { ...field } name={[field.name, 'productStatus']} fieldKey={[field.fieldKey, 'productStatus']}>
                                                                <Input disabled/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item 
                                                                { ...field } 
                                                                name={[field.name, 'lineName']} 
                                                                fieldKey={[field.fieldKey, 'lineName']} 
                                                                rules= {[{
                                                                    required: true,
                                                                    message: '请输入线路名称'
                                                                }]}>
                                                                <Input/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'productType']} fieldKey={[field.fieldKey, 'productType']}>
                                                                <Select>
                                                                    <Select.Option value={ 1 }>角钢塔</Select.Option>
                                                                    <Select.Option value={ 2 }>管塔</Select.Option>
                                                                    <Select.Option value={ 3 }>螺栓</Select.Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'productShape']} fieldKey={[field.fieldKey, 'productShape']} rules= {[{
                                                                    required: true,
                                                                    message: '请输入塔型'
                                                                }]}>
                                                                <Input/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'productNumber']} fieldKey={[field.fieldKey, 'productNumber']} rules= {[{
                                                                    required: true,
                                                                    message: '请输入杆塔号'
                                                                }]}>
                                                                <Input/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'voltageGrade']} fieldKey={[field.fieldKey, 'voltageGrade']}>
                                                                <Select style={{ width: '90%' }}>
                                                                    <Select.Option value={ 1 }>220</Select.Option>
                                                                    <Select.Option value={ 2 }>110</Select.Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 1 }>
                                                            <Form.Item { ...field } name={[field.name, 'productHeight']} fieldKey={[field.fieldKey, 'productHeight']}>
                                                                <InputNumber
                                                                    min="0"
                                                                    step="0.01"
                                                                    stringMode={ false } 
                                                                    precision={ 2 }
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }  className={ saleOrder?.contractInfoVo?.chargeType === 2? styles.isShow : '' }>
                                                            <Form.Item { ...field } name={[field.name, 'num']} fieldKey={[field.fieldKey, 'num']} rules= {[{
                                                                    required: true,
                                                                    message: '请输入产品重量'
                                                                }]}>
                                                                <Input onBlur={ () => this.numBlur(index) }/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'price']} fieldKey={[field.fieldKey, 'price']} rules= {[{
                                                                    required: true,
                                                                    message: '请输入产品单价'
                                                                }]}>
                                                                <Input prefix="￥" disabled={ saleOrder?.contractInfoVo?.chargeType !== 2 } onBlur={ () => this.priceBlur(index) }/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'totalAmount']} fieldKey={[field.fieldKey, 'totalAmount']}>
                                                                <Input prefix="￥" disabled/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'tender']} fieldKey={[field.fieldKey, 'tender']}>
                                                                <Input/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'description']} fieldKey={[field.fieldKey, 'description']}>
                                                                <Input.TextArea rows={ 5 } maxLength={ 300 }/>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                ))
                                            }
                                        </>
                                    );
                                }
                            }
                            
                        </Form.List>
                        <Row>
                            <Col span={ 14 }>
                                总计
                            </Col>
                            <Col span={ 2 } className={ saleOrder?.contractInfoVo?.chargeType === 2 ? styles.isShow : '' }>
                                <Form.Item name="totalWeight">
                                    <Input disabled/>
                                </Form.Item>
                                </Col>
                            <Col span={ 2 }>
                                <Form.Item name="totalPrice">
                                    <Input disabled/>
                                </Form.Item>
                            </Col>
                            <Col span={ 2 }>
                                <Form.Item name="totalAmount">
                                    <Input disabled/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                );
            }
        }];
    }
}