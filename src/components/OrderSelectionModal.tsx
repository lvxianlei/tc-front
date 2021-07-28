/**
 * @author lxy
 * @copyright © 2021
 */
import { FormItemProps, Input, Select } from 'antd';
import Table, { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';
import styles from './AbstractSelectableModal.module.less';
import RequestUtil from '../utils/RequestUtil';
import AbstractFilteredSelectionModal from './AbstractFilteredSelecableModal';
import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from './AbstractSelectableModal';

 
 
 const { Option } = Select;
 
 export interface IOrderSelectionComponentState extends IAbstractSelectableModalState {
     readonly tableDataSource: IOrder[];
 }
 
 export interface IOrder {
     readonly chargeType: number;	
     readonly customerCompany: string;	
     readonly deliveryTime: string;	
     readonly id: number;	
     readonly internalNumber: string;	
     readonly orderDeliveryTime: string;
     readonly projectName: string;
     readonly saleOrderNumber: string;
     readonly signCustomerName: string;
 }
 
 /**
  * Order Selection Component
  */
 export default class OrderSelectionComponent extends AbstractFilteredSelectionModal<IAbstractSelectableModalProps, IOrderSelectionComponentState> {
 
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
             confirmTitle: "选择订单"
         };
     }
     
     //componentDidMount
     public componentDidMount(): void {
         this.getTable({})
     }
     //接口、获值
     public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
         const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-market/saleOrder', {
             ...filterValues,
             current: pagination.current || this.state.tablePagination.current,
             size: pagination.pageSize ||this.state.tablePagination.pageSize
         });
         if(resData?.records?.length == 0 && resData?.current && resData?.current>1){
            this.getTable({
                ...filterValues,
            },{
                current: resData.current - 1,
                pageSize: 10,
                total: 0,
            });
        }
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
     //查询字段
     public getFilterFormItemProps(): FormItemProps[]  {
         return [
            //  {
            //     name: 'type',
            //     children: 
            //     <Select placeholder="请选择业务类型" className={ styles.select_width }>
            //         <Option value="0" >国内业务</Option>
            //         <Option value="1">国际业务</Option>
            //     </Select>
            // },
             {
                name: 'projectName',
                children: <Input placeholder="工程名称关键字"/>
             },{
                name: 'customerCompany',
                children: <Input placeholder="业主单位关键字"/>
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
                key: 'saleOrderNumber',
                title: '订单编号',
                dataIndex: 'saleOrderNumber',
            },  {
                key: 'internalNumber',
                title: '合同编号',
                dataIndex: 'internalNumber',
            },  {
                key: 'projectName',
                title: '工程名称',
                dataIndex: 'projectName',
            },  
            // {
            //     key: 'saleTypeName',
            //     title: '销售类型',
            //     dataIndex: 'saleTypeName',
            // }, 
            {
                key: 'customerCompany',
                title: '业主单位',
                dataIndex: 'customerCompany',
            },  {
                key: 'signCustomerName',
                title: '合同签订单位',
                dataIndex: 'signCustomerName'
            },  {
                key: 'deliveryTime',
                title: '合同交货日期',
                dataIndex: 'deliveryTime'
            },  {
                key: 'orderDeliveryTime',
                title: '订单交货日期',
                dataIndex: 'orderDeliveryTime',
            }
        ];
     }
     //row-key
     protected getTableRowKey(): string | GetRowKey<object> {
         return 'id';
     }
 }