/**
 * @author lxl
 * @copyright © 2021 
 */
// 整个common文件夹为让原继承形式组件可以通过传递参数形式复用。
// 此组件为table页改造
import React, { ReactNode } from 'react'
import { TablePaginationConfig, TableColumnType, TableProps, FormItemProps, Space } from 'antd'
import { RouteComponentProps, withRouter } from 'react-router'
import { WithTranslation, withTranslation } from 'react-i18next'
import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../components/AbstractMngtComponent'
import { generateRender } from "./CommonTable"
import { ITabItem } from '../../components/ITabableComponent'
import RequestUtil from '../../utils/RequestUtil'
import { IClient } from '../IClient'
import '../../components/AbstractMngtComponent.module.less'
export interface PageProps extends RouteComponentProps, WithTranslation {
    path: string
    columns: TableColumnType<object>[]
    extraOperation?: ReactNode | ((data: any) => ReactNode)
    tableProps?: TableProps<any>
    searchFormItems: FormItemProps[]
    headTabs?: ITabItem[]
    onFilterSubmit?(values: Record<string, any>): Record<string, any>
    requestData?: {}
    refresh?: boolean//刷新
    filterValue?: {} //查询条件
    sourceKey?: string
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
    resData: any
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
        try {
            const sourceDataKey: string[] = this.props.sourceKey?.split(".") || []
            const resData: IResponseData = await RequestUtil.get<IResponseData>(this.props.path, {
                ...this.props.requestData,
                ...filterValues,
                current: pagination.current || this.state.tablePagination?.current,
                size: pagination.pageSize || this.state.tablePagination?.pageSize,
                type: this.state.selectedTabKey === 'item_0' ? '' : this.state.selectedTabKey
            })
            this.setState({
                ...filterValues,
                resData,
                tableDataSource: this.props.sourceKey ? sourceDataKey.reduce((acc, key) => {
                    return acc && key in acc ? acc[key] : null;
                }, (resData as any)) : resData.records || resData,
                tablePagination: {
                    ...this.state.tablePagination,
                    current: resData.current,
                    pageSize: resData.size,
                    total: resData.total
                }
            });
        } catch (error) {
            console.log(error)
        }
    }

    public async componentDidMount() {
        this.fetchTableData({ ...this.props.filterValue });
    }

    public async componentDidUpdate(nextProps: any) {
        if (nextProps.refresh !== this.props.refresh) {
            this.fetchTableData({...this.props.filterValue}, { current: 1, pageSize: 20 })
        }
    }

    public getTableDataSource(item: ITabItem): IClient[] {
        return this.state.tableDataSource;
    }

    public getTableColumns(): TableColumnType<object>[] {
        return (this.props.columns || []).map((item: any) => generateRender(item.type || "text", item))
    }

    public onTableChange(pagination: TablePaginationConfig): void {
        console.log(this.props.filterValue)
        this.fetchTableData({ ...this.props.filterValue }, pagination);
    }

    public async onFilterSubmit(values: Record<string, any>) {
        const tablePagination: TablePaginationConfig = {
            current: 1,
            pageSize: 20,
            total: 0,
            showSizeChanger: false
        }
        const postValue: any = this.props.onFilterSubmit && this.props.onFilterSubmit(values)
        this.fetchTableData(postValue, tablePagination);
    }

    public getTabItems(): ITabItem[] {
        let tab = [{ label: '', key: 'item_0' }]
        return this.props.headTabs ? [tab[0], ...this.props.headTabs] : tab;
    }

    protected renderExtraOperationContent(): React.ReactNode {
        return (
            <Space direction="horizontal" size="middle" className="ttt">
                {typeof this.props.extraOperation === "function" ? this.props.extraOperation(this.state.resData) : this.props.extraOperation}
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
        return this.props.searchFormItems || []
    }

}

export default withRouter(withTranslation('translation')(Page))