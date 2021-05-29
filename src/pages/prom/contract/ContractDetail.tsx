/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, ColProps, DatePicker, Form, FormInstance, Input, InputNumber, Select, Table, TableColumnType } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import AbstractDetailComponent from '../../../components/AbstractDetailComponent';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { ITabItem } from '../../../components/ITabableComponent';
import RequestUtil from '../../../utils/RequestUtil';
import SummaryRenderUtil, { IRenderdSummariableItem, IRenderedGrid } from '../../../utils/SummaryRenderUtil';
import styles from './ContractDetail.module.less'
import ClientSelectionComponent from '../../../components/ClientSelectionModal';
import moment from 'moment';
import { DataType } from '../../../components/AbstractModalComponent';
import { IResponseData } from './AbstractContractSetting';

export interface IContractDetailProps {
    readonly id: string;
}
export interface IContractDetailRouteProps extends RouteComponentProps<IContractDetailProps> {}
export interface IContractDetailState {
    readonly detail: IDetail;
    readonly orderData: IOrderItem[];
    readonly editingKey: string;
    readonly selectedRowKeys?: React.Key[] | any,
    readonly selectedRows?: object[] | any,
}

interface IDetail {
    readonly id?: number;
    readonly internalNumber?: string;
    readonly deliveryTime?: string;
    readonly contractNumber?: string;
    readonly projectName?: string;
    readonly simpleProjectName?: string;
    readonly winBidType?: number;
    readonly updateUser?: string;
    readonly updateTime?: string;
    readonly createUser?: string;
    readonly createTime?: string;
    readonly attachVos?: IAttachVos[];
    paymentPlanVos: IPaymentPlanVos[];
}

interface IPaymentPlanVos{
    readonly contractId?: number;
    readonly createTime?: string;
    readonly createUser?: number;
    readonly id?: number;
    readonly isDeleted?: number;
    paymentRecordVos: IPaymentRecordVos[];
    readonly period?: number;
    readonly returnedAmount?: number;
    readonly returnedRate?: number;
    readonly returnedTime?: string;
    readonly status?: number;
    readonly updateTime?: string;
    readonly updateUser?: string; 
    readonly paymentPlanId?: number;
}

interface IPaymentRecordVos{
    readonly key?: React.Key;
    readonly refundTime?: string | moment.Moment;
    readonly customerName?: string;
    readonly customerId?: number;
    readonly refundAmount?: number;
    readonly currencyType?: number;
    readonly exchangeRate?: number;
    readonly foreignExchangeAmount?: number;
    readonly refundBank?: string;
    readonly description?: string;
    readonly refundMode?: number;
    readonly contractId?: number;
    readonly refundNumber?: number;
}

interface IOrderItem {
    readonly taxAmount?: number;
    readonly orderQuantity?: number;
    readonly internalNumber?: string;
    readonly products?: IProducts[];
}

interface IProducts {
    readonly saleOrderId: number;
}

interface IAttachVos {
    readonly name?: string;
    readonly username?: string;
    readonly fileSize?: string;
    readonly description?: string;
    readonly filePath?: string;
    readonly fileSuffix?: string;
    readonly id?: number;
}

interface EditTableColumnType<RecordType> extends TableColumnType<object> {
    readonly editable?: boolean; 
    readonly type?: React.ReactNode;
    readonly title: string;
}

/**
 * Contract detail page component.
 */
class ContractDetail extends AbstractDetailComponent<IContractDetailRouteProps, IContractDetailState> {

    public state: IContractDetailState = {
        detail: {
            paymentPlanVos: []
        },
        orderData: [],
        editingKey: '',
    }

    protected form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    /**
     * @protected
     * @description Gets form
     * @returns form 
     */
    protected getForm(): FormInstance | null {
        return this.form?.current;
    }

    protected getTitle(): string {
        return `${ super.getTitle() }`;
    }

