/**
 * @author zyc
 * @copyright © 2021
 */
import { Button, Card, Form, FormItemProps, Input, Select, Space, TableColumnType, Tabs, TabsProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import { GetRowKey } from 'rc-table/lib/interface';
import Table, { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import styles from './PromModalComponent.module.less'
import AbstractModalComponent, {IAbstractModalComponentProps, IAbstractModalComponentState, IResponseData } from './AbstractModalComponent'
import RequestUtil from '../utils/RequestUtil';

const { Option } = Select;

export interface IContractSelectionComponentState extends IAbstractModalComponentState {
    readonly tableDataSource: [];
    readonly selectedRowKeys: React.Key[] | any,
    readonly selectedRows: object[] | any,
}


export interface DataType{}
/**
 * Contract Selection Component
 */
export default abstract class ContractSelectionComponent<P extends IAbstractModalComponentProps, S  extends IContractSelectionComponentState> extends AbstractModalComponent<P, IContractSelectionComponentState> {
    /**
     * @description Renders AbstractTabableComponent
     * @returns render 
     */
    public state:S = {
        tablePagination: {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: false
        }
    } as S

    public showModal =  (): void => {
        this.setState({
            isModalVisible: true,
        })
    }

    public componentDidMount(): void {
        this.getTable({})
    }
    
    protected async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-customer/customer/page', {
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
                children: <Input placeholder="客户名字关键字"/>
            }];
    }

    public onFilterSubmit = async (values: Record<string, any>) => {
        this.getTable(values);
    }

    public getTableDataSource(): object[]  {
        return this.state.tableDataSource;
    }


    public getTableColumns(): ColumnType<object>[] {
        return [{
            key: 'type',
            title: '客户类型',
            dataIndex: 'type',
            render: (type: number): React.ReactNode => {
                return  type === 1 ? '国内客户' : '国际客户';
            }
        }, {
            key: 'name',
            title: '客户名称',
            dataIndex: 'name'
        }, {
            key: 'linkman',
            title: '首要联系人',
            dataIndex: 'linkman'
        }, {
            key: 'phone',
            title: '联系电话',
            dataIndex: 'phone'
        }];
    }

    public onTableChange = (pagination: TablePaginationConfig): void => {
        this.getTable(pagination);
    }
      
    public render(): React.ReactNode {
        return (
            <>
                { super.render() }
            </> 
               
        );
    }

    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }
}