/**
 * @author zyc
 * @copyright © 2021
 */
import { FormItemProps, Input, Select } from 'antd';
import { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';

import styles from './AbstractSelectableModal.module.less';
import RequestUtil from '../utils/RequestUtil';
import AbstractFilteredSelectionModal from './AbstractFilteredSelecableModal';
import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from './AbstractSelectableModal';
import { clientTypeOptions } from '../configuration/DictionaryOptions';

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
            },
            confirmTitle: this.props.id === "1" ? "选择业主单位" : "选择签订单位"
        };
    }

    public componentDidMount(): void {
        this.getTable({})
    }
    
    public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}, flag: boolean = true) {
        const searchValues = flag ? filterValues : {};
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-market/customer', {
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
            name: 'type',
            children:
                <Select placeholder="请选择客户类型" className={styles.select_width}>
                    {clientTypeOptions && clientTypeOptions.map(({ id, name }, index) => {
                        return <Select.Option key={index} value={id}>
                            {name}
                        </Select.Option>
                    })}
                </Select>
        }, {
            name: 'name',
            children: <Input placeholder="客户名字关键字" />
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
            key: 'type',
            title: '客户类型',
            width: '25%',
            dataIndex: 'type',
            render: (type: number | string): React.ReactNode => {
                return clientTypeOptions && clientTypeOptions.map(({ id, name }, index) => {
                    if (id === type) {
                        return name
                    } else {
                        return ""
                    }
                })
            }
        }, {
            key: 'name',
            title: '客户名称',
            width: '25%',
            dataIndex: 'name'
        }, {
            key: 'linkman',
            title: '首要联系人',
            width: '25%',
            dataIndex: 'linkman'
        }, {
            key: 'phone',
            title: '联系电话',
            width: '25%',
            dataIndex: 'phone'
        }];
    }

    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }
}