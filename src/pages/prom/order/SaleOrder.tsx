import { FormItemProps, Input, Select, Space, TableColumnType, TablePaginationConfig } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../../components/AbstractMngtComponent';
import { ITabItem } from '../../../components/ITabableComponent';
import ConfirmableButton from '../../../components/ConfirmableButton';
import RequestUtil from '../../../utils/RequestUtil';

export interface IPromContractProps {}
export interface IPromContractWithRouteProps extends RouteComponentProps<IPromContractProps>, WithTranslation {}
export interface IPromContractState extends IAbstractMngtComponentState {
    readonly tableDataSource: ITableDataItem[];
}

interface ITableDataItem {
    readonly id: number;
    readonly ordersNumber: string;
    readonly internalNumber: string;
    readonly projectName: string;
    readonly chargeType: number;
    readonly customerCompany: string;
    readonly signCustomerName: string;
    readonly deliveryTime: string;
    readonly orderDeliveryTime: string;
}

export interface IResponseData {
    readonly id: number;
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly records: ITableDataItem[];
}

 /**
  * 销售合同管理
  */
class SaleOrder extends AbstractMngtComponent<IPromContractWithRouteProps, IPromContractState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): IPromContractState {
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
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-market/saleOrder', {
            ...filterValues,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize ||this.state.tablePagination?.pageSize,
            countryCode: this.state.selectedTabKey
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
            key: 'ordersNumber',
            title: '订单编号',
            dataIndex: 'ordersNumber',
            render: (_: undefined, record: object): React.ReactNode => {
                    return <Link to={ `/prom/contract/detail/${ (record as ITableDataItem).id }` }>{ (record as ITableDataItem).ordersNumber }</Link>
            }
        }, {
            key: 'internalNumber',
            title: '内部合同编号',
            dataIndex: 'internalNumber',
            render: (_: undefined, record: object): React.ReactNode => {
                return <Link to={ `/prom/contract/detail/${ (record as ITableDataItem).id }` }>{ (record as ITableDataItem).internalNumber }</Link>
            }
        }, {
            key: 'projectName',
            title: '工程名称',
            dataIndex: 'projectName'
        },  {
            key: 'customerCompany',
            title: '业主单位',
            dataIndex: 'customerCompany'
        },  {
            key: 'signCustomerName',
            title: '合同签订单位',
            dataIndex: 'signCustomerName'
        },  {
             key: 'chargeType',
             title: '计价方式',
             dataIndex: 'chargeType',
             render: (productType: number): React.ReactNode => {
                return  productType === 1 ? '订单总价、总重计算单价' : '产品单价、基数计算总价';
             }
         }, {
            key: 'deliveryTime',
            title: '合同交货日期',
            dataIndex: 'deliveryTime'
        }, {
            key: 'orderDeliveryTime',
            title: '订单交货日期',
            dataIndex: 'orderDeliveryTime'
        }, {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={ `/prom/order/setting/${ (record as ITableDataItem).id }` }>编辑</Link>
                    <ConfirmableButton confirmTitle="要删除该客户吗？" type="link" placement="topRight" onConfirm={ async () => {
                        let id = (record as ITableDataItem).id;
                        const resData:IResponseData = await RequestUtil.delete('/contract', {id: id})
                        console.log(resData)
                    } }>删除</ConfirmableButton>
                    <Link to={ `` }>变更产品信息</Link>
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
        this.fetchTableData(pagination);
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
            label: '全部',
            key: ""
        }, {
            label: '国内业务',
            key: 0
        }, {
            label: '国际业务',
            key: 1
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
     * @description Determines whether new click on
     * @param event 
     */
    public onNewClick(event: React.MouseEvent<HTMLButtonElement>): void {
        this.props.history.push('/prom/order/new');
    }
 
     /**
      * @implements
      * @description Renders filter components
      * @param item 
      * @returns filter components 
      */
    public getFilterFormItemProps(item: ITabItem): FormItemProps[] {
        return [{
            name: 'ordersNumber',
            children: <Input placeholder="订单编号关键词"/>
        },
        {
            name: 'internalNumber',
            children: <Input placeholder="内部合同编号关键词"/>
        },
        {
            name: 'projectName',
            children: <Input placeholder="工程名称关键词"/>
        },
        {
            name: 'customerCompany',
            children: <Input placeholder="业主单位关键词"/>
        },
        {
            name: 'signCustomerName',
            children: <Input placeholder="合同签订单位关键词"/>
        }];
    }
}

export default withRouter(withTranslation(['translation'])(SaleOrder));