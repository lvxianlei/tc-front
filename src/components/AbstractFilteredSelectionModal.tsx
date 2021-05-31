import React from 'react'
import {Modal, Form, Button, Card, Space, Table, FormItemProps} from 'antd'

import { GetRowKey } from 'rc-table/lib/interface';
import { TablePaginationConfig } from 'antd/lib/table';
import styles from './AbstractSelectionModal.module.less'
import AbstractSelectionModal, { DataType, IAbstractModalComponentState } from './AbstractSelectionModal';

export interface IAbstractModalComponentProps {
    readonly onSelect: (selectedRows: DataType[]) => void;
    readonly Id?: number;
}


export default abstract class AbstractFilteredSelectionModal<P extends IAbstractModalComponentProps, S extends IAbstractModalComponentState> extends AbstractSelectionModal<P,S> {

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
            <Space direction="vertical" className={ styles.modalTable } >
                <Card className={ styles.tableCard }>
                    {  this.renderFilterContent() }
                </Card>
                <Card className={ styles.tableCard }>
                    <Space direction="vertical" size="large" >
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
                                onChange: this.onSelectChange
                            }}
                        />
                    </Space>
                </Card>
            </Space>
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
