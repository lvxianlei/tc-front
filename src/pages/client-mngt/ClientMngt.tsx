/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { FormItemProps, Input, Space, TableColumnType, TablePaginationConfig } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { clientTypeOptions } from '../../configuration/DictionaryOptions';
import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../components/AbstractMngtComponent';
import ConfirmableButton from '../../components/ConfirmableButton';
import { ITabItem } from '../../components/ITabableComponent';
import { IClient } from '../../configuration/IClient';
import RequestUtil from '../../utils/RequestUtil';

export interface IClientMngtProps {}
export interface IClientMngtWithRouteProps extends RouteComponentProps<IClientMngtProps>, WithTranslation {}
export interface IClientMngtState extends IAbstractMngtComponentState {
    readonly tableDataSource: IClient[];
    readonly name?: string;
}

interface IResponseData {
    readonly current: number;
    readonly size: number;
    readonly total: number;
    readonly records: IClient[]
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
            name: '',
            tableDataSource: []
        };
    }

    /**
     * @protected
     * @description Fetchs table data
     * @param filterValues 
     * @param [pagination] 
     */
    protected async fetchTableData(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-customer/customer', {
            ...filterValues,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize ||this.state.tablePagination?.pageSize,
            type: this.state.selectedTabKey
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
    public getTableDataSource(item: ITabItem): IClient[] {
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
            key: 'type',
            title: '客户类型',
            dataIndex: 'type',
            render: (type: number): React.ReactNode => {
                return  type == 1 ? '国内客户' : '国际客户';
            }
        }, {
            key: 'linkman',
            title: '重要联系人',
            dataIndex: 'linkman'
        }, {
            key: 'phone',
            title: '手机号码',
            dataIndex: 'phone'
        }, {
            key: 'description',
            title: '备注',
            dataIndex: 'description'
        }, {
            key: 'createTime',
            title: '创建时间',
            dataIndex: 'createTime'
        }, {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={ `/client/mngt/setting/${ (record as IClient).id }` }>编辑</Link>
                    <ConfirmableButton 
                        confirmTitle="要删除该客户吗？" 
                        type="link" 
                        placement="topRight"
                        onConfirm={ async () => {
                            await RequestUtil.delete(`/tower-customer/customer?customerId=${ (record as IClient).id }`);
                            this.fetchTableData({});
                        } }
                    >
                        删除
                    </ConfirmableButton>
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
        this.fetchTableData({ name: this.state.name }, pagination);
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
        let tab = [{
            label: '全部客户',
            key: ''
        }];
        if(clientTypeOptions){
            clientTypeOptions.map(item =>{
                 tab.push({
                    key: item.id,
                    label: item.name,
                }) 
            })
        }

        return tab;
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
        this.props.history.push('/client/mngt/new');
    }

    /**
     * @implements
     * @description Gets filter form item props
     * @param item 
     * @returns filter form item props 
     */
    public getFilterFormItemProps(item: ITabItem): FormItemProps[] {
        return [{
            name: 'name',
            children: <Input placeholder="搜索客户名称关键词" maxLength={ 200 }/>
        }];
    }
}

export default withRouter(withTranslation(['translation'])(ClientMngt));