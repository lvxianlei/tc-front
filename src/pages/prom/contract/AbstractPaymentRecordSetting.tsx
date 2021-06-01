/**
 * @author zyc
 * @copyright © 2021 zyc
 */
import { DatePicker, FormProps, Input, InputNumber, Select } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router';


import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../../components/AbstractFillableComponent';
import ClientSelectionComponent from '../../../components/ClientSelectionModal';
import ContractSelectionComponent from '../../../components/ContractSelectionModal';
import PaymentPlanSelectionComponent from '../../../components/PaymentPlanSelectionModal'
import RequestUtil from '../../../utils/RequestUtil';
import moment from 'moment';
import { DataType } from '../../../components/AbstractSelectableModal';

const { Option } = Select;

export interface IAbstractPaymentRecordSettingState extends IAbstractFillableComponentState {
    readonly paymentRecord?: IPaymentRecord;
    readonly tableDataSource: [];
    readonly id: number;
}

export interface IPaymentRecord {
    readonly contractId?: number;
    readonly name?: string;
    readonly customerName?: string;
    readonly paymentPlanId?: number;
    readonly refundTime?: string;
    readonly refundMode?: string;
    readonly refundAmount?: string;
    readonly currencyType?: number;
    readonly exchangeRate?: number;
    readonly foreignExchangeAmount?: number;
    readonly refundBank?: string;
    readonly description?: string;
    readonly projectName?: string;
    readonly returnedTime?: string;
    readonly returnedRate?: number;
    readonly returnedAmount?: number;
    readonly refundNumber?: number;
    readonly signCustomerId?: number;
}

export interface IResponseData {
    readonly total: number | undefined;
    readonly size: number | undefined;
    readonly current: number | undefined;
    readonly records: [];
}

/**
 * Abstract paymentRecord Setting
 */
export default abstract class AbstractPaymentRecordSetting<P extends RouteComponentProps, S extends IAbstractPaymentRecordSettingState> extends AbstractFillableComponent<P, S> {

    public state: S = {
        paymentRecord: undefined,
    } as S;

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

    /**
     * @override
     * @description Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return '/prom/contract';
    }

    protected getGeneratNum(): string { 
        var result: number = Math.floor( Math.random() * 1000 );
        let num: string = '';
        if(result < 10) {
            num =  '00' + result;
        } else if (result<100){
            num = '0' + result;
        } else {
            num =  result.toString();
        }
        return moment().format('YYYYMMDD') + num;
    }

    /**
     * @override
     * @description 客户弹窗
     * @returns 
     */
    public onSelect = (selectedRows: DataType[]):void => {
        const paymentRecord: IPaymentRecord | undefined = this.state.paymentRecord;
        if(selectedRows.length > 0 ) {
            this.setState({
                paymentRecord: {
                    ...(paymentRecord || {}),
                    customerName: selectedRows[0].name,
                    signCustomerId: selectedRows[0].id
                }
            })
            this.getForm()?.setFieldsValue({ customerName: selectedRows[0].name })
        }
    }

    /**
     * @override
     * @description 合同弹窗
     * @returns 
     */
     public onContractSelect = (selectedRows: DataType[] | any):void => {
        const paymentRecord: IPaymentRecord | undefined = this.state.paymentRecord;
        if(selectedRows.length > 0 ) {
            this.setState({
                paymentRecord: {
                    ...(paymentRecord || {}),
                    signCustomerId: selectedRows[0].signCustomerId,
                    projectName: selectedRows[0].projectName, 
                    contractId: selectedRows[0].contractNumber,
                    customerName: selectedRows[0].signCustomerName
                },
                id: selectedRows[0].id
            })
            this.getForm()?.setFieldsValue({ 
                projectName: selectedRows[0].projectName, 
                contractId: selectedRows[0].contractNumber,
                customerName: selectedRows[0].signCustomerName })
        }
    }
    
