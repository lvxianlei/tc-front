/**
 * @author zyc
 * @copyright © 2021 zyc
 */
 import { Button, DatePicker, FormItemProps, FormProps, Input, Select, TableColumnType, TablePaginationConfig } from 'antd';
 import React from 'react';
 import { RouteComponentProps } from 'react-router';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

 
 import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../components/AbstractFillableComponent';
import ModalComponent from '../../components/ModalComponent';
import RequestUtil from '../../utils/RequestUtil';
import moment from 'moment';

const { Option } = Select;
 
 export interface IAbstractPaymentRecordSettingState extends IAbstractFillableComponentState {
     name: string;
     selectedRowKeys: React.Key[] | any;
     tablePagination: TablePaginationConfig;
     visible: boolean;
     readonly paymentRecord?: IPaymentRecord;
     selectedRows: object[] | any;
     tableDataSource: [];
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
 }

 export interface DataType{}

 
export interface IResponseData {
    total: number | undefined;
    size: number | undefined;
    current: number | undefined;
    records: [];
 }
 
 /**
  * Abstract paymentRecord Setting
  */
 export default abstract class AbstractPaymentRecordSetting<P extends RouteComponentProps, S extends IAbstractPaymentRecordSettingState> extends AbstractFillableComponent<P, S> {
 
     public state: S = {
        paymentRecord: undefined,
        visible: false,
        tablePagination: {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: false
        },
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
         return '';
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

     protected renderModal (): React.ReactNode {
        return (
            <ModalComponent 
                isModalVisible={ this.state.visible || false } 
                confirmTitle="选择客户" 
                handleOk={ this.okModal} 
                handleCancel={ this.closeModal } 
                columns={this.getTableColumns()} 
                dataSource={this.getTableDataSource()} 
                pagination={this.state.tablePagination}
                onTableChange={this.onTableChange}
                onSelectChange={this.onSelectChange}
                selectedRowKeys={this.state.selectedRowKeys}
                getFilterFormItemProps={this.getFilterFormItemProps()}
                onFilterSubmit={this.onFilterSubmit}
                name={this.state.name}
            />
        );
    }

        /**
     * @override
     * @description 弹窗
     * @returns 
     */
         public showModal = (record: Record<string, any>): void => {
            this.setState({
                visible: true,
                name: record.tip
            })
            this.getTable({})
        }
    
        public closeModal = (): void => {
            this.setState({
                visible: false
            })
        }
    
        public okModal = ():void => {
            const tip: string = this.state.name;
            const paymentRecord: IPaymentRecord | undefined = this.state.paymentRecord;
            const selectValue = this.state.selectedRows;
                if(selectValue.length > 0 ) {
                    this.setState({
                        visible: false,
                        paymentRecord: {
                            ...(paymentRecord || {}),
                            contractId: selectValue[0].contractNumber,
                            customerName: selectValue[0].signCustomerName,
                            name: selectValue[0].projectName,
                        }
                    })
                    this.getForm()?.setFieldsValue({ contractId: selectValue[0].contractNumber, name: selectValue[0].projectName, customerName: selectValue[0].signCustomerName })
                }
            
        }
    
        protected getTable = async (filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) => {
            const resData: IResponseData = await RequestUtil.get<IResponseData>('/customer/contract', {
                ...filterValues,
                current: pagination.current || this.state.tablePagination.current,
                size: pagination.pageSize ||this.state.tablePagination.pageSize
            });
            this.setState({
               ...filterValues,
               tableDataSource: resData.records,
               tablePagination: {
                   ...this.state.tablePagination,
                   current: resData.current,
                   pageSize: resData.size,
                   total: resData.total
               }
            });
        }
    
        public getFilterFormItemProps(): FormItemProps[]  {
            return [{
                    name: 'type',
                    children: 
                    <Select defaultValue="0">
                        <Option value="0" >国内</Option>
                        <Option value="1">国际</Option>
                    </Select>
                },{
                    name: 'name',
                    children: <Input placeholder="工程名称关键字"/>
                }, {
                    name: 'name',
                    children: <Input placeholder="业主单位关键字"/>
                }];
        }
    
        public onFilterSubmit = async (values: Record<string, any>) => {
            this.getTable(values);
        }
    
        public getTableDataSource(): object[]  {
            return this.state.tableDataSource;
        }
    
        public getTableColumns(): TableColumnType<object>[] {
            return [{
                key: 'contractNumber',
                title: '合同编号',
                dataIndex: 'contractNumber'
            }, {
                key: 'projectName',
                title: '工程名称',
                dataIndex: 'projectName'
            }, {
                key: 'saleType',
                title: '销售类型',
                dataIndex: 'saleType',
                render: (saleType: number): React.ReactNode => {
                    return  saleType === 1 ? '国内客户' : '国际客户';
                }
            }, {
                key: 'customerCompany',
                title: '业主单位',
                dataIndex: 'customerCompany'
            }, {
                key: 'signCustomerName',
                title: '合同签订单位',
                dataIndex: 'signCustomerName'
            }, {
                key: 'deliveryTime',
                title: '要求交货日期',
                dataIndex: 'deliveryTime'
            }, {
                key: 'chargeType',
                title: '计价方式',
                dataIndex: 'chargeType',
                render: (type: number): React.ReactNode => {
                    return  type === 1 ? '订单总价、总重计算单价' : '产品单价、基数计算总价';
                }
            }];
        }
    
        public onTableChange = (pagination: TablePaginationConfig): void => {
            this.getTable(pagination);
        }
    
        public onSelectChange = (selectedRowKeys: React.Key[],selectedRows: DataType[]) => {
            this.setState({ 
                selectedRowKeys,
                selectedRows
             });
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
                    <Input value={ paymentRecord?.name } suffix={
                        <Button type="text" target="customerCompany"  onClick={() => this.showModal({tip: "name"})}>
                            <PlusOutlined />
                        </Button>
                    }/>
                    { this.renderModal() }
                 </>
             }, {
                 label: '工程名称',
                 name: 'name',
                 initialValue: paymentRecord?.name,
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
                children: <Input/>
            },  {
                label: '回款计划',
                name: 'name',
                initialValue: paymentRecord?.name,
                rules: [{
                    required: true,
                    message: '请选择回款计划'
                }],
                children: <Input/>
            }, {
                label: '计划回款日期',
                name: 'name',
                initialValue: paymentRecord?.name,
                // children: <DatePicker />
            }, {
                label: '计划回款占比',
                name: 'name',
                initialValue: paymentRecord?.name,
                children: <Input disabled />
            }, {
                label: '计划回款金额（￥）',
                name: 'name',
                initialValue: paymentRecord?.name,
                children: <Input disabled/>
            }]
         }, {
             title: '回款信息',
             itemCol: {
                span: 8
            },
             itemProps: [{
                 label: '编号',
                 name: 'paymentPlanId',
                 initialValue: paymentRecord?.paymentPlanId || GeneratNum,
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