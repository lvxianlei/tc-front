import { FormItemProps, Input, Select, Space, TableColumnType, TablePaginationConfig } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../../components/AbstractMngtComponent';
import { ITabItem } from '../../../components/ITabableComponent';
import ConfirmableButton from '../../../components/ConfirmableButton';
import RequestUtil from '../../../utils/RequestUtil';
import AuthorityComponent from '../../../components/AuthorityComponent';

export interface IPromContractProps {}
export interface IPromContractWithRouteProps extends RouteComponentProps<IPromContractProps>, WithTranslation {}
export interface IPromContractState extends IAbstractMngtComponentState {
    readonly tableDataSource: ITableDataItem[];
    readonly saleOrderNumber?: string;
    readonly internalNumber?: string;
    readonly projectName?: string;
    readonly customerCompany?: string;
    readonly signCustomerName?: string;
}

interface ITableDataItem {
    readonly id: number;
    readonly saleOrderNumber: string;
    readonly internalNumber: string;
    readonly projectName: string;
    readonly chargeType: number;
    readonly customerCompany: string;
    readonly signCustomerName: string;
    readonly deliveryTime: string;
    readonly orderDeliveryTime: string;
    readonly contractId: string;
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
            key: 'saleOrderNumber',
            title: '订单编号',
            dataIndex: 'saleOrderNumber',
            render: (_: undefined, record: object): React.ReactNode => {
                    return <Link to={ `/prom/order/detail/${ (record as ITableDataItem).id }` }>{ (record as ITableDataItem).saleOrderNumber }</Link>
            }
        }, {
            key: 'internalNumber',
            title: '内部合同编号',
            dataIndex: 'internalNumber',
            render: (_: undefined, record: object): React.ReactNode => {
                return <Link to={ `/prom/contract/detail/${ (record as ITableDataItem).contractId }` }>{ (record as ITableDataItem).internalNumber }</Link>
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
                return  productType === 0 ? '订单总价、总重计算单价' : '产品单价、基数计算总价';
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
                    <AuthorityComponent permissions="sale_order_del">
                        <ConfirmableButton confirmTitle="要删除该订单吗？" type="link" placement="topRight" onConfirm={ async () => {
                            let id = (record as ITableDataItem).id;
                            const resData:IResponseData = await RequestUtil.delete(`/tower-market/saleOrder?id=${ id }`);
                            this.fetchTableData({});
                        } }>删除</ConfirmableButton>
                    </AuthorityComponent>
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
        this.fetchTableData({
            saleOrderNumber: this.state.saleOrderNumber,
            internalNumber: this.state.internalNumber,
            projectName: this.state.projectName,
            customerCompany: this.state.customerCompany,
            signCustomerName: this.state.signCustomerName
        }, pagination);
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
            label: '销售订单列表',
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
            name: 'saleOrderNumber',
            children: <Input placeholder="订单编号关键词" maxLength={ 200 } autoComplete="off"/>
        },
        {
            name: 'internalNumber',
            children: <Input placeholder="内部合同编号关键词" maxLength={ 200 } autoComplete="off"/>
        },
        {
            name: 'projectName',
            children: <Input placeholder="工程名称关键词" maxLength={ 200 } autoComplete="off"/>
        },
        {
            name: 'customerCompany',
            children: <Input placeholder="业主单位关键词" maxLength={ 200 } autoComplete="off"/>
        },
        {
            name: 'signCustomerName',
            children: <Input placeholder="合同签订单位关键词" maxLength={ 200 } autoComplete="off"/>
        }];
    }
}

export default withRouter(withTranslation(['translation'])(SaleOrder));