import React from 'react'
import {Modal, ModalProps, Form, Button, Card, Space, Table, FormItemProps} from 'antd'

import { GetRowKey } from 'rc-table/lib/interface';
import { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import styles from './PromModalComponent.module.less'
import AbstractShowModalComponent from './AbstractShowModalComponent';
import { stringify } from 'query-string';

export interface IAbstractModalComponentProps {
    readonly handleOk: (vales: Record<string, any>) => void;
    readonly onSelectChange: (selectedRowKeys: React.Key[],selectedRows: DataType[]) => void;
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

export interface DataType{}

export interface IResponseData {
    readonly total: number | undefined;
    readonly size: number | undefined;
    readonly current: number | undefined;
    readonly parentCode: string;
    readonly records: [];
}

export default abstract class AbstractModalComponent<P extends IAbstractModalComponentProps, S extends IAbstractModalComponentState> extends AbstractShowModalComponent<P,S> {

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
     * @returns state 
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
     * @description Determines whether filter submit on
     * @param values 
     */
    abstract onFilterSubmit(values: Record<string, any>): void;

      /**
       * @abstract
       * @description Determines whether table change on
       * @param pagination 
       */
    abstract onTableChange(pagination: TablePaginationConfig): void;

    public onSelectChange = (selectedRowKeys: React.Key[],selectedRows: DataType[]) => {
        this.setState({ 
            selectedRowKeys,
            selectedRows
        });
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

     /**
     * @abstract
     * @description Gets filter form item props
     * @param item 
     * @returns filter form item props 
     */
    abstract getFilterFormItemProps(): FormItemProps[];

    /**
     * @abstract
     * @description modal内表格 
     * @param event 
     */

    protected renderTableContent(): React.ReactNode {
        return (
            <Space className={ styles.filterForm } direction="vertical">
                <Card className={ styles.filterForm }>
                    { this.renderFilterContent() }
                </Card>
                <Card className={ styles.filterForm }>
                    <Space direction="vertical" size="large">
                        <Table 
                            rowKey={ this.getTableRowKey() } 
                            bordered={ true }
                            pagination={ this.state.tablePagination } 
                            onChange={ this.onTableChange }
                            dataSource={ this.getTableDataSource() } 
                            columns={this.getTableColumns()}
                            rowSelection={{
                                type: "radio",
                                selectedRowKeys: this.state.selectedRowKeys,
                                onChange: this.props.onSelectChange
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
                            // this.props.handleOk
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

    /**
     * @description 弹窗列表过滤
     */
     protected renderFilterContent(): React.ReactNode {
        return (
            <Form layout="inline" onFinish={ this.onFilterSubmit }>        
                {
                    this.getFilterFormItemProps().map<React.ReactNode>((props: FormItemProps, index: number): React.ReactNode => (
                        <Form.Item key={ `${ props.name }_${ index }` } { ...props }/>
                    ))
                }
                <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="reset">重置</Button>
                </Form.Item>
            </Form>
        );
    }

    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }
    

}