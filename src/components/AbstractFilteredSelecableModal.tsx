import React from 'react'
import {Modal, Form, Button, Card, Space, Table, FormItemProps} from 'antd'

import { GetRowKey } from 'rc-table/lib/interface';
import { TablePaginationConfig } from 'antd/lib/table';
import styles from './AbstractSelectionModal.module.less'
import AbstractSelectionModal, { DataType, IAbstractSelectableModalState } from './AbstractSelectableModal';

export interface IAbstractSelectableModalProps {
    readonly onSelect: (selectedRows: DataType[]) => void;
    readonly Id?: number;
}


export default abstract class AbstractFilteredSelecableModal<P extends IAbstractSelectableModalProps, S extends IAbstractSelectableModalState> extends AbstractSelectionModal<P,S> {
     /**
     * @abstract
     * @description Determines whether filter submit on
     * @param values 
     */
    abstract onFilterSubmit(values: Record<string, any>): void;

     /**
     * @abstract
     * @description 获取列表
     * @param values 
     */
      abstract getTable(values: Record<string, any>): void;

    /**
     * @description Determines whether table change on
     * @param pagination 
     */
    public onTableChange = (pagination: TablePaginationConfig): void => {
        this.getTable(pagination);
    }

     /**
     * @description Gets filter form item props
     * @param item 
     * @returns filter form item props 
     */
    abstract getFilterFormItemProps(): FormItemProps[];

    public getTableProps() {
        return {
            pagination: this.state.tablePagination,
            onChange:  this.onTableChange 
        }
    }
    /**
     * @description modal内表格 
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
                        { ...super.getTableProps() } 
                        pagination={ this.state.tablePagination } 
                        onChange={ this.onTableChange }/>
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