    /**
      * @description Fetchs table data
      * @param filterValues 
      */
    protected async fetchTableData() {
        const resData: IDetail = await RequestUtil.get<IDetail>(`/tower-market/contract/${ this.props.match.params.id }`);
        const orderData: IOrderItem[] = await RequestUtil.get<IOrderItem[]>(`/saleOrder/getSaleOrderDetailsById`, {
            contractId: this.props.match.params.id 
        });
        this.setState({
            detail: resData,
            orderData: orderData,
        });
    }

    public async componentDidMount() {
        this.fetchTableData();
    }
    
    /**
     * @implements
     * @description Gets subinfo col props
     * @returns subinfo col props 
     */
    public getSubinfoColProps (): ColProps[] {
        const detail: IDetail | undefined = this.state?.detail;
        return [{
            span: 8,
            children: (
                <span>内部合同编号：{ detail?.internalNumber }</span>
            )
        }, {
            span: 8,
            children: (
                <span>交货日期：{ detail?.deliveryTime }</span>
            )
        }];
    }

    /**
     * @implements
     * @description Renders operation area
     * @returns operation area 
     */
    public renderOperationArea(): React.ReactNode | React.ReactNode[] {
        return [
            <Button key="new" href="/prom/contract/new">新增</Button>,
            <Button key="setting" href={ `/prom/contract/setting/${ this.props.match.params.id }`}>编辑</Button>,
            <ConfirmableButton key="delete" confirmTitle="要删除该合同吗？" onConfirm={ async () => {
                const resData: IResponseData = await RequestUtil.delete('/tower-market/contract', {id: this.props.match.params.id})
            } }>删除</ConfirmableButton>
        ];
    }

    /**
     * @description Gets base info grid
     * @returns base info grid 
     */
    private getBaseInfoGrid(): IRenderedGrid {
        const detail: IDetail | undefined = this.state?.detail;
        return {
            labelCol: {
                span: 4
            },
            valueCol: {
                span: 8
            },
            rows: [[{
                label: '合同编号',
                value: detail?.contractNumber
            },{
                label: '内部合同编号',
                value: detail?.internalNumber
            }], [{
                label: '工程名称',
                value: detail?.projectName
            }, {
                label: '工程简称',
                value: detail?.simpleProjectName
            }], [{
                label: '中标类型',
                value: detail?.winBidType == 1 ? '国家电网': '南方电网'
            }]]
        };
    }

    /**
     * @description Gets order columns
     * @returns order columns 
     */
    private getOrderColumns(): ColumnsType<object> {
        return [{
            title: '序号',
            dataIndex: 'index'
        }, {
            title: '状态',
            dataIndex: 'productStatus'
        }, {
            title: '线路名称',
            dataIndex: 'lineName'
        }, {
            title: '产品类型',
            dataIndex: 'productType'
        }, {
            title: '塔型',
            dataIndex: 'productShape'
        }, {
            title: '杆塔号',
            dataIndex: 'productNumber'
        }, {
            title: '电压等级（KV）',
            dataIndex: 'voltageGrade'
        }, {
            title: '呼高（米）',
            dataIndex: 'productHeight'
        }, {
            title: '单位',
            dataIndex: 'price'
        }, {
            title: '数量',
            dataIndex: 'num'
        }, {
            title: '单价',
            dataIndex: 'price'
        }, {
            title: '金额',
            dataIndex: 'totalAmount'
        }, {
            title: '标段',
            dataIndex: 'tender'
        }, {
            title: '备注',
            dataIndex: 'description'
        }];
    }

    /**
     * @description Gets sys info grid
     * @returns sys info grid 
     */
    private getSysInfoGrid(): IRenderedGrid {
        const detail: IDetail | undefined = this.state?.detail;
        return {
            labelCol: {
                span: 4
            },
            valueCol: {
                span: 8
            },
            rows: [[{
                label: '最后编辑人',
                value: detail?.updateUser
            },{
                label: '最后编辑时间',
                value: detail?.updateTime
            }], [{
                label: '创建人',
                value: detail?.createUser
            }, {
                label: '创建时间',
                value: detail?.createTime
            }]]
        };
    }

