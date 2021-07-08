/**
 * @author zyc
 * @copyright © 2021
 */

import { Button, FormItemProps, Input, Popconfirm, Space, TableColumnType, TablePaginationConfig, TableProps } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../../components/AbstractMngtComponent';
import { ITabItem } from '../../../components/ITabableComponent';
import RequestUtil from '../../../utils/RequestUtil';
import ComponentDetailsModal from './ComponentDetailsModal';
import TowerSectionModal from './TowerSectionModal';

export interface ITowerShapeMngtProps {}
export interface ITowerShapeMngtWithRouteProps extends RouteComponentProps<ITowerShapeMngtProps>, WithTranslation {}
export interface ITowerShapeMngtState extends IAbstractMngtComponentState {
    readonly tableDataSource: ITowerShape[];
    readonly selectedTowerKeys: React.Key[];
    readonly selectedTower: ITowerShape[];
}

export interface IResponseData {
    readonly id: number;
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly records: ITowerShape[];
}

interface ITowerShape {
    readonly id?: number | string;
    readonly status?: number;
    readonly internalNumber?: number | string;
}

 /**
  * 销售合同管理
  */
class TowerShapeMngt extends AbstractMngtComponent<ITowerShapeMngtWithRouteProps, ITowerShapeMngtState> {
    
    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): ITowerShapeMngtState {
        return {
            ...super.getState(),
            tableDataSource: []
        };
    }
 
    /**
     * @description Fetchs table data
     * @param filterValues 
     */
    protected async fetchTableData(filterValues: Record<string, any>,pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-market/contract', {
            ...filterValues,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize ||this.state.tablePagination?.pageSize,
            countryCode: this.state.selectedTabKey
        });
        if(resData?.records?.length == 0 && resData?.current>1){
            this.fetchTableData({},{
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
 
     /**
      * @override
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
            key: 'projectName',
            title: '塔型',
            dataIndex: 'projectName'
        }, {
            key: 'projectName',
            title: '钢印号',
            dataIndex: 'projectName'
        }, {
            key: 'projectName',
            title: '合同编号',
            dataIndex: 'projectName'
        }, {
            key: 'internalNumber',
            title: '内部合同编号',
            dataIndex: 'internalNumber',
            render: (_: undefined, record: object): React.ReactNode => {
            return <Link to={ `/prom/contract/detail/${ (record as ITowerShape).id }` }>{ (record as ITowerShape).internalNumber }</Link>
        }
        }, {
            key: 'projectName',
            title: '工程名称',
            dataIndex: 'projectName'
        }, {
            key: 'deliveryTime',
            title: '备注',
            dataIndex: 'deliveryTime'
        }, {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link"  href={ `/product/towershape/setting/${ (record as ITowerShape).id }` } disabled={ (record as ITowerShape).status === 1 }>
                        编辑
                    </Button>
                    <Popconfirm 
                        title="要删除该客户吗？" 
                        placement="topRight" 
                        okText="确认"
                        cancelText="取消"
                        onConfirm={ this.onDelete([record as ITowerShape]) }
                        disabled={ (record as ITowerShape).status === 1 }
                    >
                        <Button type="link" disabled={ (record as ITowerShape).status === 1 }>
                            删除
                        </Button>
                    </Popconfirm>
                    <Button type="link"  href={ `/prom/contract/setting/${ (record as ITowerShape).id }` } disabled={ (record as ITowerShape).status === 1 }>
                        变更
                    </Button>
                    <TowerSectionModal id={ (record as ITowerShape).id }/>
                    <Button type="link" href={ `/prom/contract/paymentRecord/${ (record as ITowerShape).id }` } disabled={ (record as ITowerShape).status === 0 }>导入图纸构建明细</Button>
                    <ComponentDetailsModal id={ (record as ITowerShape).id }
                    />
                </Space>
            )
        }];
    }

     /**
     * @implements
     * @description Determines whether table change on
     * @param pagination 
     */
    public onTableChange(pagination: TablePaginationConfig): void {
        this.fetchTableData({}, pagination);
    }
     
    /**
     * @implements
     * @description Determines whether filter submit on
     * @param values 
     */
    public async onFilterSubmit(values: Record<string, any>) {
        const tablePagination:TablePaginationConfig = {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: false
        }
        this.fetchTableData(values, tablePagination);
    }

    /**
     * @implements
     * @description Gets tab items
     * @returns tab items 
     */
    public getTabItems(): ITabItem[] {
        return [{
            label: '塔型列表',
            key: ""
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
     * @override
     * @description Gets table props
     * @param item 
     * @returns table props 
     */
     protected getTableProps(item: ITabItem): TableProps<object> {
        return {
            ...super.getTableProps(item),
            rowSelection: {
                selectedRowKeys: this.state.selectedTowerKeys,
                onChange: this.SelectChange
            }
        };
    }

    /**
     * @description Select change of role mngt
     */
     private SelectChange = (selectedRowKeys: React.Key[], selectedRows: object[]): void => {
        this.setState({
            selectedTowerKeys: selectedRowKeys,
            selectedTower: selectedRows as ITowerShape[]
        });
    }
    
    /**
     * @implements
     * @description Determines whether new click on
     * @param event 
     */
    public onNewClick(event: React.MouseEvent<HTMLButtonElement>): void {
        this.props.history.push('/product/towershape/new');
    }

    protected renderExtraOperationContent(item: ITabItem): React.ReactNode {
        return (
            <Space direction="horizontal" size="small">
                <Button type="primary" onClick={ this.onNewClick }>导入</Button>
                <Button type="ghost" onClick={ this.onNewClick }>导入模板下载</Button>
                <Button type="ghost" onClick={ this.onNewClick }>导出</Button>
                <Button type="ghost" onClick={ this.onNewClick }>新增</Button>
            </Space>
        );
    }

    /**
     * @description Determines whether delete on
     * @param item 
     * @returns delete 
     */
    private onDelete(items: ITowerShape[]): () => void {
        return async () => {
            await RequestUtil.delete(`/sinzetech-user/user?ids=${items.map<number>((item: ITowerShape): number => item?.id as number) }`);
            this.setState({
                selectedTower: [],
                selectedTowerKeys: []
            }, () => {
                this.fetchTableData({
                    
                });
            });
        };
    }
 
     /**
      * @implements
      * @description Renders filter components
      * @param item 
      * @returns filter components 
      */
    public getFilterFormItemProps(): FormItemProps[] {
        return [{
            name: 'internalNumber',
            children: <Input placeholder="合同编号关键字" maxLength={ 200 }/>
        },{
            name: 'internalNumber',
            children: <Input placeholder="内部合同编号关键字" maxLength={ 200 }/>
        },
        {
            name: 'projectName',
            children: <Input placeholder="工程名称关键字" maxLength={ 200 }/>
        },
        {
            name: 'customerCompany',
            children: <Input placeholder="塔型关键字" maxLength={ 200 }/>
        },
        {
            name: 'signCustomerName',
            children: <Input placeholder="钢印号关键字" maxLength={ 200 }/>
        }];
    }
 }
 
export default withRouter(withTranslation(['translation'])(TowerShapeMngt));
