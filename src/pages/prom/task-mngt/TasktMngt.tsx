import { FormItemProps, Input, Button, Space, TableColumnType, TablePaginationConfig, Select } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import ConfirmableButton from '../../../components/ConfirmableButton';
import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../../components/AbstractMngtComponent';
import { ITabItem } from '../../../components/ITabableComponent';
import RequestUtil from '../../../utils/RequestUtil';
import { ITask } from '../../../configuration/ITask';

 export interface ITaskMngtProps {}
 export interface ITaskMngtWithRouteProps extends RouteComponentProps<ITaskMngtProps>, WithTranslation {}
 export interface ITaskMngtState extends IAbstractMngtComponentState {
     readonly tableDataSource: ITask[];
 }
 
 interface IResponseData {
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly hitCount: boolean;
    readonly pages: number;
    readonly records: ITask[];
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
         const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-market/taskNotice', {
             ...filterValues,
             current: pagination.current || this.state?.tablePagination?.current,
             size: pagination.pageSize ||this.state?.tablePagination?.pageSize,
             taskReviewStatus: this.state.selectedTabKey
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
            key: 'taskNumber',
            title: '任务编号',
            dataIndex: 'taskNumber',
            render: (taskNumber:number, record: object): React.ReactNode => {
                 return <Link to= {`/prom/task/view/${ (record as ITask).id }` }>{taskNumber}</Link>
            }
        },  {
            key: 'saleOrderNumber',
            title: '订单编号',
            dataIndex: 'saleOrderNumber',
            render: (saleOrderNumber: number, record: object): React.ReactNode => {
                 return <Link to= {`/prom/order/detail/${ (record as ITask).saleOrderId }` }>{saleOrderNumber}</Link>
            } 
        },  {
            key: 'internalNumber',
            title: '合同编号',
            dataIndex: 'internalNumber',
            render: (internalNumber: number,record: object): React.ReactNode => {
                 return <Link to={ `/prom/contract/detail/${ (record as ITask).contractId }` }>{ internalNumber}</Link>
            }
        },  {
            key: 'projectName',
            title: '工程名称',
            dataIndex: 'projectName'
        },  {
            key: 'materialStandardName',
            title: '原材料标准',
            dataIndex: 'materialStandardName'
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
                return  taskReviewStatus > -1 ? taskReviewStatus === 0 ? '审批中' : taskReviewStatus === 1? '已通过 ' : '已驳回': '-';
            }
        }, {
             key: 'operation',
             title: '操作',
             dataIndex: 'operation',
             render: (_: undefined, record: object): React.ReactNode => (
                 <Space direction="horizontal" size="small">
                    <Button type="link"  href={ `/prom/task/edit/${ (record as ITask).id }` } disabled={ (record as ITask).status !== 1 }>
                        编辑
                    </Button>
                    <ConfirmableButton confirmTitle="要删除该数据吗？" type="link" placement="topRight" onConfirm={() => this.handleDelete(record)} >
                        <Button type="link" disabled={ (record as ITask).status !== 1 }>
                            删除
                        </Button>
                    </ConfirmableButton>
                    <Button type="link"  href={ `/prom/task/special/${ (record as ITask).id }` } disabled={ (record as ITask).status !== 2 }>
                        完善特殊要求
                    </Button>
                     {
                        (record as ITask).status !==4 ? 
                        <Button type="link"  href={ `/prom/task/product/${ (record as ITask).id }` } disabled={ (record as ITask).status !== 3 || (record as ITask).taskReviewStatus === 0 }>
                            完善产品信息
                        </Button>
                        :<Button type="link"  href={ `/prom/task/product/${ (record as ITask).id }` } disabled={ (record as ITask).taskReviewStatus === 0 }>
                            变更产品信息
                        </Button>
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
        this.fetchTableData({},pagination);
    }
    
     //delete-row
    public handleDelete = async(record: Record<string,any>) => {
        //接口
        await RequestUtil.delete(`/tower-market/taskNotice?id=${record.id}`);
        this.fetchTableData({});
    };
     
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
             label: '已通过',
             key: 1
         }, {
             label: '已驳回',
             key: 2
         }];
     }
 
     /**
      * @implements
      * @description Determines whether tab change on
      * @param activeKey 
      */
     public onTabChange(activeKey: string): void {
        const tablePagination:TablePaginationConfig = {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: false
        }
        this.fetchTableData({},tablePagination);
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
           },
        ];
     }
 }
 
 export default withRouter(withTranslation(['translation'])(TaskMngt));