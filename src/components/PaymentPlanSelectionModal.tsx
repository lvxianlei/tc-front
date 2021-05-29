/**
 * @author zyc
 * @copyright © 2021
 */
import { FormItemProps, TableColumnType } from 'antd';
import React from 'react';

import { GetRowKey } from 'rc-table/lib/interface';
import AbstractModalComponent, {IAbstractModalComponentProps, IAbstractModalComponentState, IResponseData } from './AbstractModalComponent'
import RequestUtil from '../utils/RequestUtil';
import { DataType } from './AbstractModalComponent';

export interface IPaymentPlanSelectionComponentState extends IAbstractModalComponentState {
    readonly tableDataSource: [];
    readonly selectedRowKeys: React.Key[] | any,
    readonly selectedRows: object[] | any,
}

// export interface PaymentPlanDataType extends DataType{
//     readonly returnedAmount: number;
//     readonly returnedRate: number;
//     readonly returnedTime: string;
//     readonly period: number;
//     readonly description: string;
//     readonly id: number;
// }
/**
 * PaymentPlan Selection Component
 */
export default abstract class PaymentPlanSelectionComponent<P extends IAbstractModalComponentProps, S  extends IPaymentPlanSelectionComponentState> extends AbstractModalComponent<P, IPaymentPlanSelectionComponentState> {
    /**
     * @description Renders AbstractTabableComponent
     * @returns render 
     */
    public state:S = {
        isFilter: false
    } as S

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

    public getFilterFormItemProps(): FormItemProps[]  {
        return [];
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
    
    public render(): React.ReactNode {
        return (
            <>
                { super.render() }
            </> 
        );
    }

    protected getTableRowKey(): string | GetRowKey<object> {
        return 'period';
    }
}