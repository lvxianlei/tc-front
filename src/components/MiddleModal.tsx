/**
 * @author lxy
 * @copyright © 2022
 */
 import { Button, FormItemProps, Input, message, Modal, Select, Space } from 'antd';
 import { ColumnType, TablePaginationConfig, TableProps } from 'antd/lib/table';
 import { GetRowKey } from 'rc-table/lib/interface';
 import React from 'react';
 import RequestUtil from '../utils/RequestUtil';
 import styles from './AbstractSelectableModal.module.less';
 import AbstractFilteredSelectionModal from './AbstractFilteredSelecableModal';
 import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from './AbstractSelectableModal';
 
 export interface IClientSelectionComponentState extends IAbstractSelectableModalState {
     readonly tableDataSource: IClient[];
 }
 export interface IProps extends IAbstractSelectableModalProps{
    readonly projectId: string;
 }
 
 export interface IClient {
     readonly id: number;
     readonly tenantId: number;
     readonly name: string;
     readonly type: number;
     readonly linkman: string;
     readonly phone: string;
     readonly description: string;
     readonly createTime: string;
     readonly length: number;
 }
 
 /**
  * Client Selection Component
  */
 export default class ClientSelectionComponent extends AbstractFilteredSelectionModal<IProps, IClientSelectionComponentState> {
 
     /**
      * @override
      * @description Gets state
      * @returns state 
      */
     protected getState(): IClientSelectionComponentState {
         return {
             ...super.getState(),
             tablePagination: {
                 current: 1,
                 pageSize: 10,
                 total: 0,
                 showSizeChanger: false
             }
         };
     }
 

     
     public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}, flag: boolean = true) {
         const searchValues = flag ? filterValues : {};
         const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-market/bidBase/partBidNumber', {
             id: this.props.projectId,
             ...searchValues,
             current: pagination.current || this.state.tablePagination.current,
             size: pagination.pageSize || this.state.tablePagination.pageSize
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
 
     public getFilterFormItemProps(): FormItemProps[] {
         return [];
     }
 
     public onFilterSubmit = async (values: Record<string, any>) => {
         this.getTable(values, {
             current: 1,
             pageSize: 10,
             total: 0,
             showSizeChanger: false
         });
     }
      /**
     * @description 弹窗列表过滤
     */
    protected renderFilterContent(): React.ReactNode {
        return (
            <></>
        );
    }
 
     public getTableDataSource(): object[] {
         return this.state.tableDataSource;
     }
     public getTableProps(): TableProps<object> {
        return {
            rowKey: this.getTableRowKey(),
            bordered: true,
            dataSource: this.getTableDataSource(),
            columns: this.getTableColumns(),
            size: "small",
            rowSelection: {
                type: "radio",
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.onSelectChange
            },
            // scroll: { x: 1200 }
        }
    }
 
     public getTableColumns(): ColumnType<object>[] {
         return [{
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: '5%',
            render: (_a: any, _b: any, index: number): React.ReactNode => {
                return (
                    <span>
                        {index + 1}
                    </span>
                )
            }
        },{
             key: 'bidCode',
             title: '分标编号',
             dataIndex: 'bidCode',
             width: '20%',
         }, {
             key: 'packageCode',
             title: '中标包名称',
             dataIndex: 'packageCode',
             width: '20%',
         }, {
             key: 'weight',
             title: '中标重量',
             dataIndex: 'weight',
             width: '20%',
         }, {
            key: 'bidFrameNumber',
            title: '中标套数',
            dataIndex: 'bidFrameNumber',
            width: '15%',
        }, {
            key: 'unitPrice',
            title: '平均单价（元）',
            dataIndex: 'unitPrice',
            width: '20%',
        }];
     }
 
     protected getTableRowKey(): string | GetRowKey<object> {
         return 'id';
     }

     public render(): React.ReactNode {
        return (
            <>
                <Button type='link'  onClick={()=>{
                    this.getTable({})
                    this.setState({
                        isModalVisible: true
                    })
                }}>关联中标</Button>
                <Modal
                    title={this.state.confirmTitle}
                    visible={this.state.isModalVisible}
                    okText={this.state.okText}
                    cancelText={this.state.cancelText}
                    onOk={
                        () => {
                            if(!(this.state?.selectedRowKeys&&this.state?.selectedRowKeys.length>0)){
                                return message.error('未选择关联中标！')
                            }
                            else if (this.state.tableDataSource.length > 0) {
                               
                                this.getForm()?.resetFields();
                                this.props.onSelect(this.state.selectedRows)
                                this.setState({
                                    selectedRowKeys: [],
                                    selectedRows:[],
                                    isModalVisible: false,
                                })
                            }
                        }
                    }
                    onCancel={this.handleCancel}
                    width="75%"
                >
                    <Space direction="vertical" className={styles.modalTable}>
                        {this.renderTableContent()}
                    </Space>
                </Modal>
            </>
        );
    }
 }