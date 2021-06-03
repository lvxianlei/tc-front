import React from 'react'
import {Modal, Card, Space, Table} from 'antd'

import { GetRowKey } from 'rc-table/lib/interface';
import { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import styles from './AbstractSelectionModal.module.less'
import PopModalButton from './PopModalButton';

export interface IAbstractSelectableModalProps {
    readonly onSelect: (selectedRows: DataType[]) => void;
    readonly id?: number;
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
    readonly contractId?: number;
    readonly internalNumber?: string;
    readonly signContractTime?: string;
    readonly saleOrderNumber?: string;
    readonly lineName?: string	;
    readonly num?:number;
    readonly price?: number;
    readonly productHeight?: number;
    readonly productNumber?: string;
    readonly productShape?: string;
    readonly productStatus?: number;
    readonly productType?: number;
    readonly saleOrderId?: number;
    readonly taskNoticeId?: number;	
    readonly tender?: string;
    readonly totalAmount?:number;
    readonly unit?: string;
    readonly voltageGrade?: number;
}

export interface IResponseData {
    readonly total: number | undefined;
    readonly size: number | undefined;
    readonly current: number | undefined;
    readonly parentCode: string;
    readonly records: [];
    readonly paymentPlanVos: [];
    readonly productVos: [];
}

export default abstract class AbstractSelectionModal<P extends IAbstractSelectableModalProps, S extends IAbstractSelectableModalState> extends React.Component<P,S> {

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
        this.setState ({
            isModalVisible: false
        })
    };

    /**
     * @description 显示弹窗 
     * @param event 
     */
    public showModal =  (): void => {
        this.setState({
            isModalVisible: true,
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

    public onSelectChange = (selectedRowKeys: React.Key[],selectedRows: DataType[]) => {
        this.setState({ 
            selectedRowKeys,
            selectedRows
        });
    } 

    /**
     * @description modal内表格 
     */
    protected renderTableContent(): React.ReactNode {
        return (
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
        );
    }

    public render(): React.ReactNode {
        return (
            <>
                <PopModalButton showModal={ this.showModal }/>
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
                    <Space direction="vertical" className={ styles.modalTable } >
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
