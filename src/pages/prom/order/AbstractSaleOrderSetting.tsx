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
import { couldStartTrivia } from 'typescript';

export interface IAbstractSaleOrderSettingState extends IAbstractFillableComponentState {
    readonly saleOrder?: ISaleOrder;
    readonly orderQuantity: number;
    readonly newOption: IOption;
}

export interface ISaleOrder {
    readonly id?: number;
    readonly ordersNumber?: number;
    readonly contractInfoDto?: IContractInfoDto;
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
    readonly productDtos?: IProductDtos[];
    readonly purchaseOrderNumber?: string;
    readonly guaranteeType?: string
}

interface IProductDtos {
    readonly productStatus: number;
}

interface IContractInfoDto {
    readonly contractNumber?: string;
    readonly internalNumber?: string;
    readonly projectName?: string;
    readonly customerCompany?: string;
    readonly signCustomerName?: string;
    readonly signContractTime?: string;
    readonly deliveryTime?: string;
    readonly currencyType?: number;
    readonly chargeType?: number;
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
        orderQuantity: 0,
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
            const select: IContractInfoDto = {
                contractNumber: selectedRows[0].contractNumber,
                internalNumber: selectedRows[0].internalNumber,
                projectName: selectedRows[0].projectName,
                customerCompany: selectedRows[0].customerCompany,
                signCustomerName: selectedRows[0].signCustomerName,
                signContractTime: selectedRows[0].signContractTime,
                deliveryTime: selectedRows[0].deliveryTime,
                currencyType: selectedRows[0].currencyType,
                chargeType: selectedRows[0].chargeType,
            };
            this.setState({
                saleOrder: {
                    ...(saleOrder || {}),
                    contractInfoDto: select
                },
            })
            this.getForm()?.setFieldsValue(select)
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
            },{
                label: 0.007,
                value: 2
            }
        ]
    }
    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        const saleOrder: ISaleOrder | undefined = this.state.saleOrder;
        const orderQuantity: number = this.state.orderQuantity;
        console.log(saleOrder)
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
                initialValue: saleOrder?.contractInfoDto?.contractNumber,
                rules: [{
                    required: true,
                    message: '请选择关联合同'
                }],
                children:
                    <>
                        <Input value={ saleOrder?.contractInfoDto?.contractNumber } suffix={ 
                            <ContractSelectionComponent onSelect={ this.onSelect } />
                        }/>
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
                        <Select.Option value={ 1 }>订单总价、总重计算单价</Select.Option>
                        <Select.Option value={ 2 }>产品单价、基数计算总价</Select.Option>
                    </Select>
                )
                        
            }, {
                label: '币种',
                name: 'currencyType',
                initialValue: saleOrder?.contractInfoDto?.currencyType,
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
                children: <Input  prefix="￥" disabled={ saleOrder?.contractInfoDto?.chargeType === 2 }/>
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
                    <Select showSearch onSearch={(value: string) => {
                        console.log(typeof(parseFloat(parseFloat(value).toFixed(4))))
                        this.setState({
                            newOption: {
                                label: parseFloat(parseFloat(value).toFixed(4)),
                                value: parseFloat(parseFloat(value).toFixed(4))
                            }
                        });
                    }} onChange={ () => {
                        const saleOrder: ISaleOrder = this.getForm()?.getFieldsValue(true);
                        // const amount: number = saleOrder.amount;
                        console.log(saleOrder)
                    } }>
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
                children:  <Input/>
            }, {
                label: '外汇金额',
                name: 'foreignExchangeAmount',
                initialValue: saleOrder?.foreignExchangeAmount,
                children:  <Input/>
            }, {
                label: '外汇单价',
                name: 'foreignPrice',
                initialValue: saleOrder?.foreignPrice,
                children:  <Input/>
            }, {
                label: '保函类型',
                name: 'guaranteeType',
                initialValue: saleOrder?.guaranteeType,
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

    /**
     * @description Renders extra sections
     * @returns extra sections 
     */
    public renderExtraSections(): IRenderedSection[] {
        const saleOrder: ISaleOrder | undefined = this.state.saleOrder;
        return [{
            title: '产品信息',
            render: (): React.ReactNode => {
                return (
                    <>
                        <Form.List name="paymentPlanDtos" initialValue={ saleOrder?.productDtos || [] }>
                            {
                                (fields: FormListFieldData[], operation: FormListOperation): React.ReactNode => {
                                    return (
                                        <>
                                            <Button type="primary" onClick={ () => {
                                                    operation.add();
                                                    const orderQuantity: number = this.state.orderQuantity;
                                                    this.setState({
                                                        orderQuantity: orderQuantity+1
                                                    })
                                                }   
                                            } className={ styles.addBtn }>新增</Button>
                                            <Row  className={ styles.FormHeader }>
                                                <Col span={ 1 }></Col>
                                                <Col span={ 1 }>序号</Col>
                                                <Col span={ 2 }>状态</Col>
                                                <Col span={ 2 }>* 线路名称</Col>
                                                <Col span={ 2 }>产品类型</Col>
                                                <Col span={ 2 }>* 塔型</Col>
                                                <Col span={ 2 }>* 杆塔号</Col>
                                                <Col span={ 2 }>* 电压等级</Col>
                                                <Col span={ 2 }>呼高（米）</Col>
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
                                                                    operation.remove(index); 
                                                                    const orderQuantity: number = this.state.orderQuantity;
                                                                    this.setState({
                                                                        orderQuantity: orderQuantity-1
                                                                    })
                                                                } }>
                                                                <DeleteOutlined />
                                                            </ConfirmableButton>
                                                        </Col>
                                                        <Col span={ 1 }>{ index + 1 }</Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'productStatus']} fieldKey={[field.fieldKey, 'productStatus']}>
                                                                <Input disabled/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'lineName']} fieldKey={[field.fieldKey, 'lineName']}>
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
                                                            <Form.Item { ...field } name={[field.name, 'productShape']} fieldKey={[field.fieldKey, 'productShape']}>
                                                                <Input/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'productNumber']} fieldKey={[field.fieldKey, 'productNumber']}>
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
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'productHeight']} fieldKey={[field.fieldKey, 'productHeight']}>
                                                            <InputNumber
                                                                min="0"
                                                                step="0.01"
                                                                stringMode={ false } 
                                                                precision={ 2 }
                                                            />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'price']} fieldKey={[field.fieldKey, 'price']}>
                                                                <Input prefix="￥"/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'totalAmount']} fieldKey={[field.fieldKey, 'totalAmount']}>
                                                                <Input prefix="￥"/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'tender']} fieldKey={[field.fieldKey, 'tender']}>
                                                                <Input prefix="￥"/>
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
                            <Col span={ 16 }>
                            总计
                        </Col>
                        <Col span={ 2 }>
                        <Form.Item className={ styles.FormItem }>
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={ 2 }>
                        <Form.Item className={ styles.FormItem }>
                                <Input/>
                            </Form.Item>
                        </Col>
                        </Row>
                        
                    </>
                );
            }
        }];
    }
}