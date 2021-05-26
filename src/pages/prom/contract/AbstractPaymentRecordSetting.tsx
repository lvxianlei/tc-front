/**
 * @author zyc
 * @copyright © 2021 zyc
 */
import { DatePicker, FormProps, Input, Select } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router';


import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../../components/AbstractFillableComponent';
import ClientSelectionComponent from '../../../components/ClientSelectionModal';
import ContractSelectionComponent from '../../../components/ContractSelectionModal';
import PaymentPlanSelectionComponent from '../../../components/PaymentPlanSelectionModal'
import RequestUtil from '../../../utils/RequestUtil';
import moment from 'moment';

const { Option } = Select;

export interface IAbstractPaymentRecordSettingState extends IAbstractFillableComponentState {
    readonly selectedRowKeys: React.Key[] | any;
    readonly paymentRecord?: IPaymentRecord;
    readonly selectedRows: object[] | any;
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

export interface DataType{}

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
     * @description 弹窗表格选择
     * @returns 
     */
    public onSelectChange = (selectedRowKeys: React.Key[],selectedRows: DataType[]) => {
        this.setState({ 
            selectedRowKeys,
            selectedRows
        });
    }

    /**
     * @override
     * @description 客户弹窗
     * @returns 
     */
    public handleOk = ():void => {
        const paymentRecord: IPaymentRecord | undefined = this.state.paymentRecord;
        const selectValue = this.state.selectedRows;
        console.log(selectValue)
        if(selectValue.length > 0 ) {
            this.setState({
                paymentRecord: {
                    ...(paymentRecord || {}),
                    customerName: selectValue[0].name,
                    signCustomerId: selectValue[0].id
                }
            })
            this.getForm()?.setFieldsValue({ customerName: selectValue[0].name })
        }
    }

    /**
     * @override
     * @description 合同弹窗
     * @returns 
     */
     public handleContractOk = ():void => {
        const paymentRecord: IPaymentRecord | undefined = this.state.paymentRecord;
        const selectValue = this.state.selectedRows;
        if(selectValue.length > 0 ) {
            this.setState({
                paymentRecord: {
                    ...(paymentRecord || {}),
                    signCustomerId: selectValue[0].signCustomerId,
                    projectName: selectValue[0].projectName,
                    contractId: selectValue[0].contractNumber,
                    customerName: selectValue[0].signCustomerName,
                },
                id: selectValue[0].id
            })
            this.getForm()?.setFieldsValue({ 
                projectName: selectValue[0].projectName, 
                contractId: selectValue[0].contractNumber,
                customerName: selectValue[0].signCustomerName })
        }
    }
    
    /**
     * @override
     * @description 回款计划弹窗
     * @returns 
     */
     public handlePlanOk = ():void => {
        const paymentRecord: IPaymentRecord | undefined = this.state.paymentRecord;
        const selectValue = this.state.selectedRows;
        if(selectValue.length > 0 ) {
            this.setState({
                paymentRecord: {
                    ...(paymentRecord || {}),
                    paymentPlanId: selectValue[0].period,
                    returnedTime: selectValue[0].returnedTime,
                    returnedRate: selectValue[0].returnedRate,
                    returnedAmount: selectValue[0].returnedAmount,
                },
                id: selectValue[0].id
            })
            this.getForm()?.setFieldsValue({ paymentPlanId: selectValue[0].period,
                returnedTime: moment(selectValue[0].returnedTime),
                returnedRate: selectValue[0].returnedRate,
                returnedAmount: selectValue[0].returnedAmount, })
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
                            <ContractSelectionComponent handleOk={ () => this.handleContractOk() } onSelectChange={ this.onSelectChange }/>
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
                        <ClientSelectionComponent handleOk={ () => this.handleOk() } onSelectChange={ this.onSelectChange }/>
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
                        <PaymentPlanSelectionComponent handleOk={ () => this.handlePlanOk() } onSelectChange={ this.onSelectChange } Id={ this.state.id }/>
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
                initialValue: moment(paymentRecord?.refundTime),
                rules: [{
                required: true,
                message: '请选择来款时间'
            }],
                children: <DatePicker />
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
                children: <Input/>
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
                children: <Input/>
            }, {
                label: '外币金额',
                name: 'foreignExchangeAmount',
                initialValue: paymentRecord?.foreignExchangeAmount,
                rules: [{
                    required: true,
                    message: '请输入外币金额'
                }],
                children: <Input/>
            }, {
                label: '收款银行',
                name: 'refundBank',
                initialValue: paymentRecord?.refundBank,
                children: <Input/>
            }, {
                label: '备注',
                name: 'description',
                initialValue: paymentRecord?.description,
                children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息"/>
            }]
        }]];
    }
}