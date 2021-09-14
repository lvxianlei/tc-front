/**
 * @author lxy
 * @copyright © 2021
 */
import React from 'react';
import { Button, FormItemProps, Modal, Space } from 'antd';
import { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import RequestUtil from '../utils/RequestUtil';
import AbstractSelectionModal, { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from './AbstractSelectableModal';
import styles from './AbstractSelectableModal.module.less';

export interface IOrderSelectionComponentState extends IAbstractSelectableModalState {
    readonly tableDataSource: IOrder[];
}
export interface IOrderSelectionComponentProps extends IAbstractSelectableModalProps {
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
export default class OrderSelectionComponent extends AbstractSelectionModal<IOrderSelectionComponentProps, IOrderSelectionComponentState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): IOrderSelectionComponentState {
        return {
            ...super.getState(),
            tablePagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: false
            },
            confirmTitle: "选择明细"
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
        return []
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
        return [
            {
                title: '线路名称',
                dataIndex: 'lineName',
                key: 'lineName'
            },
            {
                title: '产品类型',
                dataIndex: 'productTypeName',
                key: 'productTypeName'
            },
            {
                title: '塔型',
                dataIndex: 'productCategoryName',
                key: 'productCategoryName'
            },
            {
                title: '杆塔号',
                dataIndex: 'productNumber',
                key: 'productNumber'
            },
            {
                title: '电压等级（KV）',
                dataIndex: 'voltageGradeName',
                key: 'voltageGradeName'
            },
            {
                title: '呼高（米）',
                dataIndex: 'productHeight',
                key: 'productHeight'
            },
            {
                title: '重量（吨）',
                dataIndex: 'num',
                key: 'num'
            },
            {
                title: '单价',
                dataIndex: 'price',
                key: 'price'
            },
            {
                title: '标段',
                dataIndex: 'tender',
                key: 'tender'
            },
            {
                title: '备注',
                dataIndex: 'description',
                key: 'description'
            },
        ];
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
                <Button type="primary" onClick={this.showModal}>新增</Button>
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