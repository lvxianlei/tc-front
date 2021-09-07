/**
 * @author lxy
 * @copyright © 2021 lxy. All rights reserved
 */
 import { FormItemProps, Input, Card, TableColumnType, TablePaginationConfig, Table, Space, List, Row, Col, Pagination, Progress, Button, Select } from 'antd';
 import React from 'react';
 import { WithTranslation, withTranslation } from 'react-i18next';
 import { RouteComponentProps, withRouter } from 'react-router';
 import { Link } from 'react-router-dom';
 
 import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../components/AbstractMngtComponent';
 import ConfirmableButton from '../../components/ConfirmableButton';
 import { ITabItem } from '../../components/ITabableComponent';
 import RequestUtil from '../../utils/RequestUtil';
import DeliveryAcceptance from './DeliveryAcceptance';
 import styles from './Entrust.module.less';
import EntrustNew from './EntrustNew';
import EntrustSetting from './EntrustSetting';
 
 export interface IEntrustListProps {}
 export interface IEntrustListWithRouteProps extends RouteComponentProps<IEntrustListProps>, WithTranslation {}
 export interface IEntrustListState extends IAbstractMngtComponentState {
     readonly tableDataSource: IEntrustDataItem[];
     readonly name?: string;
     readonly projectNum?: string;
     readonly projectName?: string;
     readonly status?: string | number;
 }
 
 interface IEntrustDataItem {
     readonly id?: string;
     readonly checkNum: number;
     readonly conductNum: number;
     readonly finishNum: number;
     readonly projectNum: string | number;
     readonly projectName: string;
     readonly projectEndTime: string;
     readonly projectStartTime: string;
     readonly status: number;
     readonly entrustProductCategoryList: ITowerModelVO[];
 }
 


 interface ITowerModelVO {
     readonly deliverTime: string;
     readonly examineName: string;
     readonly examineNum: number;
     readonly examineSectionNum: number;
     readonly examineUser: string;
     readonly id: number | string;
     readonly passedTime: string;
     readonly projectName: string;
     readonly projectNum: string;
     readonly towerName: string;
     readonly sectionNum: number;
 }

 interface IResponseData {
     readonly current: number;
     readonly size: number;
     readonly total: number;
     readonly records: IEntrustDataItem[]
 }

 enum EntrustStatus {
    TO_BE_RELEASED = 1, //待发布
    TO_BE_RECEIVED = 2, //待接收
    TO_BE_APPROVAL = 3, //待立项
    UNDER_REVIEW = 4, //审核中
    HAVE_IN_HAND = 5, //进行中
    COMPLETED = 6, //已完成
}
 
 /**
  * Client Management
  */
 class EntrustList extends AbstractMngtComponent<IEntrustListWithRouteProps, IEntrustListState> {
 
     /**
      * @override
      * @description Gets state
      * @returns state 
      */
     protected getState(): IEntrustListState {
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
         const resData: IResponseData = await RequestUtil.get<IResponseData>('/tp-task-dispatch/entrust/customer/page', {
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
             tableDataSource: resData.records || [],
             tablePagination: {
                 ...this.state.tablePagination,
                 current: resData.current,
                 pageSize: resData.size,
                 total: resData.total
             }
         });
     }
 /**
     * @implements
     * @description Gets table columns
     * @param item 
     * @returns table columns 
     */
  public getTableColumns(item: ITabItem): TableColumnType<object>[] {
    return [{
        key: 'productCategoryName',
        title: '塔型',
        dataIndex: 'productCategoryName',
    }, {
        key: 'giveTime',
        title: '交付日期',
        width: 200,
        dataIndex: 'giveTime',
    }, {
        key: 'operation',
        title: '操作',
        width: 50,
        dataIndex: 'operation',
        render: (_: undefined, record: object): React.ReactNode => (
            <Space direction="horizontal" size="small">
                <DeliveryAcceptance data={ record } getTable={ () => this.fetchTableData({}) }/>
            </Space>
        )
    }];
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
    public getTableDataSource(item: any): IEntrustDataItem[] {
        return []
    }
    //获取状态
     protected getStatus(item: number){
         let statusTitle = '待发布';
        switch(item){
           case EntrustStatus.TO_BE_RELEASED:
                statusTitle = '待发布';
                break
           case EntrustStatus.TO_BE_RECEIVED:
                statusTitle = '待接收'
                break
           case EntrustStatus.TO_BE_APPROVAL:
                statusTitle = '待立项'
                break
           case EntrustStatus.UNDER_REVIEW:
                statusTitle = '审核中'
                break
           case EntrustStatus.HAVE_IN_HAND:
                statusTitle = '进行中'
                break
           case EntrustStatus.COMPLETED:
                statusTitle = '已完成'
                break
       }
       return statusTitle
    }
     /**
     * @protected
     * @description Renders table content
     * @param item 
     * @returns table content 
     */
    protected renderTableContent(data: ITabItem): React.ReactNode {
        const { tableDataSource }= this.state;
        return (
            <>
                <Row gutter={[16, 16]}>
                        {tableDataSource.map( (item: IEntrustDataItem) =>{
                            return(
                                <Col span={ item.status === EntrustStatus.HAVE_IN_HAND ? 24 : 12 } >
                                    <Card className={styles.cardBorder}>
                                        <Row >
                                            <Col span={ item.status === EntrustStatus.HAVE_IN_HAND ?12:24} >

                                                <div className = { item.status === EntrustStatus.HAVE_IN_HAND ? styles.left : styles.left1 }>
                                                    <div className = { styles.top_left }>
                                                        {this.getStatus(item.status)}
                                                    </div>
                                                    <div className = { styles.left_top }>
                                                        <Progress
                                                            type="circle"
                                                            strokeColor={{
                                                                '0%': '#1890FF',
                                                                '100%': '#4F53FF',
                                                            }}
                                                            trailColor = { "#dcdcdc" }
                                                            width = { 80 }
                                                            percent = { item.status === EntrustStatus.HAVE_IN_HAND ? Math.round((item.finishNum / (item.checkNum + item.conductNum) * 100) * 100) / 100 : item.status === EntrustStatus.COMPLETED ? 100 : 0 }
                                                            className= { styles.left_top_left }
                                                        />
                                                        <div className = { styles.left_top_right }>
                                                            <div>工程编号：{ item.projectNum }</div>
                                                            <div className = { styles.left_top_right_middle}>工程名称：{ item.projectName }</div>
                                                            <div>工程周期：{ item.projectStartTime } 至 { item.projectEndTime }</div>
                                                            { item.status !== EntrustStatus.TO_BE_RELEASED ? 
                                                                item.status !== EntrustStatus.COMPLETED && item.status !== EntrustStatus.HAVE_IN_HAND?
                                                                <div>
                                                                <Button type="primary" ghost href={ `/outsource/entrust/detail/${ (item as IEntrustDataItem).id }`}>前往留言</Button>
                                                                </div>:
                                                                <div>
                                                                    <Button type="primary" ghost href={ `/outsource/entrust/detail/${ (item as IEntrustDataItem).id }`}>详情</Button>
                                                                </div>
                                                                :<div>
                                                                    <Link to={ `/outsource/entrust/sstting/${ (item as IEntrustDataItem).id }` }><Button type="primary" ghost>编辑</Button></Link>
                                                                    <ConfirmableButton 
                                                                        confirmTitle="是否删除该委托吗？" 
                                                                        type="primary"
                                                                        ghost
                                                                        placement="topRight"
                                                                        onConfirm={ async () => {
                                                                            await RequestUtil.delete(`/tp-task-dispatch/entrust?id=${ (item as IEntrustDataItem).id }`);
                                                                            this.fetchTableData({});
                                                                        } }
                                                                    >
                                                                        删除
                                                                    </ConfirmableButton>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    { item.status === EntrustStatus.HAVE_IN_HAND?
                                                        <>
                                                            <div className = { styles.left_middle }>塔型统计</div>
                                                            <div className = { styles.left_middle_bottom }></div>
                                                            <div className = { styles.left_bottom }>
                                                                <div className = { styles.left_bottom_left}>
                                                                    <div>{ item.checkNum }</div>
                                                                    <div>待验收</div>
                                                                </div>
                                                                <div className = { styles.left_bottom_middle}>
                                                                    <div>{ item.conductNum }</div>
                                                                    <div>进行中</div>
                                                                </div>
                                                                <div className = { styles.left_bottom_right}> 
                                                                    <div>{ item.finishNum }</div>
                                                                    <div>已完成</div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    :null}
                                                </div>
                                            </Col>
                                            { item.status === EntrustStatus.HAVE_IN_HAND?
                                          
                                                <Col span={12}>
                                                    <div className = { styles.card_right }>
                                                    <Table 
                                                        dataSource = { item.entrustProductCategoryList }
                                                        rowKey = { this.getTableRowKey() }
                                                        bordered = {true}
                                                        onChange = { this.onTableChange }
                                                        style = {{ height: '380px' }}
                                                        columns = {this.getTableColumns(data)}
                                                        scroll = {item && item.entrustProductCategoryList && item.entrustProductCategoryList.length>10?{ y: 322 }:{}}  
                                                        pagination = {false}
                                                        size = 'small'
                                                        rowClassName = {(record: object, index: number) => {
                                                            return  index % 2 == 0 ? styles.singer : styles.double
                                                        }}
                                                    />
                                                    </div>
                                                </Col>
                                            : null }
                                        </Row>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
                <Pagination 
                    { ...this.state.tablePagination }  
                    onChange={ this.onChange }
                    className={ styles.bottom }
                />
            </>
        );
    }

    public async listData( id: string|undefined ){
        const resData: ITowerModelVO[] = await RequestUtil.get<ITowerModelVO[]>(`/tp-task-dispatch/productCategory/getWaitAcceptList?entrustId=${id}`);
        console.log(id,resData)
        return  resData
    }
    //页面变化
    public onChange = (page: number)=> {
        let tablePagination ={
            ...this.state.tablePagination,
            current: page,
        }
        this.setState({
            tablePagination
        })
        this.fetchTableData({ name: this.state.name }, tablePagination);
        
    };
 
     /**
      * @implements
      * @description Determines whether table change on
      * @param pagination 
      */
     public onTableChange(pagination: TablePaginationConfig): void {
         this.fetchTableData({ 
            projectNum: this.state.projectNum,
            projectName: this.state.projectName,
            status: this.state.status }, pagination);
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
         return [
            {
                label:'未完成',
                key: '0'
            },{
                label:'已完成',
                key: '1'
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
        this.props.history.push('/outsource/entrust/new');
    }
 
     /**
      * @implements
      * @description Gets filter form item props
      * @param item 
      * @returns filter form item props 
      */
     public getFilterFormItemProps(item: ITabItem): FormItemProps[] {
        return [
            {
                name: 'projectNum',
                children: <Input placeholder="工程编号关键字" maxLength={ 200 }/>
            },{
                name: 'projectName',
                children: <Input placeholder="工程名称关键字" maxLength={ 200 }/>
            },{
                name: 'status',
                children: 
                    <Select placeholder="请选择工程状态" className={ styles.select_width } getPopupContainer={ triggerNode => triggerNode.parentNode }>
                        <Select.Option value={ EntrustStatus.TO_BE_RELEASED }>待发布</Select.Option>
                        <Select.Option value={ EntrustStatus.TO_BE_RECEIVED }>待接收</Select.Option>
                        <Select.Option value={ EntrustStatus.TO_BE_APPROVAL }>待立项</Select.Option>
                        <Select.Option value={ EntrustStatus.UNDER_REVIEW }>审核中</Select.Option>
                        <Select.Option value={ EntrustStatus.HAVE_IN_HAND }>进行中</Select.Option>
                        <Select.Option value={ EntrustStatus.COMPLETED }>已完成</Select.Option>
                    </Select>
            }
        ];
     }

    /**
     * @implements
     * @description 新增按钮
     * @param event 
     */
    public renderExtraOperationContent(item: ITabItem): React.ReactNode {
        return this.state.selectedTabKey === '0' ?
          super.renderExtraOperationContent(item)
        : null 
    }
 }
 
 export default withRouter(withTranslation(['translation'])(EntrustList));