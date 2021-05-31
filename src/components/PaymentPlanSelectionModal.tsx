/**
 * @author zyc
 * @copyright © 2021
 */
import { TableColumnType } from 'antd';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';

import RequestUtil from '../utils/RequestUtil';
import AbstractModalComponent, {
    IAbstractModalComponentProps,
    IAbstractModalComponentState,
    IResponseData,
} from './AbstractSelectionModal';

export interface IPaymentPlanSelectionComponentState extends IAbstractModalComponentState {
    readonly tableDataSource: [];
    readonly selectedRowKeys: React.Key[] | any,
    readonly selectedRows: object[] | any,
}

/**
 * PaymentPlan Selection Component
 */
export default class PaymentPlanSelectionComponent extends AbstractModalComponent<IAbstractModalComponentProps, IPaymentPlanSelectionComponentState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): IPaymentPlanSelectionComponentState {
        return {
            ...super.getState(),
            confirmTitle: "选择回款计划"
        };
    }

    public showModal =  (): void => {
        this.setState({
            isModalVisible: true,
        })
        this.getTable()
    }
    
    protected async getTable() {
        const resData: IResponseData = await RequestUtil.get<IResponseData>(`/tower-market/contract/${this.props.Id}`);
        this.setState({
            tableDataSource: resData.paymentPlanVos,
        });
    }
    public getTableDataSource(): object[]  {
        return this.state.tableDataSource;
    }

    public getTableColumns(): TableColumnType<object>[] {
        return [{
            key: 'period',
            title: '期次',
            dataIndex: 'period'
        }, {
            key: 'returnedTime',
            title: '计划回款日期',
            dataIndex: 'returnedTime'
        }, {
            key: 'returnedRate',
            title: '计划回款占比',
            dataIndex: 'returnedRate',
        }, {
            key: 'returnedAmount',
            title: '计划回款金额',
            dataIndex: 'returnedAmount'
        }, {
            key: 'description',
            title: '备注',
            dataIndex: 'description'
        }];
    }

    protected getTableRowKey(): string | GetRowKey<object> {
        return 'period';
    }
}