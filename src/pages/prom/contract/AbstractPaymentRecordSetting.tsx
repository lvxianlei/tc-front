/**
 * @author zyc
 * @copyright © 2021 zyc
 */
import { Button, DatePicker, FormProps, Input, InputNumber, Select } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router';


import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../../components/AbstractFillableComponent';
import ClientSelectionComponent from '../../../components/ClientSelectionModal';
import ContractSelectionComponent from '../../../components/ContractSelectionModal';
import PaymentPlanSelectionComponent from '../../../components/PaymentPlanSelectionModal'
import RequestUtil from '../../../utils/RequestUtil';
import moment from 'moment';
import { DataType } from '../../../components/AbstractSelectableModal';
import { currencyTypeOptions, refundModeOptions } from '../../../configuration/DictionaryOptions';
import layoutStyles from '../../../layout/Layout.module.less';

const { Option } = Select;

export interface IAbstractPaymentRecordSettingState extends IAbstractFillableComponentState {
    readonly paymentRecord?: IPaymentRecord;
    readonly tableDataSource: [];
    readonly id: number | string;
    readonly loading?: boolean;
}

export interface IPaymentRecord {
    readonly contractId?: string | number;
    readonly name?: string;
    readonly customerName?: string;
    readonly paymentPlanId?: string;
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
    readonly customerId?: string | number;
    readonly period?: string | number;
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
        loading: false
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

    /**
     * @override
     * @description 客户弹窗
     * @returns 
     */
    public onSelect = (selectedRows: DataType[]): void => {
        const paymentRecord: IPaymentRecord | undefined = this.state.paymentRecord;
        if (selectedRows && selectedRows.length > 0) {
            this.setState({
                paymentRecord: {
                    ...(paymentRecord || {}),
                    customerName: selectedRows[0].name,
                    customerId: selectedRows[0].id
                }
            })
            this.getForm()?.setFieldsValue({ customerName: selectedRows[0].name })
        }
    }

    /**
     * @override
     * @description 回款计划弹窗
     * @returns 
     */
    public onPlanSelect = (selectedRows: DataType[] | any): void => {
        const paymentRecord: IPaymentRecord | undefined = this.state.paymentRecord;
        if (selectedRows && selectedRows.length > 0) {
            this.setState({
                paymentRecord: {
                    ...(paymentRecord || {}),
                    paymentPlanId: selectedRows[0].id,
                    returnedTime: selectedRows[0].returnedTime,
                    returnedRate: selectedRows[0].returnedRate,
                    returnedAmount: selectedRows[0].returnedAmount,
                    period: selectedRows[0].period,
                    name: selectedRows[0].name
                },
            })
            this.getForm()?.setFieldsValue({
                paymentPlanId: selectedRows[0].id,
                returnedTime: moment(selectedRows[0].returnedTime),
                returnedRate: selectedRows[0].returnedRate,
                returnedAmount: selectedRows[0].returnedAmount,
                period: selectedRows[0].period,
                name: selectedRows[0].name
            })
        }
    }

    public enterLoading(): void {
        this.setState({
            loading: true
        });
        setTimeout(() => {
            this.setState({
                loading: false
            });
        }, 20000);
    }

    /**
     * @description Gets primary operation button
     * @returns primary operation button
     */
    protected getPrimaryOperationButton(): React.ReactNode {
        return <Button type="primary" htmlType="submit" loading={this.state.loading} style={{
            position: "absolute",
            top: "20px",
            left: "16px",
        }}>保存</Button>
    }

    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        const paymentRecord: IPaymentRecord | undefined = this.state.paymentRecord;
        const params: any = this.props?.match?.params
        return [[{
            title: '回款计划',
            itemCol: {
                span: 6
            },
            itemProps: [{
                label: '关联合同',
                name: 'contractNumber',
                initialValue: params?.contractNumber,
                rules: [{
                    required: true,
                    message: '请选择合同'
                }],
                children:
                    <>
                        <Input value={params?.contractNumber} disabled />
                    </>
            }, {
                label: '合同名称',
                name: 'contractName',
                initialValue: params?.contractName,
                children: (
                    <Input disabled />
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
                        <Input value={paymentRecord?.customerName} suffix={
                            <ClientSelectionComponent onSelect={this.onSelect} selectKey={[paymentRecord?.customerId]} />
                        } />
                    </>
            }, {
                label: '回款计划',
                name: 'period',
                initialValue: paymentRecord?.name,
                rules: [{
                    required: true,
                    message: '请选择回款计划'
                }],
                children:
                    <>
                        <Input value={paymentRecord?.name} suffix={
                            <PaymentPlanSelectionComponent onSelect={this.onPlanSelect} id={this.state.id} selectKey={[paymentRecord?.paymentPlanId]} />
                        } />
                    </>
            }, {
                label: '计划回款日期',
                name: 'returnedTime',
                initialValue: paymentRecord?.returnedTime ? moment(paymentRecord?.returnedTime) : '',
                children: <DatePicker disabled />
            }, {
                label: '计划回款占比',
                name: 'returnedRate',
                initialValue: paymentRecord?.returnedRate,
                children: <Input disabled />
            }, {
                label: '计划回款金额（￥）',
                name: 'returnedAmount',
                initialValue: paymentRecord?.returnedAmount,
                children: <Input disabled />
            }]
        }, {
            title: '回款信息',
            itemCol: {
                span: 6
            },
            itemProps: [{
                label: '来款时间',
                name: 'refundTime',
                initialValue: paymentRecord?.refundTime,
                rules: [{
                    required: true,
                    message: '请选择来款时间'
                }],
                children: <DatePicker showTime />
            }, {
                label: '来款方式',
                name: 'refundMode',
                initialValue: paymentRecord?.refundMode,
                rules: [{
                    required: true,
                    message: '请输入来款方式'
                }],
                children:
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                        {refundModeOptions && refundModeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
            }, {
                label: '来款金额（￥）',
                name: 'refundAmount',
                initialValue: paymentRecord?.refundAmount,
                rules: [{
                    required: true,
                    message: '请输入来款金额'
                }],
                children: <InputNumber min={0} step="0.01" max={999999999999.99} stringMode={false} precision={2} className={layoutStyles.width100} />
            }, {
                label: '币种',
                name: 'currencyType',
                initialValue: paymentRecord?.currencyType,
                rules: [{
                    required: true,
                    message: '请选择币种'
                }],
                children:
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                        {currencyTypeOptions && currencyTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
            }, {
                label: '汇率',
                name: 'exchangeRate',
                initialValue: paymentRecord?.exchangeRate,
                children: <InputNumber min={0} step="0.01" max={999999999999.99} stringMode={false} precision={4} className={layoutStyles.width100} />
            }, {
                label: '外币金额',
                name: 'foreignExchangeAmount',
                initialValue: paymentRecord?.foreignExchangeAmount,
                children: <InputNumber min={0} step="0.01" max={999999999999.99} stringMode={false} precision={2} className={layoutStyles.width100} />
            }, {
                label: '收款银行',
                name: 'refundBank',
                initialValue: paymentRecord?.refundBank,
                children: <Input maxLength={100} />
            }, {
                label: '备注',
                name: 'description',
                initialValue: paymentRecord?.description,
                children: <Input.TextArea showCount={true} maxLength={300} placeholder="请输入备注信息" />
            }]
        }]];
    }
}