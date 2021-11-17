import { Button, Form, FormInstance, FormItemProps } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';

import AbstractSelectionModal, { DataType, IAbstractSelectableModalState } from './AbstractSelectableModal';

export interface IAbstractSelectableModalProps {
    readonly onSelect: (selectedRows: DataType[]) => void;
    readonly Id?: number;
}


export default abstract class AbstractFilteredSelecableModal<P extends IAbstractSelectableModalProps, S extends IAbstractSelectableModalState> extends AbstractSelectionModal<P,S> {
    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();
    
    /**
     * @protected
     * @description Gets form
     * @returns form 
     */
     protected getForm(): FormInstance | null {
        return this.form?.current;
    }

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
    abstract getTable(values: Record<string, any>, pagination: TablePaginationConfig, flag: boolean ): void;

    /**
     * @description Determines whether table change on
     * @param pagination 
     */
    public onTableChange = (pagination: TablePaginationConfig): void => {
        this.getTable({ ...this.getForm()?.getFieldsValue(true) }, pagination, false);
    }

    protected onReset = (): void => {
        this.getForm()?.resetFields();
    }

     /**
     * @description Gets filter form item props
     * @param item 
     * @returns filter form item props 
     */
    abstract getFilterFormItemProps(): FormItemProps[];

    public getTableProps() {
        return {
            ...super.getTableProps(),
            pagination: this.state.tablePagination,
            onChange:  this.onTableChange 
        }
    }

    /**
     * @description modal内表格 
     */
    protected renderTableContent(): React.ReactNode {
        return (
            <>
                {  this.renderFilterContent() }
                { super.renderTableContent() }
            </>
        );
    }

    /**
     * @description 弹窗列表过滤
     */
    protected renderFilterContent(): React.ReactNode {
        return (
            <Form layout="inline" onFinish={ this.onFilterSubmit } ref={ this.form }>        
                {
                    this.getFilterFormItemProps().map<React.ReactNode>((props: FormItemProps, index: number): React.ReactNode => (
                        <Form.Item key={ `${ props.name }_${ index }` } { ...props }/>
                    ))
                }
                <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="button" onClick={ this.onReset }>重置</Button>
                </Form.Item>
            </Form>
        );
    }

    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }
}
