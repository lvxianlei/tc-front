/**
 * @author zyc
 * @copyright © 2021
 * @description 选择塔型
 */
import { Button, FormItemProps, Input, Modal, Space, TableColumnType } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';

import styles from '../../components/AbstractSelectableModal.module.less';
import RequestUtil from '../../utils/RequestUtil';
import AbstractFilteredSelectionModal from '../../components/AbstractFilteredSelecableModal';
import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from '../../components/AbstractSelectableModal';

export interface ITowerSelectionModalProps extends IAbstractSelectableModalProps {
}
export interface ITowerSelectionModalState extends IAbstractSelectableModalState {
    readonly tableDataSource: IData[];
}

export interface IData {
    readonly id?: string;
}
/**
 * Team Selection Modal
 */
export default class TowerSelectionModal extends AbstractFilteredSelectionModal<ITowerSelectionModalProps, ITowerSelectionModalState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): ITowerSelectionModalState {
        return {
            ...super.getState(),
            tablePagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: false
            },
            confirmTitle: "选择塔型"
        };
    }

    public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-equipment/device', {
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
            name: 'selectName',
            children: <Input placeholder="请输入塔型名称/计划号/内部合同编号/工程名称进行查询" />
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
            key: 'deviceTypeName',
            title: '内部合同编号',
            dataIndex: 'deviceTypeName',
            width: '20%',
        }, {
            key: 'deviceName',
            title: '计划号',
            dataIndex: 'deviceName',
            width: '20%',
        }, {
            key: 'spec',
            title: '工程名称',
            dataIndex: 'spec',
            width: '20%',
        }, {
            key: 'deviceNumber',
            title: '塔型名称',
            dataIndex: 'deviceNumber',
            width: '20%',
        }, {
            key: 'deviceNumber',
            title: '电压等级',
            dataIndex: 'deviceNumber',
            width: '20%',
        }, {
            key: 'deviceNumber',
            title: '总基数',
            dataIndex: 'deviceNumber',
            width: '20%',
        }];
    }

    public render(): React.ReactNode {
        return (
            <>
                <Button type="primary" onClick={()=>{
                    this.getTable({});
                    this.setState({
                        isModalVisible: true
                    })
                }} style={{ marginBottom: '10px' }}>新增塔型</Button>
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
                    width="80%"
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