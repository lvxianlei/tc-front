/**
 * @author lxl
 * @copyright © 2021 
 */
// 整个common文件夹为让原继承形式组件可以通过传递参数形式复用。
// 此组件为table页改造
import React, { ReactNode } from 'react'
import { TablePaginationConfig, TableColumnType, TableProps, FormItemProps, Space, Input } from 'antd'
import { RouteComponentProps, withRouter } from 'react-router'
import { WithTranslation, withTranslation } from 'react-i18next'
import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../components/AbstractMngtComponent'
import { ITabItem } from '../../components/ITabableComponent'
import { clientTypeOptions } from '../../configuration/DictionaryOptions';
import RequestUtil from '../../utils/RequestUtil'
import { IClient } from '../IClient'
export interface PageProps extends RouteComponentProps, WithTranslation {
    path: string
    columns: TableColumnType<object>[]
    extraOperation?: ReactNode
    tableProps?: TableProps<any>
}

export interface IResponseData {
    readonly current: number;
    readonly size: number;
    readonly total: number;
    readonly records: IClient[]
}

interface PageState extends IAbstractMngtComponentState {
    name: string
    tableDataSource: object[]
    readonly selectedUserKeys: []
    readonly selectedUsers: []
}

class Page extends AbstractMngtComponent<PageProps, PageState> {

    constructor(props: PageProps) {
        super(props)
    }

    protected getState(): PageState {
        return {
            ...super.getState(),
            name: '',
            tableDataSource: []
        };
    }

    protected async fetchTableData(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>(this.props.path, {
            ...filterValues,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize || this.state.tablePagination?.pageSize,
            type: this.state.selectedTabKey === 'item_0' ? '' : this.state.selectedTabKey
        });
        if (resData?.records?.length == 0 && resData?.current > 1) {
            this.fetchTableData({}, {
                current: resData.current - 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: false
            });
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

    public async componentDidMount() {
        super.componentDidMount();
        this.fetchTableData({});
    }

    public getTableDataSource(item: ITabItem): IClient[] {
        return this.state.tableDataSource;
    }

    public getTableColumns(): TableColumnType<object>[] {
        return this.props.columns || []
    }

    public onTableChange(pagination: TablePaginationConfig): void {
        this.fetchTableData({ name: this.state.name }, pagination);
    }

    public async onFilterSubmit(values: Record<string, any>) {
        const tablePagination: TablePaginationConfig = {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: false
        }
        this.fetchTableData(values, tablePagination);
    }

    public getTabItems(): ITabItem[] {
        let tab = [{
            label: '全部客户',
            key: 'item_0'
        }];
        if (clientTypeOptions) {
            clientTypeOptions.map(item => {
                tab.push({
                    key: item.id,
                    label: item.name,
                })
            })
        }

        return tab;
    }

    protected renderExtraOperationContent(): React.ReactNode {
        return (
            <Space direction="horizontal" size="middle">
                {this.props.extraOperation!}
            </Space>
        );
    }

    public onTabChange(activeKey: string): void {
        this.fetchTableData({});
    }

    public onNewClick(event: React.MouseEvent<HTMLButtonElement>): void {
        this.props.history.push('/bidding/information/new');
    }

    protected getTableProps(item: ITabItem): TableProps<object> {
        return {
            ...super.getTableProps(item),
            ...this.props.tableProps
        }
    }

    public getFilterFormItemProps(item: ITabItem): FormItemProps[] {
        return [{
            name: 'name',
            children: <Input placeholder="搜索客户名称关键词" maxLength={200} />
        }];
    }

}

export default withRouter(withTranslation('translation')(Page))