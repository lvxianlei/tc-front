/**
 * @author lxy
 * @copyright © 2021
 */
import React from 'react';
import { Button, FormItemProps, Input, Modal, Space } from 'antd';
import { ColumnType, TablePaginationConfig, TableProps } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import styles from '../../components/AbstractSelectableModal.module.less';
import { ButtonType } from 'antd/lib/button';
import { RowSelectionType } from 'antd/lib/table/interface';
import { DataType, IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from '../../components/AbstractSelectableModal';
import AbstractFilteredSelecableModal from '../../components/AbstractFilteredSelecableModal';
import RequestUtil from '../../utils/RequestUtil';

export interface IEmployeeDeptSelectionComponentState extends IAbstractSelectableModalState {
    readonly tableDataSource: IDept[];
}
export interface IEmployeeDeptSelectionComponentProps extends IAbstractSelectableModalProps {
    readonly saleOrderId?: string | number;
    readonly buttonType?: ButtonType;
    readonly buttonTitle?: string;
    readonly rowSelectionType?: RowSelectionType | undefined;
}

export interface IResponseDataMore extends IResponseData {
    readonly IDept: [];
}

export interface IDept {
    readonly id: string;
    readonly classification: string;
    readonly name: string;
    readonly description: string;
}

/**
 * Workshop User Selection Component
 */
export default class EmployeeDeptSelectionComponent extends AbstractFilteredSelecableModal<IEmployeeDeptSelectionComponentProps, IEmployeeDeptSelectionComponentState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): IEmployeeDeptSelectionComponentState {
        return {
            ...super.getState(),
        //  tablePagination: {
        //      current: 1,
        //      pageSize: 10,
        //      total: 0,
        //      showSizeChanger: false
        //  },
            confirmTitle: "选择部门",
            selectedRows: [],
            selectedRowKeys: []
        };
    }

    public getTableProps() {
        return {
            ...super.getTableProps(),
            rowSelection: {
                type: this.props.rowSelectionType || 'radio',
                selectedRowKeys: this.state.selectedRowKeys,
                getCheckboxProps: (record: any) => ({
                    disabled: record.parentId === "0"|| record.type === 2, // Column configuration not to be checked
                }),
                onChange: this.onSelectChange
            }
        }
    }

    public onSelectChange = (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        });
    }

    /**
     * @description 取消操作 
     * @param event 
     */
    public handleCancel = (): void => {
        this.setState({
            isModalVisible: false,
            selectedRowKeys: []
        })
        this.getForm()?.resetFields();
    };

    //componentDidMount
    public componentDidMount(): void {
        
    }

    //接口、获值
    public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
        let resData: IDept[] = await RequestUtil.get<IDept[]>(`/tower-system/department`, {
            ...filterValues,
        //  current: pagination.current || this.state.tablePagination?.current,
        //  size: pagination.pageSize || this.state.tablePagination?.pageSize
        });
        const selectKeys: [] = this.props.selectKey;
        let newData: IDept[] = resData;
        selectKeys?.forEach((item: IDept) => {
            newData = newData.filter(res => res.id !== item.id);
        })
        this.setState({
            ...filterValues,
            tableDataSource: newData,
        //  tablePagination: {
        //      ...this.state.tablePagination,
        //      current: resData.current,
        //      pageSize: resData.size,
        //      total: resData.total
        //  }
        });
    }

    //查询字段
    public getFilterFormItemProps(): FormItemProps[] {
        return [{
            name: 'name',
            children: <Input placeholder="请输入部门名称进行查询" />
        }, ]
    }

    //查询
    public onFilterSubmit = async (values: Record<string, any>) => {
        this.getTable(values, {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: false
        });
    }
    //dataSource
    public getTableDataSource(): object[] {
        return this.state.tableDataSource;
    }

    //table-column
    public getTableColumns(): ColumnType<object>[] {
        return [{
            key: 'name',
            title: '部门名称',
            width: '20%',
            dataIndex: 'name',
        }, {
            key: 'classification',
            title: '类型',
            width: '20%',
            dataIndex: 'classification',
        }, {
            key: 'description',
            title: '简介',
            width: '60%',
            dataIndex: 'description'
        }];
    }

    //row-key
    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }

    public render(): React.ReactNode {
        return (
            <>
                <Button type={this.props.buttonType || 'primary'} style={this.props.buttonType==='link'?{ paddingBottom: '0', paddingTop: '0', height: 'auto', lineHeight: 1 }:{}} onClick={()=>{
                    this.getTable({})
                    this.setState({
                        isModalVisible: true
                    })
                }}>{this.props.buttonTitle || '选择部门'}</Button>
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
                                this.setState({
                                    selectedRowKeys: []
                                })
                                this.getForm()?.resetFields();
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
}