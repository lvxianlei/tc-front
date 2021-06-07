/**
 * @author lxy
 * @copyright © 2021
 */
import { Button, FormItemProps, Input, Modal, Select, Space } from 'antd';
import Table, { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';

import RequestUtil from '../utils/RequestUtil';
import AbstractFilteredSelectionModal from './AbstractFilteredSelecableModal';
import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from './AbstractSelectableModal';
import styles from './AbstractSelectableModal.module.less';

 
 const { Option } = Select;
 
 export interface IOrderSelectionComponentState extends IAbstractSelectableModalState {
     readonly tableDataSource: IOrder[];
 }
 export interface IOrderSelectionComponentProps extends IAbstractSelectableModalProps {
    readonly saleOrderId?: string | number;
 }
 
 export interface IResponseDataMore extends IResponseData {
    readonly productVos: [];
 }
 export interface IOrder {
    readonly description: string;
    readonly lineName: string	;
    readonly num:number;
    readonly price: number;
    readonly productHeight: number;
    readonly productNumber: string;
    readonly productShape: string;
    readonly productStatus: number;
    readonly productType: number;
    readonly saleOrderId: number;
    readonly taskNoticeId: string;	
    readonly tender: string;
    readonly totalAmount:number;
    readonly unit: string;
    readonly voltageGrade: number;
 }
 
 /**
  * Order Selection Component
  */
 export default class OrderSelectionComponent extends AbstractFilteredSelectionModal<IOrderSelectionComponentProps, IOrderSelectionComponentState> {
 
     /**
      * @override
      * @description Gets state
      * @returns state 
      */
     protected getState(): IOrderSelectionComponentState {
         return {
             ...super.getState(),
             tablePagination: {
                 current: 1,
                 pageSize: 10,
                 total: 0,
                 showSizeChanger: false
             },
             confirmTitle: "选择明细"
         };
     }

     //componentDidMount
     public componentDidMount(): void {
         this.getTable({})
     }

     //接口、获值
     public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
         const resData: IResponseDataMore = await RequestUtil.get<IResponseDataMore>(`/tower-market/saleOrder/${this.props.saleOrderId}`);
         this.setState({
             ...filterValues,
             tableDataSource: resData.productVos,
         });
     }
    
     //查询字段
     public getFilterFormItemProps(): FormItemProps[]  {
         return [{
                 name: 'lineName',
                 children: <Input placeholder="线路名称关键字"/>
             }];
     }
 
     //查询
     public onFilterSubmit = async (values: Record<string, any>) => {
         this.getTable(values);
     }
     //dataSource
     public getTableDataSource(): object[]  {
         return this.state.tableDataSource;
     }
 
     //table-column
     public getTableColumns(): ColumnType<object>[] {
         return [
            { 
                title: '线路名称', 
                dataIndex: 'lineName', 
                key: 'lineName' 
            },
            { 
                title: '产品类型', 
                dataIndex: 'productType', 
                key: 'productType' 
            },
            { 
                title: '塔型', 
                dataIndex: 'productShape', 
                key: 'productShape' 
            },
            { 
                title: '杆塔号', 
                dataIndex: 'productNumber', 
                key: 'productNumber' 
            },
            { 
                title: '电压等级', 
                dataIndex: 'voltageGradeName', 
                key: 'voltageGradeName' 
            },
            { 
                title: '呼高（米）',
                dataIndex: 'productHeight', 
                key: 'productHeight' 
            },
            { 
                title: '重量（吨）', 
                dataIndex: 'num', 
                key: 'num' 
            },
            { 
                title: '单价', 
                dataIndex: 'price', 
                key: 'price' 
            },
            { 
                title: '标段', 
                dataIndex: 'tender', 
                key: 'tender' 
            },
            { 
                title: '备注', 
                dataIndex: 'description', 
                key: 'description' 
            },
        ];
     }
  
     //row-key
     protected getTableRowKey(): string | GetRowKey<object> {
         return 'id';
     }

     public render(): React.ReactNode {
        return (
            <>
                <Button  type="primary" onClick={this.showModal}>新增</Button>
                <Modal 
                    title={ this.state.confirmTitle } 
                    visible={this.state.isModalVisible} 
                    okText={ this.state.okText }
                    cancelText={ this.state.cancelText }
                    onOk={ 
                        () => {
                            this.setState ({
                                isModalVisible: false
                            })
                           { this.props.onSelect(this.state.selectedRows) }
                        }
                    } 
                    onCancel={this.handleCancel}
                    width="80%"
                >
                    <Space direction="vertical" className={ styles.modalTable }>
                        {this.renderTableContent()}  
                    </Space> 
                </Modal>  
            </>
        );
    }
 }