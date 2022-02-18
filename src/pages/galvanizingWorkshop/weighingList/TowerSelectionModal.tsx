/**
 * @author zyc
 * @copyright © 2021
 * @description 选择塔型
 */
import { Button, FormItemProps, Input, Modal, Space, TableColumnType } from 'antd';
import Table, { TablePaginationConfig } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';
import styles from './WeighingList.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import AbstractFilteredSelectionModal from '../../../components/AbstractFilteredSelecableModal';
import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from '../../../components/AbstractSelectableModal';

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
                pageSize: 1000,
                total: 0,
                showSizeChanger: false
            },
            confirmTitle: "选择塔型"
        };
    }

    public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-production/galvanized/daily/plan/weighing', {
            ...filterValues,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize || this.state.tablePagination?.pageSize,
        });
        const data = resData.records.filter((res: any) => {
            return this.props.selectKey.indexOf(res.id) === -1
        })
        this.setState({
            ...filterValues,
            tableDataSource: data,
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
            name: 'fuzzyMsg',
            children: <Input style={{ width: '400px' }} placeholder="请输入塔型名称/计划号/内部合同编号/工程名称进行查询" />
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

    public onFilterSubmit = (values: Record<string, any>) => {
        this.getTable(values, {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: false
        });
    }

    /**
     * @description modal内表格 
     */
    protected renderTableContent(): React.ReactNode {
        return (
            <Table
                {...this.getTableProps()}
                rowSelection={{
                    type: "checkbox",
                    selectedRowKeys: this.state.selectedRowKeys,
                    onChange: this.onSelectChange
                }}
                pagination={false}
                scroll={{ x: 1200 }}
                className={styles.modalTable}
            />
        );
    }

    public getTableDataSource(): object[] {
        return this.state.tableDataSource;
    }

    public getTableColumns(): TableColumnType<object>[] {
        return [{
            key: 'internalNumber',
            title: '内部合同编号',
            dataIndex: 'internalNumber'
        }, {
            key: 'planNo',
            title: '计划号',
            dataIndex: 'planNo'
        }, {
            key: 'orderName',
            title: '工程名称',
            dataIndex: 'orderName'
        }, {
            key: 'productCategoryName',
            title: '塔型名称',
            dataIndex: 'productCategoryName'
        }, {
            key: 'voltageGrade',
            title: '电压等级',
            dataIndex: 'voltageGrade'
        }, {
            key: 'productNum',
            title: '总基数',
            dataIndex: 'productNum'
        }];
    }

    public render(): React.ReactNode {
        return (
            <>
                <Button type="primary" onClick={() => {
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
                    {this.renderFilterContent()}
                    {this.renderTableContent()}
                </Modal>
            </>
        );
    }

    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }
}