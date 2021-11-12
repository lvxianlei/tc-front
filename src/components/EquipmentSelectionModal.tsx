/**
 * @author zyc
 * @copyright © 2021
 */
import { Button, FormItemProps, Input, Modal, Select, Space, TableColumnType } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';

import styles from './AbstractSelectableModal.module.less';
import RequestUtil from '../utils/RequestUtil';
import AbstractFilteredSelectionModal from './AbstractFilteredSelecableModal';
import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from './AbstractSelectableModal';

export interface IEquipmentSelectionModalProps extends IAbstractSelectableModalProps {
}
export interface IEquipmentSelectionModalState extends IAbstractSelectableModalState {
    readonly tableDataSource: IData[];
    readonly departmentData: [];
}

export interface IData {
    readonly id?: string;
    readonly deviceName?: string;
}
/**
 * Equipment Selection Modal
 */
export default class EquipmentSelectionModal extends AbstractFilteredSelectionModal<IEquipmentSelectionModalProps, IEquipmentSelectionModalState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): IEquipmentSelectionModalState {
        return {
            ...super.getState(),
            tablePagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: false
            },
            confirmTitle: "选择设备"
        };
    }

    public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-equipment/device', {
            ...filterValues,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize || this.state.tablePagination?.pageSize,
        });
        const data = await RequestUtil.get<[]>(`/tower-production/workshopDept/list`);
        this.setState({
            ...filterValues,
            // tableDataSource: [{ deviceName: '塔型一', id: '1541465465165' }],
            tableDataSource: resData.records,
            tablePagination: {
                ...this.state.tablePagination,
                current: resData.current,
                pageSize: resData.size,
                total: resData.total
            },
            departmentData: data
        });
    }

    public getFilterFormItemProps(): FormItemProps[] {
        return [{
            name: 'selectName',
            children: <Input placeholder="请输入设备名称进行搜索" />
        },{
            name: 'useDeptId',
            label: '使用部门',
            children: <Select placeholder="请选择">
                { this.state.departmentData?.map((item: any) => {
                    return <Select.Option key={ item.deptId } value={ item.deptId }>{ item.deptName }</Select.Option>
                }) }
            </Select>

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
            title: '设备类别',
            dataIndex: 'deviceTypeName',
            width: '15%',
        }, {
            key: 'deviceName',
            title: '设备名称',
            dataIndex: 'deviceName',
            width: '15%',
        }, {
            key: 'spec',
            title: '型号规格',
            dataIndex: 'spec',
            width: '15%',
        }, {
            key: 'deviceNumber',
            title: '设备编码',
            dataIndex: 'deviceNumber',
            width: '15%',
        }, {
            key: 'useDeptName',
            title: '使用部门',
            dataIndex: 'useDeptName',
            width: '15%',
        }, {
            key: 'usePlace',
            title: '使用场所',
            dataIndex: 'usePlace',
            width: '15%',
        }, {
            key: 'operatingStatus',
            title: '设备状态',
            dataIndex: 'operatingStatus',
            width: '15%',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 0:
                        return '完好';
                    case 1:
                        return '闲置';
                    case 2:
                        return '停用';
                    case 3:
                        return '报废';
                    case 4:
                        return '已变卖';
                }
            }  
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
                }} style={{ padding: '0', lineHeight: 1, height: 'auto' }}>+关联设备</Button>
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