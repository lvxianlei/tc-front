/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, DatePicker, Form, FormInstance, Input, InputNumber, message, Popconfirm, Select, Space, Table, TableColumnType } from 'antd';
import React from 'react';
// import ClientSelectionComponent from '../../../components/ClientSelectionModal';
import ConfirmableButton from '../../../components/ConfirmableButton';
import RequestUtil from '../../../utils/RequestUtil';
import SummaryRenderUtil, { IRenderdSummariableItem } from '../../../utils/SummaryRenderUtil';
import moment from 'moment';
import { DataType } from '../../../components/AbstractSelectableModal';
import styles from './ContractRefundRecord.module.less';
import ClientSelectionComponent from '../../../components/ClientSelectionModal';
import { currencyTypeOptions, refundModeOptions } from '../../../configuration/DictionaryOptions';
import layoutStyles from '../../../layout/Layout.module.less';

export interface IContractRefundRecord {
    readonly paymentPlanVos: IPaymentPlanVo[];
}

export interface IContractRefundRecordProps extends IContractRefundRecord {
    onDeleted?: () => void;
    readonly contractStatus?: number;
}
export interface IContractRefundRecordState extends IContractRefundRecord {
    readonly editingKey?: string;
    readonly isUpdate?: boolean;
    readonly loading?: boolean;
}

interface IPaymentPlanVo {
    readonly contractId?: string | number;
    readonly createTime?: string;
    readonly createUser?: number;
    readonly id?: string;
    readonly isDeleted?: number;
    paymentRecordVos: IPaymentRecordVo[];
    readonly period?: number;
    readonly returnedAmount?: number;
    readonly returnedRate?: number;
    readonly returnedTime?: string;
    readonly status?: number;
    readonly updateTime?: string;
    readonly updateUser?: string; 
    readonly paymentPlanId?: string;
    readonly uncollectedPayment?: number;
    readonly paymentReceived?: number;
}

interface IPaymentRecordVo {
    readonly id?: string | number;
    readonly key?: React.Key;
    readonly refundTime?: string | moment.Moment;
    readonly customerName?: string;
    readonly customerId?: string | number;
    readonly refundAmount?: number;
    readonly currencyType?: number | string;
    readonly exchangeRate?: number;
    readonly foreignExchangeAmount?: number;
    readonly refundBank?: string;
    readonly description?: string;
    readonly refundMode?: number | string;
    readonly contractId?: string | number;
    readonly refundNumber?: number;
    readonly paymentPlanId?: string;
}

interface EditTableColumnType<RecordType> extends TableColumnType<object> {
    readonly editable?: boolean; 
    readonly type?: React.ReactNode;
    readonly title: string;
}

/**
 * The refund recirds in the contract
 */
export default class ContractRefundRecord extends React.Component<IContractRefundRecordProps, IContractRefundRecordState> {
    /**
     * @description Form of contract refund record
     */
    protected form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    // constructor(props: IContractRefundRecordProps) {
    //     super(props);
    //     this.form = form;
    // }

    /**
     * @description State of contract refund record
     */
    public state: IContractRefundRecordState = {
        paymentPlanVos: [],
        editingKey: '',
        isUpdate: false,
        loading: false
    };

    /**
     * @implements
     * @description Gets derived state from props
     * @param props 
     * @param prevState 
     * @returns derived state from props 
     */
    static getDerivedStateFromProps(props: IContractRefundRecordProps, prevState: IContractRefundRecordState): IContractRefundRecordState | null {
        if (!prevState.paymentPlanVos || !prevState.paymentPlanVos.length || prevState.isUpdate) {
            return {
                paymentPlanVos: [ ...(props.paymentPlanVos || []) ]
            }
        }
        return null;
    }