    /**
     * @description Gets order summariable items
     * @returns order summariable items 
     */
    private getOrderSummariableItems(): IRenderdSummariableItem[] {
        const orderData: IOrderItem[] = this.state.orderData;
        return orderData.map<IRenderdSummariableItem>((item: IOrderItem): IRenderdSummariableItem=> {
            return{
                fieldItems: [{
                    label: '订单编号',
                    value: item.internalNumber
                }, {
                    label: '采购订单号',
                    value: item.internalNumber
                }, {
                    label: '订单数量',
                    value: item.orderQuantity
                }, {
                    label: '订单金额',
                    value:  item.taxAmount
                }],
                render: (): React.ReactNode => (
                    <Table rowKey={ record => (record as IProducts).saleOrderId }  dataSource={ item.products } pagination={ false } bordered={ true } columns={ this.getOrderColumns() }/>
                )
            }  
        })  
    }

    /**
     * @override
     * @description 弹窗
     * @returns 
     */
    public handleOk = (selectedRows: DataType[]):void => {
        const detail: IDetail = this.state.detail;
        let paymentPlan: IPaymentPlanVos[] = detail.paymentPlanVos;
        const paymentPlanId: number = parseInt(this.state.editingKey.split("-")[0]);
        const tableIndex: number = parseInt(this.state.editingKey.split("-")[1]);
        if(selectedRows.length > 0 ) {
            paymentPlan = paymentPlan.map<IPaymentPlanVos>((items: IPaymentPlanVos): IPaymentPlanVos=>{
                if(items.id === paymentPlanId) {
                    return {
                        ...items,
                        paymentRecordVos: items.paymentRecordVos.map((item,index) => {
                            if(index === tableIndex ) {
                                return {
                                    ...item,
                                    customerName: selectedRows[0].name
                                }
                            } else {
                                return item
                            }
                        })
                    }
                } else {
                    return items
                }
            })
            detail.paymentPlanVos = [...paymentPlan];
            this.setState({
                detail: {
                    ...detail,
                }
            })
            this.getForm()?.setFieldsValue({ customerName: selectedRows[0].name })
        }
    }

    public getColumns(): TableColumnType<object>[] {
        return [ {
            key: 'name',
            title: '附件名称',
            dataIndex: 'name'
        }, {
            key: 'fileSize',
            title: '文件大小',
            dataIndex: 'fileSize',
        }, {
            key: 'winBidType',
            title: '上传时间',
            dataIndex: 'winBidType',
            render: (productType: number): React.ReactNode => {
                return  productType === 1 ? '国家电网' : '南方电网';
            }
        }, {
            key: 'userName',
            title: '上传人员',
            dataIndex: 'userName'
        },  {
            key: 'description',
            title: '备注',
            dataIndex: 'description'
        }];
    }