    /**
     * @override
     * @description 回款计划弹窗
     * @returns 
     */
     public onPlanSelect = (selectedRows: DataType[] | any):void => {
        const paymentRecord: IPaymentRecord | undefined = this.state.paymentRecord;
        if(selectedRows.length > 0 ) {
            this.setState({
                paymentRecord: {
                    ...(paymentRecord || {}),
                    paymentPlanId: selectedRows[0].period,
                    returnedTime: selectedRows[0].returnedTime,
                    returnedRate: selectedRows[0].returnedRate,
                    returnedAmount: selectedRows[0].returnedAmount,
                },
                id: selectedRows[0].id
            })
            this.getForm()?.setFieldsValue({ 
                paymentPlanId: selectedRows[0].period,
                returnedTime: moment(selectedRows[0].returnedTime),
                returnedRate: selectedRows[0].returnedRate,
                returnedAmount: selectedRows[0].returnedAmount, })
        }
    }

    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        const paymentRecord: IPaymentRecord | undefined = this.state.paymentRecord;
        const GeneratNum: string = this.getGeneratNum();
        return [[{
            title: '回款计划',
            itemCol: {
            span: 8
        },
            itemProps: [{
                label: '关联合同',
                name: 'contractId',
                initialValue: paymentRecord?.contractId,
                rules: [{
                    required: true,
                    message: '请选择合同'
                }],
                children: 
                    <>
                        <Input value={ paymentRecord?.contractId } suffix={ 
                            <ContractSelectionComponent onSelect={ this.onContractSelect }/>
                        }/>
                    </>
            }, {
                label: '工程名称',
                name: 'projectName',
                initialValue: paymentRecord?.projectName,
                children: (
                    <Input disabled/>
                )
            }, {
            label: '来款单位',
            name: 'customerName',
            initialValue: paymentRecord?.customerName,
            rules: [{
                required: true,
                message: '请选择来款单位'
            }],
            children: 
                <>
                    <Input value={ paymentRecord?.customerName } suffix={ 
                        <ClientSelectionComponent onSelect={ this.onSelect }/>
                    }/>
                </>
        },  {
            label: '回款计划',
            name: 'paymentPlanId',
            initialValue: paymentRecord?.paymentPlanId,
            rules: [{
                required: true,
                message: '请选择回款计划'
            }],
            children: 
                <>
                    <Input value={ paymentRecord?.paymentPlanId } suffix={ 
                        <PaymentPlanSelectionComponent onSelect={ this.onPlanSelect } id={ this.state.id }/>
                    }/>
                </>
        }, {
            label: '计划回款日期',
            name: 'returnedTime',
            initialValue: moment(paymentRecord?.returnedTime),
            children: <DatePicker />
        }, {
            label: '计划回款占比',
            name: 'returnedRate',
            initialValue: paymentRecord?.returnedRate,
            children: <Input disabled />
        }, {
            label: '计划回款金额（￥）',
            name: 'returnedAmount',
            initialValue: paymentRecord?.returnedAmount,
            children: <Input disabled/>
        }]
        }, {
            title: '回款信息',
            itemCol: {
            span: 8
        },
            itemProps: [{
                label: '编号',
                name: 'refundNumber',
                initialValue: paymentRecord?.refundNumber || GeneratNum,
                rules: [{
                required: true,
                message: '请输入编号'
            }],
                children: <Input disabled/>
            }, {
                label: '来款时间',
                name: 'refundTime',
                initialValue: paymentRecord?.refundTime,
                rules: [{
                    required: true,
                    message: '请选择来款时间'
                }],
                children: <DatePicker showTime format="YYYY-MM-DD HH:mm" />
            }, {
                label: '来款方式',
                name: 'refundMode',
                initialValue: paymentRecord?.refundMode,
                children:
                    <Select>
                        <Select.Option value={ 1 }>现金</Select.Option>
                        <Select.Option value={ 2 }>商承</Select.Option>
                        <Select.Option value={ 3 }>银行</Select.Option>
                    </Select>
            }, {
                label: '来款金额（￥）',
                name: 'refundAmount',
                initialValue: paymentRecord?.refundAmount,
                rules: [{
                    required: true,
                    message: '请输入来款金额'
                }],
                children: <InputNumber min="0" step="0.01" stringMode={ false } precision={ 2 }/>
            }, {
                label: '币种',
                name: 'currencyType',
                initialValue: paymentRecord?.currencyType,
                children: 
                    <Select>
                        <Select.Option value={ 1 }>RMB人民币</Select.Option>
                        <Select.Option value={ 2 }>USD美元</Select.Option>
                    </Select>
            }, {
                label: '汇率',
                name: 'exchangeRate',
                initialValue: paymentRecord?.exchangeRate,
                children: <InputNumber min="0" step="0.0001" stringMode={ false } precision={ 4 }/>
            }, {
                label: '外币金额',
                name: 'foreignExchangeAmount',
                initialValue: paymentRecord?.foreignExchangeAmount,
                rules: [{
                    required: true,
                    message: '请输入外币金额'
                }],
                children: <InputNumber min="0" step="0.01" stringMode={ false } precision={ 2 }/>
            }, {
                label: '收款银行',
                name: 'refundBank',
                initialValue: paymentRecord?.refundBank,
                children: <Input maxLength={ 100 }/>
            }, {
                label: '备注',
                name: 'description',
                initialValue: paymentRecord?.description,
                children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息" />
            }]
        }]];
    }
}