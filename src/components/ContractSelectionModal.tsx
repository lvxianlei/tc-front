/**
 * @author zyc
 * @copyright © 2021
 */
import { FormItemProps, Input, Select, TableColumnType } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';

import styles from './AbstractSelectableModal.module.less';
import RequestUtil from '../utils/RequestUtil';
import AbstractFilteredSelectionModal from './AbstractFilteredSelecableModal';
import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from './AbstractSelectableModal';
import { saleTypeOptions } from '../configuration/DictionaryOptions';

const { Option } = Select;
export interface IContractSelectionComponentProps extends IAbstractSelectableModalProps {
    readonly status?: number;
    readonly projectId?: string;
}
export interface IContractSelectionComponentState extends IAbstractSelectableModalState {
    readonly tableDataSource: [];
}

/**
 * Contract Selection Component
 */
export default class ContractSelectionComponent extends AbstractFilteredSelectionModal<IContractSelectionComponentProps, IContractSelectionComponentState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): IContractSelectionComponentState {
        return {
            ...super.getState(),
            tablePagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: false
            },
            confirmTitle: "选择合同"
        };
    }

    public showModal = (): void => {
        this.setState({
            isModalVisible: true,
        })
    }

    public componentDidMount(): void {
        this.getTable({})
    }

    public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-market/contract', {
            ...filterValues,
            projectId: this.props.projectId,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize || this.state.tablePagination?.pageSize,
            status: this.props.status
        });
        // 对数据销售类型为-1情况进行处理
        if (resData && resData.records && resData.records.length > 0) {
            resData.records.forEach((item: any) => item.saleType = item.saleType < 0 ? "" : item.saleType)
        }
        this.setState({
            ...filterValues,
            tableDataSource: resData.records,
            tablePagination: {
                ...this.state.tablePagination,
                current: resData.current,
                pageSize: resData.size,
                total: resData.total
            }
        });
    }

    public getFilterFormItemProps(): FormItemProps[] {
        return [{
            name: 'saleType',
            children:
                <Select placeholder="请选择销售类型" className={styles.select_width} getPopupContainer={triggerNode => triggerNode.parentNode}>
                    {saleTypeOptions && saleTypeOptions.map(({ id, name }, index) => {
                        return <Option key={index} value={id}>
                            {name}
                        </Option>
                    })}
                </Select>

        }, {
            name: 'projectName',
            children: <Input placeholder="工程名称关键字" />
        }, {
            name: 'customerCompany',
            children: <Input placeholder="业主单位关键字" />
        }];
    }

    public onFilterSubmit = async (values: Record<string, any>) => {
        this.getTable(values, {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: false
        });
    }

    public getTableDataSource(): object[] {
        return this.state.tableDataSource;
    }

    public getTableColumns(): TableColumnType<object>[] {
        return [{
            key: 'contractNumber',
            title: '合同编号',
            dataIndex: 'contractNumber',
            width: '15%',
        }, {
            key: 'contractName',
            title: '合同名称',
            dataIndex: 'contractName',
            width: '15%',
        }, {
            key: 'saleType',
            title: '销售类型',
            dataIndex: 'saleType',
            width: '15%',
        }, {
            key: 'customerCompany',
            title: '业主单位',
            dataIndex: 'customerCompany',
            width: '15%',
        }, {
            key: 'signCustomerName',
            title: '合同签订单位',
            dataIndex: 'signCustomerName',
            width: '15%',
        }, {
            key: 'deliveryTime',
            title: '要求交货日期',
            dataIndex: 'deliveryTime',
            width: '15%',
        }];
    }

    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }
}