    /**
     * @description Gets charging record summariable items
     * @returns charging record summariable items 
     */
     private getChargingRecordSummariableItems(): IRenderdSummariableItem[] {
        const detail: IDetail = this.state.detail;
        let paymentPlan: IPaymentPlanVos[] = detail.paymentPlanVos;
        return paymentPlan.map<IRenderdSummariableItem>((items: IPaymentPlanVos, index: number) : IRenderdSummariableItem => {
            const tableData: IPaymentRecordVos[] = JSON.parse(JSON.stringify(items.paymentRecordVos))
            return {fieldItems: [
                {
                    label: `第${ items.period }期计划 `,
                    value: items.returnedTime
                }, {
                    label: '计划回款占比',
                    value: items.returnedRate
                }, {
                    label: '计划回款金额',
                    value: items.returnedAmount
                }, {
                    label: '已回款金额',
                    value: items.returnedRate
                }, {
                    label: '未回款金额',
                    value: items.returnedRate
                }],
                renderExtraInBar: (): React.ReactNode => (
                    <Button type="primary" onClick={ () => {
                        let paymentRecordVos: IPaymentRecordVos[] = paymentPlan[index].paymentRecordVos;
                        paymentRecordVos.push
                            ({
                                refundTime: "",
                                customerName: "",
                                refundMode: 1,
                                refundAmount: 0,
                                currencyType: 1,
                                exchangeRate: 0,
                                foreignExchangeAmount: 0,
                                refundBank: "",
                                description: "",
                            })
                        this.setState({
                            detail: {
                                paymentPlanVos: [
                                    ...paymentPlan
                                ]
                            }
                        })
                    } }>添加</Button>
                ),
                render: (): React.ReactNode => (
                    <> 
                        <Form ref={ this.form } onFinish={(values: Record<string, any>) => { this.save(values) }}>
                            <Table 
                                rowKey='id' 
                                dataSource={ [...tableData] } 
                                columns={ this.getMergedColumns() } 
                                bordered 
                                pagination={ false }
                                components={{
                                    body: {
                                      cell: this.getEditableCell,
                                    },
                                }}
                            ></Table>
                        </Form>
                    </>
                )
            };
        })
    }

