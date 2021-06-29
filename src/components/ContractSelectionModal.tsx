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

export interface IContractSelectionComponentState extends IAbstractSelectableModalState {
    readonly tableDataSource: [];
}

/**
 * Contract Selection Component
 */
export default class ContractSelectionComponent extends AbstractFilteredSelectionModal<IAbstractSelectableModalProps, IContractSelectionComponentState> {

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

    public showModal =  (): void => {
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
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize ||this.state.tablePagination?.pageSize
        });
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
 
    public getFilterFormItemProps(): FormItemProps[]  {
        return [{
            name: 'saleType',
            children: 
                <Select placeholder="请选择中标类型" className={ styles.select_width } getPopupContainer={ triggerNode => triggerNode.parentNode }>
                    { saleTypeOptions && saleTypeOptions.map(({ id, name }, index) => {
                        return <Option key={ index } value={ id }>
                            { name }
                        </Option>
                    }) }
                </Select>
            
        },{
                name: 'projectName',
                children: <Input placeholder="工程名称关键字"/>
            }, {
                name: 'customerCompany',
                children: <Input placeholder="业主单位关键字"/>
            }];
    }

    public onFilterSubmit = async (values: Record<string, any>) => {
        this.getTable(values);
    }

    public getTableDataSource(): object[]  {
        return this.state.tableDataSource;
    }

    public getTableColumns(): TableColumnType<object>[] {
        return [{
            key: 'contractNumber',
            title: '合同编号',
            dataIndex: 'contractNumber'
        }, {
            key: 'projectName',
            title: '工程名称',
            dataIndex: 'projectName'
        }, {
            key: 'saleTypeName',
            title: '销售类型',
            dataIndex: 'saleTypeName'
        }, {
            key: 'customerCompany',
            title: '业主单位',
            dataIndex: 'customerCompany'
        }, {
            key: 'signCustomerName',
            title: '合同签订单位',
            dataIndex: 'signCustomerName'
        }, {
            key: 'deliveryTime',
            title: '要求交货日期',
            dataIndex: 'deliveryTime'
        }, {
            key: 'chargeType',
            title: '计价方式',
            dataIndex: 'chargeType',
            render: (type: number): React.ReactNode => {
                return  type === 0 ? '订单总价、总重计算单价' : '产品单价、基数计算总价';
            }
        }];
    }

    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }
}