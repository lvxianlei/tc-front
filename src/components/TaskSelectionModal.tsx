/**
 * @author lxy
 * @copyright © 2021
 */
import React from 'react';
import { FormItemProps, Input } from 'antd';
import { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import RequestUtil from '../utils/RequestUtil';
import AbstractFilteredSelectionModal from './AbstractFilteredSelecableModal';
import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from './AbstractSelectableModal';

export interface ITaskSelectionComponentState extends IAbstractSelectableModalState {
    readonly tableDataSource: ITask[];
}

export interface ITask {
    readonly id: string;
    readonly internalNumber: string;
    readonly projectName: number;
    readonly taskNumber: string;
}

/**
 * Task Selection Component
 */
export default class TaskSelectionComponent extends AbstractFilteredSelectionModal<IAbstractSelectableModalProps, ITaskSelectionComponentState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): ITaskSelectionComponentState {
        return {
            ...super.getState(),
            tablePagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: false
            },
            confirmTitle: "选择任务单"
        };
    }

    public componentDidMount(): void {
        this.getTable({})
    }

    public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-market/taskNotice', {
            ...filterValues,
            taskReviewStatus: 1,
            current: pagination.current || this.state.tablePagination.current,
            size: pagination.pageSize || this.state.tablePagination.pageSize
        });
        if (resData?.records?.length === 0 && resData?.current && resData?.current > 1) {
            this.getTable({
                ...filterValues,
            }, {
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

    public getFilterFormItemProps(): FormItemProps[] {
        return [{
            name: 'internalNumber',
            children: <Input placeholder="内部合同编号关键字" />
        }, {
            name: 'projectName',
            children: <Input placeholder="工程名称关键字" />
        }, {
            name: 'taskNumber',
            children: <Input placeholder="任务单编号关键字" />
        }];
    }

    public onFilterSubmit = async (values: Record<string, any>) => {
        this.getTable(values);
    }

    public getTableDataSource(): object[] {
        return this.state.tableDataSource;
    }

    public getTableColumns(): ColumnType<object>[] {
        return [{
            key: 'internalNumber',
            title: '内部合同编号',
            dataIndex: 'internalNumber',
        }, {
            key: 'projectName',
            title: '工程名称',
            dataIndex: 'projectName'
        }, {
            key: 'taskNumber',
            title: '任务单编号',
            dataIndex: 'taskNumber'
        }];
    }

    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }
}