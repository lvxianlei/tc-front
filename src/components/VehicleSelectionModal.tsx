/**
 * @author zyc
 * @copyright © 2021
 */
import { Button, FormItemProps, Input, Modal, Space, TableColumnType } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';

import styles from './AbstractSelectableModal.module.less';
import RequestUtil from '../utils/RequestUtil';
import AbstractFilteredSelectionModal from './AbstractFilteredSelecableModal';
import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from './AbstractSelectableModal';

export interface IVehicleSelectionModalProps extends IAbstractSelectableModalProps {
}
export interface IVehicleSelectionModalState extends IAbstractSelectableModalState {
    readonly tableDataSource: IData[];
}

export interface IData {
    readonly id?: string;
    readonly deviceName?: string;
}
/**
 * Vehicle Selection Modal
 */
export default class VehicleSelectionModal extends AbstractFilteredSelectionModal<IVehicleSelectionModalProps, IVehicleSelectionModalState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): IVehicleSelectionModalState {
        return {
            ...super.getState(),
            tablePagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: false
            },
            confirmTitle: "选择车辆"
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
            // tableDataSource: [{ deviceName: '塔型一', id: '1541465465165' }],
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
            name: 'selectName',
            children: <Input placeholder="请输入车辆名称进行搜索" />
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
            title: '车辆名称',
            dataIndex: 'deviceTypeName',
            width: '25%',
        }, {
            key: 'deviceName',
            title: '车辆设备号/车牌号',
            dataIndex: 'deviceName',
            width: '25%',
        }, {
            key: 'spec',
            title: '车辆种类',
            dataIndex: 'spec',
            width: '25%',
        }, {
            key: 'deviceNumber',
            title: '车辆状态',
            dataIndex: 'deviceNumber',
            width: '25%',
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
                }} style={{ padding: '0', lineHeight: 1, height: 'auto' }}>+选择车辆</Button>
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