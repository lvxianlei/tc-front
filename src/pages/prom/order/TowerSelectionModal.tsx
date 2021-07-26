/**
 * @author zyc
 * @copyright © 2021
 */
import { Button,  message,  Modal, Space, TableColumnType } from 'antd';
import { TablePaginationConfig, TableProps } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';

import styles from '../../../components/AbstractSelectableModal.module.less';
import orderStyles from './AbstractSaleOrderSetting.module.less'
import AbstractSelectableModal from '../../../components/AbstractSelectableModal';
import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from '../../../components/AbstractSelectableModal';
import RequestUtil from '../../../utils/RequestUtil';
import { IProductVo } from './AbstractSaleOrderSetting';

export interface ITowerSelectionModalProps extends IAbstractSelectableModalProps {
    readonly id?: string | number;
}
export interface ITowerSelectionModalState extends IAbstractSelectableModalState {
    readonly tableDataSource: IProductVo[];
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
            confirmTitle: "选择塔型"
        };
    }

    public showModal =  (): void => {
        if(this.props.id) {
            this.setState({
                isModalVisible: true
            })
            this.getTable({})
        } else {
            message.warning('请先选择关联合同！');
        }
        
    }
    
    public async getTable(pagination: TablePaginationConfig = {}) {
        let resData: IProductVo[] = await RequestUtil.get(`/tower-market/contract/product/${ this.props.id }`);
        const selectKeys: [] = this.props.selectKey;
        selectKeys.map((item: IProductVo) => {
            resData = resData.filter(res => res.productId !== item.productId );
        })
        this.setState({
            tableDataSource: resData,
        });
    }

    public getTableProps(): TableProps<object> {
        return {
            pagination: false,
            rowKey:  this.getTableRowKey(),
            bordered:  true, 
            dataSource:  this.getTableDataSource(), 
            columns: this.getTableColumns(),
            rowSelection: {
                type: "radio",
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.onSelectChange
            }
        }
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
            key: 'productCategoryName',
            title: '塔型',
            dataIndex: 'productCategoryName',
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
                <Button onClick={ this.showModal } type="primary" className={ orderStyles.addBtn }>新增行</Button>
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
        return 'productId';
    }
}