import React from 'react'
import {Modal, ModalProps, Form, Button, Card, Space, Table, FormItemProps} from 'antd'

import { PlusOutlined } from '@ant-design/icons';
import { GetRowKey } from 'rc-table/lib/interface';
import { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import styles from './PromModalComponent.module.less'

// interface ITableProps{
//     readonly columns: ColumnType<object>[];
//     readonly dataSource: object[];
//     readonly pagination: TablePaginationConfig;
//     readonly onTableChange: (pagination: TablePaginationConfig) => void;
//     readonly onSelectChange: (selectedRowKeys: React.Key[],selectedRows: DataType[]) => void;
//     readonly selectedRowKeys: [];
//     readonly getFilterFormItemProps: FormItemProps[];
//     readonly onFilterSubmit: (values: Record<string, any>) => void;
// }

export interface IAbstractShowModalComponentProps {
    
}

export interface IAbstractShowModalComponentState {
    readonly isModalVisible: boolean,
    readonly confirmTitle: string,
    readonly okText?: string,
    readonly cancelText?: string;
    readonly name?:string
}

export interface DataType{}

export default abstract class AbstractShowModalComponent<P extends IAbstractShowModalComponentProps, S extends IAbstractShowModalComponentState> extends React.Component<P,S> {

    abstract showModal  (): void 

    public render(): React.ReactNode {
        return (
            <>
                <Button type="text" target="customerCompany" onClick={ this.showModal }>
                    <PlusOutlined />
                </Button> 
            </>
           
                
            
        );
    }
}