    /**
     * @description Adds record for 1 refund record set
     * @param index 
     * @returns  
     */
    private addRecord(index: number) {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            const paymentPlanVos: IPaymentPlanVo[] = this.state.paymentPlanVos || [];
            const paymentRecordVos: IPaymentRecordVo[] = paymentPlanVos[index].paymentRecordVos;
            paymentRecordVos.push({
                refundTime: undefined,
                customerName: '',
                refundMode: '',
                refundAmount: undefined,
                currencyType: '',
                exchangeRate: undefined,
                foreignExchangeAmount: undefined,
                refundBank: '',
                description: '',
                customerId: '',
                paymentPlanId: this.state.paymentPlanVos[index].id
            });
            this.setState({
                paymentPlanVos: [ ...paymentPlanVos ],
                isUpdate: false
            });
        }
    }

    /**
     * @description Renders extra in bar
     * @param index 
     * @returns extra in bar 
     */
    private renderExtraInBar(index: number): React.ReactNode {
        return (
            <Button type="primary" onClick={ this.addRecord(index) } disabled={ this.props.contractStatus === 0 }>添加</Button>
        );
    }

    /**
     * @description Determines whether editing is
     * @param key 
     * @returns true if editing 
     */
    private isEditing(key: string): boolean {
        return key === this.state.editingKey;
    }

    /**
     * @description Gets form
     * @returns form 
     */
    protected getForm(): FormInstance | null {
        return this.form?.current;
    }

    /**
     * @description Edits row
     * @param record 
     * @param index 
     */
    private editRow(record: Record<string, any>, index: number): React.MouseEventHandler<HTMLButtonElement> {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            e.preventDefault();
            this.setState({
                editingKey: record.paymentPlanId + '-' + index,
                isUpdate: false,
                loading: false
            });
        };
    }

    /**
     * @description Deletes plan
     * @param record 
     * @returns plan 
     */
    private deletePlan(record: Record<string, any>, index: number): (e?: React.MouseEvent<HTMLElement>) => void {       
        return async () => {
            const paymentPlanVos: IPaymentPlanVo[] = (this.state.paymentPlanVos || []);
            const paymentPlanVo: IPaymentPlanVo = paymentPlanVos.filter(item => item.id === record.paymentPlanId)[0];
            let paymentRecordVos: IPaymentRecordVo[] = paymentPlanVo.paymentRecordVos;
            if(record.id) {
                const data: boolean = await RequestUtil.delete<boolean>(`/tower-market/paymentRecord/${ record.id }`);
                if(data && this.props.onDeleted) {
                    this.props.onDeleted();
                    this.setState({
                        isUpdate: true
                    })
                }
                paymentRecordVos.splice(index, 1);
                this.setState({
                    paymentPlanVos: [ ...paymentPlanVos ]
                });
            } else {
                paymentRecordVos.splice(index, 1);
                this.setState({
                    paymentPlanVos: [ ...paymentPlanVos ]
                });
            }
        }
    }

    /**
     * @description Handle ok of contract refund record
     */
    public onSelect = (selectedRows: DataType[]): void => {
        let paymentPlanVos: IPaymentPlanVo[] = this.state.paymentPlanVos || [];
        const keyParts: string [] = (this.state.editingKey || '').split('-');
        const paymentPlanId: string = keyParts[0];
        const record: IPaymentRecordVo = this.getForm()?.getFieldsValue(true);
        const tableIndex: string = keyParts[1];
        if( selectedRows && selectedRows.length > 0 ) {
            paymentPlanVos = paymentPlanVos.map<IPaymentPlanVo>((items: IPaymentPlanVo): IPaymentPlanVo => {
                if(items.id === paymentPlanId) {
                    return {
                        ...items,
                        paymentRecordVos: items.paymentRecordVos.map<IPaymentRecordVo>((item: IPaymentRecordVo, index: number): IPaymentRecordVo => {
                            if(index === Number(tableIndex) ) {
                                return {
                                    ...item,
                                    refundTime: record.refundTime,
                                    refundMode: record.refundMode,
                                    refundAmount: record.refundAmount,
                                    currencyType: record.currencyType,
                                    exchangeRate: record.exchangeRate,
                                    foreignExchangeAmount: record.foreignExchangeAmount,
                                    refundBank: record.refundBank,
                                    description: record.description,
                                    customerName: selectedRows[0].name,
                                    customerId: selectedRows[0].id
                                };
                            } else {
                                return item;
                            }
                        })
                    }
                } else {
                    return items;
                }
            });
            this.setState({
                paymentPlanVos: [ ...paymentPlanVos ]
            });
            this.getForm()?.setFieldsValue({
                customerName: selectedRows[0].name
            });
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
     * @description Saves contract refund record
     * @param values 
     * @returns save 
     */
    public save = async (values: Record<string, any>) => {
        try {
            if(!values.customerName) {
                message.warning('请选择来款单位')
                return Promise.reject(false);
            } else if ( !values.refundTime) {
                message.warning('请选择来款时间')
                return Promise.reject(false);
            } else if ( !values.refundMode) {
                message.warning('请选择来款方式') 
                return Promise.reject(false);
            } else if ( !values.refundAmount) {
                message.warning('请输入来款金额')
                return Promise.reject(false);
            } else if ( !values.currencyType) {
                message.warning('请选择币种')
                return Promise.reject(false);
            } else {
                this.enterLoading();
                const keyParts: string [] = (this.state.editingKey || '').split('-');
                const paymentPlanId: string = keyParts[0];
                const paymentPlanVos: IPaymentPlanVo[] = (this.state.paymentPlanVos || []);
                const paymentPlanVo: IPaymentPlanVo = paymentPlanVos.filter(item => item.id === paymentPlanId)[0];
                let paymentRecordVos: IPaymentRecordVo[] = paymentPlanVo.paymentRecordVos;
                const customerId: string| number | undefined = paymentRecordVos[ values.index as number ].customerId;
                values = {
                    ...values,
                    refundTime: moment(values.refundTime).format('YYYY-MM-DD HH:mm'),
                    customerId: customerId,
                    contractId: paymentPlanVo.contractId,
                    paymentPlanId: paymentPlanVo.id,
                }
                if (values.id) { // edit
                    await RequestUtil.put<boolean>('/tower-market/paymentRecord', values);
                    paymentPlanVo.paymentRecordVos = paymentRecordVos.map<IPaymentRecordVo>((paymentRecordVo: IPaymentRecordVo): IPaymentRecordVo => {
                        if (paymentRecordVo.id === values.id) {
                            return {
                                ...paymentRecordVo,
                                ...values
                            };
                        }
                        return paymentRecordVo;
                    });
                } else { // add a new
                    const newPlan: IPaymentPlanVo = await RequestUtil.post<IPaymentPlanVo>('/tower-market/paymentRecord', values);
                    paymentRecordVos[values.index as number] = newPlan;
                }
                this.setState({
                    paymentPlanVos: [ ...paymentPlanVos ],
                    editingKey: ''
                });
                if(this.props.onDeleted) {
                    this.props.onDeleted();
                    this.setState({
                        isUpdate: true
                    })
                }
            }
        } catch(e) {}   
    }

    /**
     * @description Gets charging record columns
     * @returns charging record columns 
     */
    private getChargingRecordColumns(): EditTableColumnType<object>[] {
        return [{
            title: '* 来款时间',
            dataIndex: 'refundTime',
            editable: true,
            width: 150,
            type: <DatePicker showTime/>
        }, {
            title: '* 来款单位',
            dataIndex: 'customerName',
            editable: true,
            width: 200,
            type: <Input suffix={ <ClientSelectionComponent onSelect={ this.onSelect } />} />
        }, {
            title: '* 来款方式',
            dataIndex: 'refundMode',
            editable: true,
            width: 150,
            type: (
                <Select getPopupContainer={ triggerNode => triggerNode.parentNode }>
                    { refundModeOptions && refundModeOptions.map(({ id, name }, index) => {
                        return <Select.Option key={ index } value={ id }>
                            { name }
                        </Select.Option>
                    }) }
                </Select>
            ),
            render: (refundMode: number | string): React.ReactNode => {
                return refundModeOptions && refundModeOptions.map(({ id, name }, index) => {
                    if(id === refundMode) {
                        return name
                    } else {
                        return ""
                    }
                })
            }
        }, {
            title: '* 来款金额（￥）',
            dataIndex: 'refundAmount',
            editable: true,
            width: 150,
            type: <InputNumber min="0" step="0.01" stringMode={ false } precision={ 2 } className={ layoutStyles.width100 }/>
        }, {
            title: '* 币种',
            dataIndex: 'currencyType',
            editable: true,
            width: 200,
            type: (
                <Select getPopupContainer={ triggerNode => triggerNode.parentNode }>
                    { currencyTypeOptions && currencyTypeOptions.map(({ id, name }, index) => {
                        return <Select.Option key={ index } value={ id }>
                            { name }
                        </Select.Option>
                    }) }
                </Select>
            ),
            render: (currencyType: number | string): React.ReactNode => {
                return  currencyTypeOptions && currencyTypeOptions.map(({ id, name }, index) => {
                    if(id === currencyType) {
                        return name
                    } else {
                        return ""
                    }
                })
            }
        }, {
            title: '汇率',
            dataIndex: 'exchangeRate',
            editable: true,
            width: 150,
            type: <InputNumber min="0" step="0.01" stringMode={ false } precision={ 2 } className={ layoutStyles.width100 }/>,
            render: (exchangeRate: number | string): React.ReactNode => {
                return exchangeRate === -1 ? '' : exchangeRate
            }
        }, {
            title: '外币金额',
            dataIndex: 'foreignExchangeAmount',
            editable: true,
            width: 150,
            type: <InputNumber min="0" step="0.01" stringMode={ false } precision={ 2 } className={ layoutStyles.width100 }/>,
            render: (foreignExchangeAmount: number | string): React.ReactNode => {
                return foreignExchangeAmount === -1 ? '' : foreignExchangeAmount
            }
        }, {
            title: '收款银行',
            dataIndex: 'refundBank',
            editable: true,
            width: 200,
            type: <Input/>
        }, {
            title: '备注',
            dataIndex: 'description',
            editable: true,
            width: 200,
            type: <Input.TextArea rows={ 5 } maxLength={ 300 }/>
        }, {
            title: '操作',
            dataIndex: 'operation',
            width: 200,
            fixed: 'right',
            render: (oper: undefined, record: Record<string, any>, index: number) =>{
                const editing: boolean = this.isEditing(record.paymentPlanId + '-' + index);
                return (
                    editing
                    ?
                    <Space direction="horizontal" size="small">
                        <Button type="link" htmlType="submit" loading={ this.state.loading }>保存</Button>
                        <ConfirmableButton confirmTitle="要取消编辑吗？"
                            type="link" placement="topRight"
                            onConfirm={ () => { 
                                let paymentPlanVos: IPaymentPlanVo[] = this.state.paymentPlanVos || [];
                                const keyParts: string [] = (this.state.editingKey || '').split('-');
                                const paymentPlanId: string = keyParts[0];
                                paymentPlanVos = paymentPlanVos.map<IPaymentPlanVo>((items: IPaymentPlanVo, planIndex: number): IPaymentPlanVo => {
                                    if(items.id === paymentPlanId) {
                                        return {
                                            ...items,
                                            paymentRecordVos: items.paymentRecordVos.map<IPaymentRecordVo>((item: IPaymentRecordVo, ind: number): IPaymentRecordVo => {
                                                if(item.id){
                                                    return {
                                                        ...item,
                                                        customerName: this.props.paymentPlanVos[planIndex].paymentRecordVos[ind].customerName,
                                                        customerId:  this.props.paymentPlanVos[planIndex].paymentRecordVos[ind].customerId
                                                    };
                                                } else {
                                                    return {
                                                        ...item,
                                                        customerName: '',
                                                        customerId: ''
                                                    };
                                                }
                                            })
                                        }
                                    } else {
                                        return items;
                                    }
                                });
                                this.getForm()?.setFieldsValue({
                                    customerName: ''
                                });
                                this.setState({
                                    editingKey: '',
                                    paymentPlanVos: [ ...paymentPlanVos ]
                                })
                            } }>
                            取消
                        </ConfirmableButton>
                    </Space>
                    :
                    <Space direction="horizontal" size="small">
                        <Button type="link" htmlType="button" disabled={ this.state.editingKey !== '' || this.props.contractStatus === 0  } onClick={ this.editRow(record, index) }>编辑</Button>
                        <Popconfirm 
                            title="要删除该条回款计划吗？" 
                            placement="topRight" 
                            okText="确认"
                            cancelText="取消"
                            onConfirm={ this.deletePlan(record, index) } 
                            disabled={ this.props.contractStatus === 0 }
                        >
                            <Button type="link" disabled={ this.props.contractStatus === 0 }>
                                删除
                            </Button>
                        </Popconfirm>
                    </Space>
                )
            }   
        }];
    }

    /**
     * @description Gets merged columns
     * @returns merged columns 
     */
    private getMergedColumns(): EditTableColumnType<object>[] {
        return this.getChargingRecordColumns().map<EditTableColumnType<object>>((col: EditTableColumnType<object>): EditTableColumnType<object> => {
            if(!col.editable) {
                return col
            } else {
                return {
                    ...col,
                    onCell: (record: Record<string, any>, index?: number) => {
                        return {
                            record,
                            type: col.type,
                            dataIndex: col.dataIndex,
                            title: col.title,
                            index: index,
                            editing: this.isEditing( record.paymentPlanId + '-' + index )
                        };
                    }
                }
            }
        })
    }

    /**
     * @description Get editable cell of contract refund record
     */
    private getEditableCell = (recordItem: Record<string, any>) => {
        const {
            editing,
            dataIndex,
            title,
            type,
            record,
            index,
            children,
            ...restProps
        } = recordItem;
        return ( 
            <td { ...restProps }>
                {
                    editing
                    ?
                    <>
                        {
                            dataIndex === 'refundTime'
                            ?
                            <>
                                <Form.Item
                                    name="index"
                                    initialValue={ index }
                                    className={ styles.hidden }
                                >
                                    <Input type="hidden"/>
                                </Form.Item>
                                <Form.Item
                                    name="id"
                                    initialValue={ record.id }
                                    className={ styles.hidden }
                                >
                                    <Input type="hidden"/>
                                </Form.Item>
                            </>
                            :
                            null
                        }
                        <Form.Item
                            name={ dataIndex }
                            initialValue={
                                (dataIndex === 'refundTime')
                                ? 
                                moment(record[dataIndex])
                                :
                                (record[dataIndex] === -1)
                                ?
                                ''
                                :
                                record[dataIndex]
                            } 
                        >
                            { type }
                        </Form.Item>
                    </>
                    :
                    children
                }
            </td>
        );
    }

    /**
     * @description Gets charging record summariable items
     * @returns charging record summariable items 
     */
    private getChargingRecordSummariableItems(): IRenderdSummariableItem[] {
        let paymentPlanVos: IPaymentPlanVo[] = this.state.paymentPlanVos || [];
        return paymentPlanVos.map<IRenderdSummariableItem>((item: IPaymentPlanVo, index: number) : IRenderdSummariableItem => {
            return {
                fieldItems: [{
                    label: `第${ item.period }期计划 `,
                    value: item.returnedTime
                }, {
                    label: '计划回款占比',
                    value: item.returnedRate
                }, {
                    label: '计划回款金额',
                    value: item.returnedAmount
                }, {
                    label: '已回款金额',
                    value: item.paymentReceived
                }, {
                    label: '未回款金额',
                    value: item.uncollectedPayment
                }],
                renderExtraInBar: (): React.ReactNode => this.renderExtraInBar(index),
                render: (): React.ReactNode => (
                    <Form ref={ this.form } key={ Math.random() } onFinish={ this.save } onValuesChange={ (changedValues, allValues) => {
                        this.getForm()?.setFieldsValue({ ...allValues })
                    } }>
                        <Table
                            rowKey="id"
                            dataSource={ [...item.paymentRecordVos] }
                            columns={ this.getMergedColumns() } 
                            bordered={ true }
                            pagination={ false }
                            components={{
                                body: {
                                    cell: this.getEditableCell
                                }
                            }}
                            scroll={{ x: 1500 }}
                        />
                    </Form>
                )
            };
        })
    }

    /**
     * @description Renders section
     * @returns section 
     */
    private renderSection = (): React.ReactNode => {
        return SummaryRenderUtil.renderSummariableAreas(this.getChargingRecordSummariableItems());
    }

    /**
     * @description Renders ContractRefundRecord
     * @returns render 
     */
    public render(): React.ReactNode {
        return SummaryRenderUtil.renderSections([{
            title: '回款记录',
            render: this.renderSection
        }]);
    }
}