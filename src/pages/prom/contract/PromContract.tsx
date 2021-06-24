import { Button, Form, FormItemProps, Input, Popconfirm, Select, Space, TableColumnType, TablePaginationConfig } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import styles from '../../../components/AbstractSelectableModal.module.less';
import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../../components/AbstractMngtComponent';
import { ITabItem } from '../../../components/ITabableComponent';
import { winBidTypeOptions } from '../../../configuration/DictionaryOptions';
import RequestUtil from '../../../utils/RequestUtil';

const { Option } = Select;

export interface IPromContractProps {}
export interface IPromContractWithRouteProps extends RouteComponentProps<IPromContractProps>, WithTranslation {}
export interface IPromContractState extends IAbstractMngtComponentState {
    readonly tableDataSource: ITableDataItem[];
}

interface ITableDataItem {
    readonly id: number;
    readonly contractNumber: string;
    readonly internalNumber: string;
    readonly projectName: string;
    readonly saleType: number;
    readonly winBidType: number;
    readonly productType: number;
    readonly voltageGrade: number;
    readonly saleTypeName: string;
    readonly winBidTypeName: string;
    readonly productTypeName: string;
    readonly voltageGradeName: string;
    readonly customerCompany: string;
    readonly signCustomerName: string;
    readonly deliveryTime: string;
    readonly status: number;
    readonly signCustomerId?: string;
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
class PromContract extends AbstractMngtComponent<IPromContractWithRouteProps, IPromContractState> {
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
            key: 'contractNumber',
            title: '合同编号',
            dataIndex: 'contractNumber',
            render: (_: undefined, record: object): React.ReactNode => {
                return <Link to={ `/prom/contract/detail/${ (record as ITableDataItem).id }` }>{ (record as ITableDataItem).contractNumber }</Link>
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
        }, {
            key: 'saleTypeName',
            title: '销售类型',
            dataIndex: 'saleTypeName'
        }, {
            key: 'winBidTypeName',
            title: '中标类型',
            dataIndex: 'winBidTypeName',
        }, {
            key: 'productTypeName',
            title: '产品类型',
            dataIndex: 'productTypeName',
        },  {
            key: 'voltageGradeName',
            title: '电压等级（KV）',
            dataIndex: 'voltageGradeName',
        },  {
            key: 'customerCompany',
            title: '业主单位',
            dataIndex: 'customerCompany'
        },  {
            key: 'signCustomerName',
            title: '合同签订单位',
            dataIndex: 'signCustomerName'
        },  {
            key: 'deliveryTime',
            title: '要求收货日期',
            dataIndex: 'deliveryTime'
        }, {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link"  href={ `/prom/contract/setting/${ (record as ITableDataItem).id }` } disabled={ (record as ITableDataItem).status === 1 }>
                        编辑
                    </Button>
                    <Popconfirm 
                        title="要删除该客户吗？" 
                        placement="topRight" 
                        okText="确认"
                        cancelText="取消"
                        onConfirm={ async () => {
                            let id = (record as ITableDataItem).id;
                            const resData:IResponseData = await RequestUtil.delete(`/tower-market/contract?id=${ id }`);
                            this.fetchTableData({});
                        } }
                        disabled={ (record as ITableDataItem).status === 1 }
                    >
                        <Button type="link" disabled={ (record as ITableDataItem).status === 1 }>
                            删除
                        </Button>
                    </Popconfirm>
                    <Button type="link" href={ `/prom/contract/paymentRecord/${ (record as ITableDataItem).id }/${ (record as ITableDataItem).projectName }/${ (record as ITableDataItem).signCustomerId }/${ (record as ITableDataItem).signCustomerName }` } disabled={ (record as ITableDataItem).status === 0 }>添加回款记录</Button>
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
        this.props.history.push('/prom/contract/new');
    }
 
     /**
      * @implements
      * @description Renders filter components
      * @param item 
      * @returns filter components 
      */
    public getFilterFormItemProps(item: ITabItem): FormItemProps[] {
        return [{
            name: 'internalNumber',
            children: <Input placeholder="内部合同编号关键词" maxLength={ 200 }/>
        },
        {
            name: 'projectName',
            children: <Input placeholder="工程名称关键词" maxLength={ 200 }/>
        },
        {
            name: 'customerCompany',
            children: <Input placeholder="业主单位关键词" maxLength={ 200 }/>
        },
        {
            name: 'signCustomerName',
            children: <Input placeholder="合同签订单位关键词" maxLength={ 200 }/>
        },
        {
            name: 'winBidType',
            children: 
                <Select placeholder="请选择中标类型" className={ styles.select_width }>
                    { winBidTypeOptions && winBidTypeOptions.map(({ id, name }, index) => {
                        return <Option key={ index } value={ id }>
                            { name }
                        </Option>
                    }) }
                </Select>
            
        }];
    }
 }
 
export default withRouter(withTranslation(['translation'])(PromContract));
