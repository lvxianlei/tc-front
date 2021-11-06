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
import { saleTypeOptions } from '../configuration/DictionaryOptions';

const { Option } = Select;
export interface IEquipmentSelectionModalProps extends IAbstractSelectableModalProps {
    readonly status?: number;
    readonly projectId?: string;
}
export interface IEquipmentSelectionModalState extends IAbstractSelectableModalState {
    readonly tableDataSource: [];
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

    public showModal = (): void => {
        this.setState({
            isModalVisible: true,
        })
    }

    public componentDidMount(): void {
        this.getTable({})
    }

    public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-market/contract', {
            ...filterValues,
            projectId: this.props.projectId,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize || this.state.tablePagination?.pageSize,
            status: this.props.status
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
            name: 'projectName',
            children: <Input placeholder="请输入设备名称进行搜索" />
        },{
            name: 'saleType',
            label: '使用部门',
            children:
                <Select placeholder="请选择销售类型" className={styles.select_width} getPopupContainer={triggerNode => triggerNode.parentNode}>
                    {saleTypeOptions && saleTypeOptions.map(({ id, name }, index) => {
                        return <Option key={index} value={id}>
                            {name}
                        </Option>
                    })}
                </Select>

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

    public getTableColumns(): TableColumnType<object>[] {
        return [{
            key: 'contractNumber',
            title: '设备类别',
            dataIndex: 'contractNumber',
            width: '15%',
        }, {
            key: 'contractName',
            title: '设备名称',
            dataIndex: 'contractName',
            width: '15%',
        }, {
            key: 'saleType',
            title: '型号规格',
            dataIndex: 'saleType',
            width: '15%',
        }, {
            key: 'customerCompany',
            title: '设备编码',
            dataIndex: 'customerCompany',
            width: '15%',
        }, {
            key: 'signCustomerName',
            title: '使用部门',
            dataIndex: 'signCustomerName',
            width: '15%',
        }, {
            key: 'deliveryTime',
            title: '使用场所',
            dataIndex: 'deliveryTime',
            width: '15%',
        }, {
            key: 'deliveryTime',
            title: '设别状态',
            dataIndex: 'deliveryTime',
            width: '15%',
        }];
    }

    public render(): React.ReactNode {
        return (
            <>
                <Button type="link" onClick={()=>{
                    this.setState({
                        isModalVisible: true
                    })
                }}>+关联设备</Button>
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