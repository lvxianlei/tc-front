 import { FormItemProps, Input, Space, TableColumnType, TablePaginationConfig, Select } from 'antd';
 import React from 'react';
 import { WithTranslation, withTranslation } from 'react-i18next';
 import { RouteComponentProps, withRouter } from 'react-router';
 import { Link } from 'react-router-dom';
 
 import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../components/AbstractMngtComponent';
 import ConfirmableButton from '../../components/ConfirmableButton';
 import { ITabItem } from '../../components/ITabableComponent';
 import RequestUtil from '../../utils/RequestUtil';
 
 const { Option } = Select;
 export interface ITaskMngtProps {}
 export interface ITaskMngtWithRouteProps extends RouteComponentProps<ITaskMngtProps>, WithTranslation {}
 export interface ITaskMngtState extends IAbstractMngtComponentState {
     readonly tableDataSource: ITableDataItem[];
     readonly name?: string;
 }
 
 interface ITableDataItem {
     readonly id: number;
     readonly tenantId: number;
     readonly name: string;
     readonly type: number;
     readonly linkman: string;
     readonly phone: string;
     readonly description: string;
     readonly createTime: string;
 }
 
 interface IResponseData {
     readonly current: number;
     readonly size: number;
     readonly total: number;
     readonly records: ITableDataItem[]
 }
 
 /**
  * Task Management
  */
 class TaskMngt extends AbstractMngtComponent<ITaskMngtWithRouteProps, ITaskMngtState> {
 
     /**
      * @override
      * @description Gets state
      * @returns state 
      */
     protected getState(): ITaskMngtState {
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
         const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-customer/customer/page', {
             ...filterValues,
             current: pagination.current || this.state.tablePagination.current,
             size: pagination.pageSize ||this.state.tablePagination.pageSize,
             type: this.state.selectedTabKey
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
     public getTableDataSource(item: ITabItem): ITableDataItem[] {
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
                 return  type === 1 ? '国内客户' : '国际客户';
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
                     <Link to={ `/client/mngt/setting/${ (record as ITableDataItem).id }` }>编辑</Link>
                     <ConfirmableButton confirmTitle="要删除该客户吗？" type="link" placement="topRight">删除</ConfirmableButton>
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
             key: 0
         }, {
             label: '审批中',
             key: 1
         }, {
             label: '已驳回',
             key: 2
         }, {
             label: '已通过',
             key: 3
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
             children:  <Select defaultValue="0">
                            <Option value="0">全部</Option>
                            <Option value="1">产品信息变更审批</Option>
                            <Option value="2">任务单产品信息审批</Option>
                        </Select>
         }];
     }
 }
 
 export default withRouter(withTranslation(['translation'])(TaskMngt));