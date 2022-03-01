/**
 * @author zyc
 * @copyright © 2021
 */
 import { FormItemProps, Input, Select } from 'antd';
 import { ColumnType, TablePaginationConfig } from 'antd/lib/table';
 import { GetRowKey } from 'rc-table/lib/interface';
 import React from 'react';
 import RequestUtil from '../utils/RequestUtil';
 import AbstractFilteredSelectionModal from './AbstractFilteredSelecableModal';
 import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from './AbstractSelectableModal';
 
 export interface IClientSelectionComponentState extends IAbstractSelectableModalState {
     readonly tableDataSource: IClient[];
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
 export default class ClientSelectionComponent extends AbstractFilteredSelectionModal<IAbstractSelectableModalProps, IClientSelectionComponentState> {
 
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
 
     public componentDidMount(): void {
         this.getTable({})
     }
     
     public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}, flag: boolean = true) {
         const searchValues = flag ? filterValues : {};
         const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-system/employee', {
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
         return [{
             label: "用户姓名",
             name: 'name',
             children: <Input placeholder="请输入用户姓名" />
         }];
     }
 
     public onFilterSubmit = async (values: Record<string, any>) => {
         this.getTable(values, {
             current: 1,
             pageSize: 10,
             total: 0,
             showSizeChanger: false
         });
     }
 
     public getTableDataSource(): object[] {
         return this.state.tableDataSource;
     }
 
 
     public getTableColumns(): ColumnType<object>[] {
         return [{
             key: 'account',
             title: '登录账号',
             dataIndex: 'account'
         }, {
             key: 'name',
             title: '用户姓名',
             dataIndex: 'name'
         }, {
             key: 'userRoleNames',
             title: '所属角色',
             dataIndex: 'userRoleNames'
         }, {
            key: 'departmentName',
            title: '所属机构',
            dataIndex: 'departmentName'
        }];
     }
 
     protected getTableRowKey(): string | GetRowKey<object> {
         return 'id';
     }
 }