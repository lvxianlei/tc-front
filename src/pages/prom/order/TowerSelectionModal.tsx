/**
 * @author zyc
 * @copyright © 2021
 */
import { Button,  Modal, Space, TableColumnType } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';

import styles from '../../../components/AbstractSelectableModal.module.less';
import orderStyles from './AbstractSaleOrderSetting.module.less'
import AbstractSelectableModal from '../../../components/AbstractSelectableModal';
import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from '../../../components/AbstractSelectableModal';
import RequestUtil from '../../../utils/RequestUtil';

export interface ITowerSelectionModalProps extends IAbstractSelectableModalProps {
    readonly readonly?: boolean; 
    readonly id?: string | number;
}
export interface ITowerSelectionModalState extends IAbstractSelectableModalState {
    readonly tableDataSource: [];
}

/**
 * Contract Selection Component
 */
export default class TowerSelectionModal extends AbstractSelectableModal<ITowerSelectionModalProps, ITowerSelectionModalState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): ITowerSelectionModalState {
        return {
            ...super.getState(),
            tablePagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: false
            },
            confirmTitle: "选择塔型"
        };
    }

    public showModal =  (): void => {
        this.setState({
            isModalVisible: true,
        })
        this.getTable({})
    }
    
    public async getTable(pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>(`/tower-data-archive/productCategoryById`, {
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize ||this.state.tablePagination?.pageSize,
            id: this.props.id
        });
        this.setState({
            tableDataSource: resData.records,
            tablePagination: {
                ...this.state.tablePagination,
                current: resData.current,
                pageSize: resData.size,
                total: resData.total
            }
        });
    }

    public getTableDataSource(): object[]  {
        return this.state.tableDataSource;
    }

    public getTableColumns(): TableColumnType<object>[] {
        return [{
            key: 'lineName',
            title: '线路名称',
            dataIndex: 'lineName',
            width: 120
        }, {
            key: 'productNumber',
            title: '杆塔号',
            dataIndex: 'productNumber',
            width: 120
        }, {
            key: 'productTypeName',
            title: '产品类型',
            dataIndex: 'productTypeName',
            width: 120
        }, {
            key: 'voltageGradeName',
            title: '电压等级（kV）',
            dataIndex: 'voltageGradeName',
            width: 120
        }, {
            key: 'productHeight',
            title: ' 呼高（m）',
            dataIndex: 'productHeight'
        }, {
            key: 'bodyWeight',
            title: '身部重量（kg）',
            dataIndex: 'bodyWeight'
        }, {
            key: 'towerLeg1Length',
            title: '接腿1#长度（m）',
            dataIndex: 'towerLeg1Length'
        }, {
            key: 'towerLeg1Weight',
            title: '接腿1#重量（kg）',
            dataIndex: 'towerLeg1Weight'
        }, {
            key: 'towerLeg2Length',
            title: '接腿2#长度（m）',
            dataIndex: 'towerLeg2Length'
        }, {
            key: 'towerLeg2Weight',
            title: '接腿2#重量（kg）',
            dataIndex: 'towerLeg2Weight'
        }, {
            key: 'towerLeg3Length',
            title: '接腿3#长度（m）',
            dataIndex: 'towerLeg3Length'
        }, {
            key: 'towerLeg3Weight',
            title: '接腿3#重量（kg）',
            dataIndex: 'towerLeg3Weight'
        }, {
            key: 'towerLeg4Length',
            title: '接腿4#长度（m）',
            dataIndex: 'towerLeg4Length'
        }, {
            key: 'towerLeg4Weight',
            title: '接腿4#重量（kg）',
            dataIndex: 'towerLeg4Weight'
        }, {
            key: 'towerFootWeight',
            title: '塔脚板重量（kg）',
            dataIndex: 'towerFootWeight'
        }, {
            key: 'productWeight',
            title: '杆塔重量（kg）',
            dataIndex: 'productWeight'
        }, {
            key: 'description',
            title: '备注',
            dataIndex: 'description'
        }];
    }

    public render(): React.ReactNode {
        return (
            <>
                <Button onClick={ this.showModal } type="primary" className={ this.props.readonly? orderStyles.isShow : orderStyles.addBtn }>新增行</Button>
                <Modal 
                    title={ this.state.confirmTitle } 
                    visible={this.state.isModalVisible} 
                    okText={ this.state.okText }
                    cancelText={ this.state.cancelText }
                    onOk={ 
                        () => {
                            this.setState ({
                                isModalVisible: false,
                                selectedRowKeys: []
                            })
                           { this.props.onSelect(this.state.selectedRows) }
                        }
                    } 
                    onCancel={this.handleCancel}
                    width="50%"
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