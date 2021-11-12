import { Modal, Table } from 'antd';
import { ColumnType, TablePaginationConfig, TableProps } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';

import styles from './AbstractSelectableModal.module.less';
import PopModalButton from './PopModalButton';

export interface IAbstractSelectableModalProps {
    readonly onSelect: (selectedRows: DataType[]) => void;
    readonly id?: number | string;
    readonly selectKey?: React.Key[] | any;
}

export interface IAbstractSelectableModalState {
    readonly isModalVisible: boolean,
    readonly confirmTitle: string,
    readonly okText?: string,
    readonly cancelText?: string;
    readonly tablePagination: TablePaginationConfig;
    readonly selectedRowKeys: React.Key[] | any,
    readonly selectedRows: object[] | any,
}

export interface DataType {
    readonly linkman?: string;
    readonly name?: string;
    readonly id?: number | string;
    readonly type?: number;
    readonly phone?: string;
    readonly signCustomerId?: number;
    readonly projectName?: string;
    readonly contractNumber?: string;
    readonly signCustomerName?: string;
    readonly saleType?: number;
    readonly customerCompany?: string;
    readonly deliveryTime?: string;
    readonly chargeType?: number;
    readonly returnedAmount?: number;
    readonly returnedRate?: number;
    readonly returnedTime?: string;
    readonly period?: number;
    readonly description?: string;
    readonly payCompanyName?: string;
    readonly keeperName?: string;
    readonly keeperUserId?: string | number;
    readonly stationName?: string;
    readonly userId?: string | number;
}

export interface IResponseData {
    readonly total: number | undefined;
    readonly size: number | undefined;
    readonly current: number | undefined;
    readonly parentCode: string;
    readonly records: [];
    readonly paymentPlanVos: [];
}

export default abstract class AbstractSelectionModal<P extends IAbstractSelectableModalProps, S extends IAbstractSelectableModalState> extends React.Component<P, S> {

    /**
     * @constructor
     * Creates an instance of AbstractSelectableModal.
     * @param props 
     */
    constructor(props: P) {
        super(props);
        this.state = this.getState();
    }

    /**
     * @description Gets state, it can override.
     */
    protected getState(): S {
        return {
            isModalVisible: false,
            confirmTitle: "",
            okText: "确认",
            cancelText: "取消",
        } as S;
    }

    /**
     * @description 取消操作 
     * @param event 
     */
    public handleCancel = (): void => {
        this.setState({
            isModalVisible: false
        })
    };

    /**
     * @description 显示弹窗 
     * @param event 
     */
    public showModal = (): void => {
        this.setState({
            isModalVisible: true,
            selectedRowKeys: this.props.selectKey
        })
    }

    /**
  * @abstract
  * @description Gets table data source
  * @param item 
  * @returns table data source 
  */
    abstract getTableDataSource(): object[];

    /**
     * @implements
     * @description Gets table columns
     * @param item 
     * @returns table columns 
     */
    abstract getTableColumns(): ColumnType<object>[];

    public onSelectChange = (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        });
    }

    public getTableProps(): TableProps<object> {
        return {
            rowKey: this.getTableRowKey(),
            bordered: true,
            dataSource: this.getTableDataSource(),
            columns: this.getTableColumns(),
            size: "small",
            rowSelection: {
                type: "radio",
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.onSelectChange
            }
        }
    }

    /**
     * @description modal内表格 
     */
    protected renderTableContent(): React.ReactNode {
        return (
            <Table
                {...this.getTableProps()}
                scroll={{ x: 1200 }}
                className={styles.modalTable}
            />
        );
    }

    public render(): React.ReactNode {
        return (
            <>
                <PopModalButton showModal={this.showModal} />
                <Modal
                    title={this.state.confirmTitle}
                    visible={this.state.isModalVisible}
                    okText={this.state.okText}
                    cancelText={this.state.cancelText}
                    onOk={
                        () => {
                            this.setState({
                                isModalVisible: false,
                                selectedRowKeys: []
                            })
                            this.props.onSelect(this.state.selectedRows)
                        }
                    }
                    onCancel={this.handleCancel}
                    width="50%"
                >
                    {this.renderTableContent()}
                </Modal>
            </>
        );
    }

    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }
}
