/**
 * @author lxy
 * @copyright © 2021
 */
import React from 'react';
import { Button, FormItemProps, Input, Modal, Space } from 'antd';
import { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import RequestUtil from '../utils/RequestUtil';
import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from './AbstractSelectableModal';
import styles from './AbstractSelectableModal.module.less';
import AbstractFilteredSelecableModal from './AbstractFilteredSelecableModal';

export interface IWorkshopUserSelectionComponentState extends IAbstractSelectableModalState {
    readonly tableDataSource: IOrder[];
}
export interface IWorkshopUserSelectionComponentProps extends IAbstractSelectableModalProps {
    readonly saleOrderId?: string | number;
}

export interface IResponseDataMore extends IResponseData {
    readonly orderProductVos: [];
}
export interface IOrder {
    readonly description: string;
    readonly lineName: string;
    readonly num: number;
    readonly price: number;
    readonly productHeight: number;
    readonly productNumber: string;
    readonly productCategoryName: string;
    readonly productStatus: number;
    readonly productType: number;
    readonly productTypeName: string;
    readonly saleOrderId: number;
    readonly taskNoticeId: string;
    readonly tender: string;
    readonly totalAmount: number;
    readonly unit: string;
    readonly voltageGrade: number;
    readonly status: number;
    readonly id: string;
}

/**
 * Order Selection Component
 */
export default class WorkshopUserSelectionComponent extends AbstractFilteredSelecableModal<IWorkshopUserSelectionComponentProps, IWorkshopUserSelectionComponentState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): IWorkshopUserSelectionComponentState {
        return {
            ...super.getState(),
            tablePagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: false
            },
            confirmTitle: "选择人员"
        };
    }

    //componentDidMount
    public componentDidMount(): void {
        this.getTable({})
    }

    //接口、获值
    public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
        let resData: IOrder[] = await RequestUtil.get<IOrder[]>(`/tower-market/saleOrder/orderProduct/${this.props.saleOrderId}`);
        const selectKeys: [] = this.props.selectKey;
        selectKeys.forEach((item: IOrder) => {
            resData = resData.filter(res => res.id !== item.id);
        })
        this.setState({
            ...filterValues,
            tableDataSource: resData,
        });
    }

    //查询字段
    public getFilterFormItemProps(): FormItemProps[] {
        return [{
            name: 'internalNumber',
            children: <Input placeholder="请输入姓名进行查询" />
        }, ]
    }

    //查询
    public onFilterSubmit = async (values: Record<string, any>) => {
        this.getTable(values);
    }
    //dataSource
    public getTableDataSource(): object[] {
        return this.state.tableDataSource;
    }

    //table-column
    public getTableColumns(): ColumnType<object>[] {
        return [{
            key: 'type',
            title: '员工编号',
            width: '15%',
            dataIndex: 'type',
        }, {
            key: 'name',
            title: '姓名',
            width: '15%',
            dataIndex: 'name'
        }, {
            key: 'linkman',
            title: '部门',
            width: '15%',
            dataIndex: 'linkman'
        }, {
            key: 'phone',
            title: '岗位',
            width: '15%',
            dataIndex: 'phone'
        }, {
            key: 'phone',
            title: '在职状态',
            width: '15%',
            dataIndex: 'phone'
        }, {
            key: 'phone',
            title: '联系电话',
            width: '25%',
            dataIndex: 'phone'
        }];
    }

    //row-key
    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }


    public showModal = (): void => {
        if (this.props.saleOrderId) {
            this.setState({
                isModalVisible: true
            })
            this.getTable({})
        }

    }


    public render(): React.ReactNode {
        return (
            <>
                <Button type="primary" onClick={()=>{
                    this.setState({
                        isModalVisible: true
                    })
                }}>添加人员</Button>
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