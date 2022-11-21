/**
 * @author lxl
 * @copyright © 2021 
 */
// 整个common文件夹为让原继承形式组件可以通过传递参数形式复用。
// 此组件为table页改造
import React, { ReactNode } from 'react'
import { TablePaginationConfig, TableColumnType, TableProps, FormItemProps, Space, Button } from 'antd'
import { RouteComponentProps, withRouter } from 'react-router'
import { WithTranslation, withTranslation } from 'react-i18next'
import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../components/AbstractMngtComponent'
import { ITabItem } from '../../components/ITabableComponent'
import RequestUtil from '../../utils/RequestUtil'
import { IClient } from '../IClient'
// import '../../components/AbstractMngtComponent.module.less'
import ExportList from '../../components/export/list'
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
    readonly exportPath?: string; //导出接口
    sourceKey?: string,
    isSunmryLine?: (result: IResponseData) => void;//添加计算行
    exportObject?: { [key: string]: any }, // 导出可能会包含的id等
    clearSearch?: boolean;
    pageSize?: number;  //条数
}
export interface IResponseData {
    readonly current: number;
    readonly size: number;
    readonly total: number;
    readonly records: IClient[];
}

interface PageState extends IAbstractMngtComponentState {
    name: string
    tableDataSource: object[]
    resData: any
    readonly selectedUserKeys: []
    readonly selectedUsers: []
    readonly isExport?: boolean;
}

class Page extends AbstractMngtComponent<PageProps, PageState> {

    constructor(props: PageProps) {
        super(props)
    }

    protected getState(): PageState {
        return {
            ...super.getState(),
            name: '',
            tableDataSource: [],
            isExport: false
        };
    }
    componentWillUnmount() {
        this.setState = () => false
    }
    /**
     * 根据传递的sourceKey对数据结构进行处理
     * @param resData 
     * @returns 
     */
    public getHierarchy = (resData: IResponseData) => {
        const dataKey: string[] = this.props.sourceKey?.split(".").filter((item: any) => item !== this.props.sourceKey?.split(".")[this.props.sourceKey?.split(".").length - 1]) || [];
        const result = this.props.sourceKey ? dataKey.reduce((acc: any, key: any) => {
            return acc && key in acc ? acc[key] : null;
        },
            (resData as any)) : resData.records || resData;
        return result;
    }

    protected async fetchTableData(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
        this.setState({ loading: true })
        try {
            const sourceDataKey: string[] = this.props.sourceKey?.split(".") || []
            const resData: IResponseData = await RequestUtil.get<IResponseData>(this.props.path, {
                current: pagination.current || this.state.tablePagination?.current,
                size: pagination.pageSize || this.state.tablePagination?.pageSize,
                type: this.state.selectedTabKey === 'item_0' ? '' : this.state.selectedTabKey,
                ...this.props.requestData,
                ...filterValues,
            })
            let result = this.props.sourceKey ? this.getHierarchy(resData) : resData;
            this.setState({
                ...filterValues,
                resData,
                tableDataSource: this.props.sourceKey ? sourceDataKey.reduce((acc, key) => {
                    return acc && key in acc ? acc[key] : null;
                },
                    (resData as any)) : resData.records || resData,
                tablePagination: {
                    ...this.state.tablePagination,
                    current: this.props.sourceKey ? result.current : resData.current,
                    pageSize: this.props.sourceKey ? result.size : resData.size,
                    total: this.props.sourceKey ? result.total : resData.total
                },
                loading: false
            });
        } catch (error) {
            this.setState({ loading: false })
            console.log(error)
        }
    }

    public async componentDidMount() {
        this.fetchTableData({ ...this.props.filterValue }, { pageSize: this.props?.pageSize });
    }

    public async componentDidUpdate(nextProps: any) {
        if (nextProps.refresh !== this.props.refresh) {
            this.fetchTableData({ ...this.props.filterValue }, { current: 1, pageSize: 20 })
        }
        if (nextProps.filterValue !== this.props.filterValue) {
            this.fetchTableData({ ...this.props.filterValue }, { current: 1, pageSize: 20 })
        }
        if (nextProps.clearSearch !== this.props.clearSearch) {
            this.clearFormProps()
        }
    }

    public getTableDataSource(item: ITabItem): IClient[] {
        return this.state.tableDataSource;
    }

    public getTableColumns(): any[] {
        return this.props.columns || []
    }

    public onTableChange(pagination: TablePaginationConfig): void {
        this.fetchTableData({ ...this.props.filterValue }, pagination);
    }

    public async onFilterSubmit(values: Record<string, any>) {
        const tablePagination: TablePaginationConfig = {
            current: 1,
            pageSize: this.props?.pageSize || 20,
            total: 0,
            showSizeChanger: false
        }
        const postValue: any = this.props.onFilterSubmit && this.props.onFilterSubmit(values)
        this.fetchTableData({ ...postValue, ...this.props.filterValue }, tablePagination);
    }

    public getTabItems(): ITabItem[] {
        let tab = [{ label: '', key: 'item_0' }]
        return this.props.headTabs ? [tab[0], ...this.props.headTabs] : tab;
    }

    protected renderExtraOperationContent(): React.ReactNode {
        return (
            <>
                {
                    (this.props.extraOperation || this.props.exportPath) && (
                        <Space direction="horizontal" size="middle" style={{ width: "100%", marginBottom: "12px" }}>
                            {this.props.exportPath && <Button type="primary" ghost onClick={() => {
                                this.setState({
                                    isExport: true
                                })
                            }}>导出</Button>}
                            {typeof this.props.extraOperation === "function" ? this.props.extraOperation(this.state.resData) : this.props.extraOperation}
                        </Space>
                    )
                }

                {this.state.isExport ? <ExportList
                    history={this.props.history}
                    location={this.props.location}
                    match={this.props.match}
                    columnsKey={() => {
                        const keys = [...this.getTableColumns()]
                        if (!!(keys[keys.length - 1].dataIndex === 'operation')) {
                            keys.pop()
                        }
                        return keys
                    }}
                    current={this.state.tablePagination?.current || 1}
                    size={this.state.tablePagination?.pageSize || 10}
                    total={this.state.tablePagination?.total || 0}
                    url={this.props.exportPath}
                    serchObj={{
                        ...JSON.parse(JSON.stringify(this.props.filterValue || {})),
                        ...JSON.parse(JSON.stringify(this.props?.requestData || {})),
                        ...JSON.parse(JSON.stringify(this.props?.exportObject || {}))
                    }}
                    closeExportList={() => {
                        this.setState({
                            isExport: false
                        })
                    }}
                /> : null}
            </>
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
            ...this.props.tableProps,
            pagination: this.props.tableProps?.pagination === false ? false : {
                ...super.getTableProps(item).pagination,
                ...this.props.tableProps?.pagination,
            }
        }
    }

    public getFilterFormItemProps(item: ITabItem): FormItemProps[] {
        return this.props.searchFormItems || []
    }

    public clearFormProps(): void {
        this.getForm()?.resetFields();
    }

}

export default withRouter(withTranslation('translation')(Page))