import React from 'react'
import {Modal, ModalProps, Form, Button, Card, Space, Table, FormItemProps} from 'antd'
import { GetRowKey } from 'rc-table/lib/interface';
import { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import styles from './PromModalComponent.module.less'

interface ITableProps{
    readonly columns: ColumnType<object>[];
    readonly dataSource: object[];
    readonly pagination: TablePaginationConfig;
    readonly onTableChange: (pagination: TablePaginationConfig) => void;
    readonly onSelectChange: (selectedRowKeys: React.Key[],selectedRows: DataType[]) => void;
    readonly selectedRowKeys: [];
    readonly getFilterFormItemProps: FormItemProps[];
    readonly onFilterSubmit: (values: Record<string, any>) => void;
}

export interface IPromModalComponentProps extends ModalProps,ITableProps {
    readonly isModalVisible: boolean;
    readonly confirmTitle: React.ReactNode;
    readonly okText?: string;
    readonly cancelText?: string;
    readonly handleOk?: (e?: React.MouseEvent<HTMLElement>) => void;
    readonly handleCancel?: (e?: React.MouseEvent<HTMLElement> ) => void;
    readonly name?:string
}

export interface IPromModalComponentState {}

export interface DataType{}

export default abstract class PromModalComponent extends React.Component<IPromModalComponentProps, IPromModalComponentState> {

    public render(): React.ReactNode {
        return (
            <Modal 
                title={ this.props.confirmTitle } 
                visible={this.props.isModalVisible} 
                onOk={this.props.handleOk} 
                onCancel={this.props.handleCancel}
                width="60%"
            >
                <Space className={ styles.filterForm } direction="vertical">
                    <Card className={ styles.filterForm }>
                        { this.renderFilterContent() }
                    </Card>
                    <Card className={ styles.filterForm }>
                        <Space direction="vertical" size="large">
                            <Table 
                                rowKey={ this.getTableRowKey() } 
                                bordered={ true }
                                pagination={ this.props.pagination } 
                                onChange={ this.props.onTableChange }
                                dataSource={ this.props.dataSource } 
                                columns={this.props.columns}
                                rowSelection={{
                                    type: "radio",
                                    selectedRowKeys: this.props.selectedRowKeys,
                                    onChange: this.props.onSelectChange
                                }}
                            />
                        </Space>
                    </Card>
                </Space>
            </Modal>  
        );
    }

    /**
     * @description 弹窗列表过滤
     */
    protected renderFilterContent(): React.ReactNode {
        return (
            <Form layout="inline" onFinish={ this.props.onFilterSubmit }>        
                {
                    this.props.getFilterFormItemProps.map<React.ReactNode>((props: FormItemProps, index: number): React.ReactNode => (
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