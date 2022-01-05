/**
 * @author zyc
 * @copyright © 2021
 * @description 选择班组
 */
import { Button, FormItemProps, Input, Modal, Select, Space, TableColumnType } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';

import styles from './AbstractSelectableModal.module.less';
import RequestUtil from '../utils/RequestUtil';
import AbstractFilteredSelectionModal from './AbstractFilteredSelecableModal';
import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from './AbstractSelectableModal';

export interface ITeamSelectionModalProps extends IAbstractSelectableModalProps {
}
export interface ITeamSelectionModalState extends IAbstractSelectableModalState {
    readonly tableDataSource: IData[];
}

export interface IData {
    readonly id?: string;
    readonly deviceName?: string;
}
/**
 * Team Selection Modal
 */
export default class TeamSelectionModal extends AbstractFilteredSelectionModal<ITeamSelectionModalProps, ITeamSelectionModalState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): ITeamSelectionModalState {
        return {
            ...super.getState(),
            tablePagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: false
            },
            confirmTitle: "选择班组"
        };
    }

    public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-production/team/page', {
            ...filterValues,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize || this.state.tablePagination?.pageSize,
        });
        this.setState({
            ...filterValues,
            tableDataSource: resData.records,
            tablePagination: {
                ...this.state.tablePagination,
                current: resData.current,
                pageSize: resData.size,
                total: resData.total
            },
        });
    }

    public getFilterFormItemProps(): FormItemProps[] {
        return [{
            name: 'name',
            children: <Input placeholder="请输入班组名称进行查询" />
        }];
    }
    
    /**
     * @description 取消操作 
     * @param event 
     */
    public handleCancel = (): void => {
        this.setState({
            isModalVisible: false,
            selectedRowKeys: []
        })
        this.getForm()?.resetFields();
    };

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

    public getTableColumns(): TableColumnType<object>[] {
        return [{
            key: 'name',
            title: '班组名称',
            dataIndex: 'name'
        }, {
            key: 'productUnitName',
            title: '所属生产单元',
            dataIndex: 'productUnitName'
        }];
    }

    public render(): React.ReactNode {
        return (
            <>
                <Button type="link" onClick={()=>{
                    this.getTable({});
                    this.setState({
                        isModalVisible: true
                    })
                }} style={{ padding: '0', lineHeight: 1, height: 'auto' }}>+选择班组</Button>
                <Modal
                    title={this.state.confirmTitle}
                    visible={this.state.isModalVisible}
                    okText={this.state.okText}
                    cancelText={this.state.cancelText}
                    onOk={
                        () => {
                            this.setState({
                                isModalVisible: false
                            })
                            if (this.state.tableDataSource.length > 0) {
                                this.setState({
                                    selectedRowKeys: []
                                })
                                this.getForm()?.resetFields();
                                this.props.onSelect(this.state.selectedRows)
                            }
                        }
                    }
                    onCancel={this.handleCancel}
                    width="40%"
                >
                    <Space direction="vertical" className={styles.modalTable}>
                        {this.renderTableContent()}
                    </Space>
                </Modal>
            </>
        );
    }

    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }
}