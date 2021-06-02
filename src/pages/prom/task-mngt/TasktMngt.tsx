import { FormItemProps, Input, Select, Space, TableColumnType, TablePaginationConfig } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../../components/AbstractMngtComponent';
import { ITabItem } from '../../../components/ITabableComponent';
import RequestUtil from '../../../utils/RequestUtil';


 export interface ITaskMngtProps {}
 export interface ITaskMngtWithRouteProps extends RouteComponentProps<ITaskMngtProps>, WithTranslation {}
 export interface ITaskMngtState extends IAbstractMngtComponentState {
     readonly tableDataSource: ITaskTableDataItem[];
 }

 interface ITaskTableDataItem {
     readonly id: number;
     readonly internalNumber: string;
     readonly materialDemand: string;
     readonly materialStandard: number;
     readonly planDeliveryTime: number;
     readonly deliveryTime: string;
     readonly projectName: string;
     readonly saleOrderNumber: string;
     readonly taskNumber: string;
     readonly taskReviewStatus: number;
 }
 
 interface IResponseData {
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly hitCount: boolean;
    readonly pages: number;
    readonly records: ITaskTableDataItem[];
 }

 /**
  * 销售任务单管理
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
            tableDataSource: []
        };
    }
 
     /**
      * @description Fetchs table data
      * @param filterValues 
      */
     protected async fetchTableData(filterValues: Record<string, any>,pagination: TablePaginationConfig = {}) {
         const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-market/taskNotice/page', {
             ...filterValues,
             current: pagination.current || this.state?.tablePagination?.current,
             size: pagination.pageSize ||this.state?.tablePagination?.pageSize,
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
            key: 'taskNumber',
            title: '任务编号',
            dataIndex: 'taskNumber',
            render: (taskNumber: number): React.ReactNode => {
                 return <Link to= {`/prom/task/view/1` }>{taskNumber}</Link>
            }
        },  {
            key: 'saleOrderNumber',
            title: '订单编号',
            dataIndex: 'saleOrderNumber',
            render: (saleOrderNumber: number): React.ReactNode => {
                 return <Link to="">{saleOrderNumber}</Link>
            }
        },  {
            key: 'internalNumber',
            title: '合同编号',
            dataIndex: 'internalNumber',
            render: (internalNumber: number): React.ReactNode => {
                 return <Link to="">{internalNumber}</Link>
            }
        },  {
            key: 'projectName',
            title: '工程名称',
            dataIndex: 'projectName'
        },  {
            key: 'materialStandard',
            title: '原材料标准',
            dataIndex: 'materialStandard'
        },  {
            key: 'materialDemand',
            title: '原材料要求',
            dataIndex: 'materialDemand'
        },  {
            key: 'deliveryTime',
            title: '客户交货日期',
            dataIndex: 'deliveryTime'
        },  {
            key: 'planDeliveryTime',
            title: '计划交货日期',
            dataIndex: 'planDeliveryTime'
        },  {
            key: 'taskReviewStatus',
            title: '审批状态',
            dataIndex: 'taskReviewStatus',
            render: (taskReviewStatus: number): React.ReactNode => {
                return  taskReviewStatus === 0 ? '待审批' : taskReviewStatus === 1? '已通过 ' : '已驳回';
            }
        }, {
             key: 'operation',
             title: '操作',
             dataIndex: 'operation',
             render: (_: undefined, record: object): React.ReactNode => (
                 <Space direction="horizontal" size="small">
                     <Link to={ `/prom/task/edit/${ (record as ITaskTableDataItem).id }` }>编辑</Link>
                     <Link to="">删除</Link>
                     <Link to={ `/prom/task/special/${ (record as ITaskTableDataItem).id }` }>完善特殊要求</Link>
                     {
                        (record as ITaskTableDataItem).taskReviewStatus===1? 
                        <Link to={ `/prom/task/product/${ (record as ITaskTableDataItem).id }` }>完善产品信息</Link>
                        :<Link to={ `/prom/task/product/${ (record as ITaskTableDataItem).id }` }>变更产品信息</Link>
                     }
                     
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
             label: '审批中',
             key: 0
         }, {
             label: '已驳回',
             key: 1
         }, {
             label: '已通过',
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
     * @description Determines whether new click on
     * @param event 
     */
    public onNewClick(event: React.MouseEvent<HTMLButtonElement>): void {
        this.props.history.push('/prom/task/new');
    }
 
     /**
      * @implements
      * @description Renders filter components
      * @param item 
      * @returns filter components 
      */
     public getFilterFormItemProps(item: ITabItem): FormItemProps[] {
        return [
            {
                name: 'taskNumber',
                children: <Input placeholder="任务单编号关键字"/>
            },
            {
               name: 'internalNumber',
               children: <Input placeholder="内部合同编号关键字"/>
           },
           {
               name: 'saleOrderNumber',
               children: <Input placeholder="订单编号关键字"/>
           },
           {
               name: 'projectName',
               children: <Input placeholder="工程名称关键字"/>
           }
        ];
     }
 }
 
 export default withRouter(withTranslation(['translation'])(TaskMngt));