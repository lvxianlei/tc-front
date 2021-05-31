import React from 'react'
import {Modal, Card, Space, Table} from 'antd'

import { GetRowKey } from 'rc-table/lib/interface';
import { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import styles from './AbstractSelectionModal.module.less'
import AbstractShowModalComponent from './AbstractShowModalComponent';

export interface IAbstractModalComponentProps {
    readonly onSelect: (selectedRows: DataType[]) => void;
    readonly Id?: number;
}

export interface IAbstractModalComponentState {
    readonly isModalVisible: boolean,
    readonly confirmTitle: string,
    readonly okText?: string,
    readonly cancelText?: string;
    readonly tablePagination: TablePaginationConfig;
    readonly selectedRowKeys: React.Key[] | any,
    readonly selectedRows: object[] | any,
}

export interface DataType{
    readonly linkman?: string;
    readonly name?: string;
    readonly id?: number;
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
}

export interface IResponseData {
    readonly total: number | undefined;
    readonly size: number | undefined;
    readonly current: number | undefined;
    readonly parentCode: string;
    readonly records: [];
    readonly paymentPlanVos: [];
}

export default abstract class AbstractSelectionModal<P extends IAbstractModalComponentProps, S extends IAbstractModalComponentState> extends AbstractShowModalComponent<P,S> {

    /**
     * @constructor
     * Creates an instance of AbstractModalComponent.
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
     * @abstract
     * @description 取消操作 
     * @param event 
     */
    public handleCancel = (): void => {
        this.setState ({
            isModalVisible: false
        })
    };

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

    public onSelectChange = (selectedRowKeys: React.Key[],selectedRows: DataType[]) => {
        this.setState({ 
            selectedRowKeys,
            selectedRows
        });
    } 

    /**
     * @abstract
     * @description modal内表格 
     * @param event 
     */
    protected renderTableContent(): React.ReactNode {
        return (
            <Space direction="vertical" className={ styles.modalTable } >
                <Card className={ styles.tableCard }>
                    <Space direction="vertical" size="large" >
                        <Table 
                            rowKey={ this.getTableRowKey() } 
                            bordered={ true } 
                            dataSource={ this.getTableDataSource() } 
                            columns={this.getTableColumns()}
                            rowSelection={{
                                type: "radio",
                                selectedRowKeys: this.state.selectedRowKeys,
                                onChange: this.onSelectChange
                            }}
                        />
                    </Space>
                </Card>
            </Space>
        );
    }

    public render(): React.ReactNode {
        return (
            <>
                {super.render()}
                <Modal 
                    title={ this.state.confirmTitle } 
                    visible={this.state.isModalVisible} 
                    okText={ this.state.okText }
                    cancelText={ this.state.cancelText }
                    onOk={ 
                        () => {
                            this.setState ({
                                isModalVisible: false
                            })
                           { this.props.onSelect(this.state.selectedRows) }
                        }
                    } 
                    onCancel={this.handleCancel}
                    width="60%"
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
