/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Form, Input, Space, TableColumnType } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import AbstractMngtComponent, { IAbstractMngtComponentState, ITabItem } from '../components/AbstractMngtComponent';
import RequestUtil from '../utils/RequestUtil';

export interface IClientMngtProps {}
export interface IClientMngtWithRouteProps extends RouteComponentProps<IClientMngtProps>, WithTranslation {}
export interface IClientMngtState extends IAbstractMngtComponentState {
    readonly tableDataSource: ITableDataItem[];
}

interface ITableDataItem {
    readonly id: number;
    readonly name: string;
    readonly category: number;
    readonly contact: string;
    readonly phoneNumber: string;
    readonly comment: string;
    readonly createdDateTime: string;
}

/**
 * Client Management
 */
class ClientMngt extends AbstractMngtComponent<IClientMngtWithRouteProps, IClientMngtState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): IClientMngtState {
        return {
            ...super.getState(),
            tableDataSource: []
        };
    }

    /**
     * @description Fetchs table data
     * @param filterValues 
     */
    protected async fetchTableData(filterValues: Record<string, any>) {
        const tableDataItems: ITableDataItem[] = await RequestUtil.get<ITableDataItem[]>('/client/list', {
            ...filterValues,
            tabKey: this.state.selectedTabKey
        });
        this.setState({
            tableDataSource: tableDataItems
        });
    }

    /**
     * @implements
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        this.fetchTableData({});
    }

    /**
     * @implements
     * @description Gets table data source
     * @param item 
     * @returns table data source 
     */
    public getTableDataSource(item: ITabItem): object[] {
        return this.state.tableDataSource;
    }

    /**
     * @implements
     * @description Gets table columns
     * @param item 
     * @returns table columns 
     */
    public getTableColumns(item: ITabItem): TableColumnType<object>[] {
        return [{
            key: 'name',
            title: '客户名称',
            dataIndex: 'name'
        }, {
            key: 'category',
            title: '客户类型',
            dataIndex: 'category',
            render: (category: number): React.ReactNode => {
                return  category === 1 ? '国内客户' : '国际客户';
            }
        }, {
            key: 'contact',
            title: '重要联系人',
            dataIndex: 'contact'
        }, {
            key: 'phoneNumber',
            title: '手机号码',
            dataIndex: 'phoneNumber'
        }, {
            key: 'comment',
            title: '备注',
            dataIndex: 'comment'
        }, {
            key: 'createdDateTime',
            title: '创建时间',
            dataIndex: 'createdDateTime'
        }, {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to="">编辑</Link>
                    <Link to="">删除</Link>
                </Space>
            )
        }];
    }
    
    /**
     * @implements
     * @description Determines whether filter submit on
     * @param values 
     */
    public async onFilterSubmit(values: Record<string, any>) {
        this.fetchTableData(values);
    }

    /**
     * @implements
     * @description Gets tab items
     * @returns tab items 
     */
    public getTabItems(): ITabItem[] {
        return [{
            label: '全部客户',
            key: 0
        }, {
            label: '国内客户',
            key: 1
        }, {
            label: '国际客户',
            key: 2
        }];
    }

    /**
     * @implements
     * @description Determines whether tab change on
     * @param activeKey 
     */
    public onTabChange(activeKey: string): void {
        this.fetchTableData({});
    }

    /**
     * @implements
     * @description Renders filter components
     * @param item 
     * @returns filter components 
     */
    public renderFilterComponents(item: ITabItem): React.ReactNode[] {
        return [
            <Form.Item name="name" key="name">
                <Input placeholder="搜索客户名称关键词"/>
            </Form.Item>
        ];
    }
}

export default withRouter(withTranslation(['translation'])(ClientMngt));