    /**
     * @description Gets charging record columns
     * @returns charging record columns 
     */
    private getChargingRecordColumns(): EditTableColumnType<object>[] {
        return [{
            title: '来款时间',
            dataIndex: 'refundTime',
            editable: true,
            type: <DatePicker />,
        }, {
            title: '来款单位',
            dataIndex: 'customerName',
            editable: true,
            type: <Input suffix={ <ClientSelectionComponent handleOk={ this.handleOk } />} />,
        }, {
            title: '来款方式',
            dataIndex: 'refundMode',
            editable: true,
            type: 
                <Select>
                    <Select.Option value={ 1 }>现金</Select.Option>
                    <Select.Option value={ 2 }>商承</Select.Option>
                    <Select.Option value={ 3 }>银行</Select.Option>
                </Select>,
            render: (refundMode: number): React.ReactNode => {
                return  refundMode === 1 ? '现金' : refundMode === 2 ? '商承' : '银行';
            }
        }, {
            title: '来款金额（￥）',
            dataIndex: 'refundAmount',
            editable: true,
            type: <Input />,
        }, {
            title: '币种',
            dataIndex: 'currencyType',
            editable: true,
            type: 
                <Select>
                    <Select.Option value={ 1 }>RMB人民币</Select.Option>
                    <Select.Option value={ 2 }>USD美元</Select.Option>
                </Select>,
            render: (currencyType: number): React.ReactNode => {
                return  currencyType === 1 ? 'RMB人民币' : 'USD美元';
            }
        }, {
            title: '汇率',
            dataIndex: 'exchangeRate',
            editable: true,
            type: <InputNumber min="0" step="0.01" stringMode={ false } precision={ 2 }/>
        }, {
            title: '外币金额',
            dataIndex: 'foreignExchangeAmount',
            editable: true,
            type: <InputNumber min="0" step="0.01" stringMode={ false } precision={ 2 }/>
        }, {
            title: '收款银行',
            dataIndex: 'refundBank',
            editable: true,
            type: <Input/>
        }, {
            title: '备注',
            dataIndex: 'description',
            editable: true,
            type: <Input.TextArea rows={ 5 } maxLength={ 300 }/>
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record: Record<string, any>,index: number) =>{
                const editable = this.isEditing(record.paymentPlanId+'-'+index);
                return (editable == this.state.editingKey) ? (
                    <>
                        <Button type="link" key="editable"  htmlType="submit" onClick={() => this.save}>保存</Button>
                        <ConfirmableButton confirmTitle="要取消编辑吗？"
                            type="link" placement="topRight"
                            onConfirm={ () => { 
                                this.setState({
                                    editingKey: ''
                                })
                            } }>
                            <Button type="link">取消</Button>
                        </ConfirmableButton>
                    </>
                ) : (
                    <>
                        <Button type="link" key="editable" disabled={this.state.editingKey !== ''} onClick={ () => this.tableRowEdit(record, index) }>编辑</Button>
                        <ConfirmableButton confirmTitle="要删除该条回款计划吗？"
                            type="link" placement="topRight"
                            onConfirm={ async () => { 
                                const data: boolean = await RequestUtil.delete<boolean>(`/tower-market/paymentRecord/${ record.id }`);
                                if(data) {
                                    this.fetchTableData();
                                }
                            } }>
                            <Button type="link">删除</Button>
                        </ConfirmableButton>
                    </>
                )
            }
                
        }];
    }

    /**
     * @description 行编辑
     */
    public tableRowEdit(record: Record<string, any>, index: number): void {
        this.isEditing(record.paymentPlanId+'-'+index)
        this.setState({
            editingKey: record.paymentPlanId+'-'+index
        })
        this.getForm()?.setFieldsValue({
            ...record
        });
    }

     /**
     * @description 行保存
     */
      public async save(values: Record<string, any>): Promise<void> {
        const row = (await this.getForm()?.validateFields()) as IPaymentRecordVos;
        console.log(values, this.getForm()?.getFieldsValue(true))
    }
 
    /**
     * @description 表格获取Columns
     */
    public getMergedColumns(): EditTableColumnType<object>[] {
        return this.getChargingRecordColumns().map<EditTableColumnType<object>>((col: EditTableColumnType<object>): EditTableColumnType<object> => {
            if(!col.editable) {
                return col
            } else {
                return {
                    ...col,
                    onCell: (record: Record<string, any>, index?: number) =>{ return {
                        record,
                        type: col.type,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        editing: this.isEditing(record.paymentPlanId+'-'+index),
                    }}
                }
            }
        })
    }

    /**
     * @description 表格components-body-cell
     */
    public getEditableCell = (records: Record<string, any>) => {
        return ( 
            <td {...records}>
                {(records.editing == this.state.editingKey) ? (
                    <Form.Item
                        name = { records.dataIndex }
                        // initialValue = { (records.dataIndex === "refundTime") ? 
                        //     moment(records.record[records.dataIndex])
                        //     :  records.record[records.dataIndex]
                        // } 
                    > 
                        { records.type }
                    </Form.Item>
                    ) : (
                    <>{ records.children }</>
                )}
            </td>
        );
    }

    /**
     * @description 是否编辑
     */
    public isEditing(key: string) {
        return key
    }

    /**
     * @implements
     * @description Gets tab items
     * @returns tab items 
     */
    public getTabItems(): ITabItem[] {
        return [{
            label: '概况信息',
            key: 1,
            content: SummaryRenderUtil.renderSections([{
                title: '基本信息',
                render: (): React.ReactNode => SummaryRenderUtil.renderGrid(this.getBaseInfoGrid())
            }, {
                title: '订单信息',
                className: styles.orderSection,
                render: (): React.ReactNode => SummaryRenderUtil.renderSummariableAreas(this.getOrderSummariableItems())
            }, {
                title: '系统信息',
                render: (): React.ReactNode => SummaryRenderUtil.renderGrid(this.getSysInfoGrid())
            }])
        }, {
            label: '相关附件',
            key: 2,
            content: SummaryRenderUtil.renderSections([{
                title: '相关附件',
                render: (): React.ReactNode => {
                    const detail = this.state?.detail;
                    const dataSource = detail?.attachVos
                    return (
                        <>
                            <Table rowKey="index" dataSource={ dataSource } columns={ this.getColumns() } />
                        </>
                    )
                }
            }])
        }, {
            label: '回款记录',
            key: 3,
            content: SummaryRenderUtil.renderSections([{
                title: '回款记录',
                render: (): React.ReactNode => SummaryRenderUtil.renderSummariableAreas(this.getChargingRecordSummariableItems())
            }])
        }];
    }
}

export default withRouter(withTranslation()(ContractDetail));