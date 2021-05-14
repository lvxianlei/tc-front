 import { Form, Input, Space, TableColumnType, Select, TablePaginationConfig } from 'antd';
 import React from 'react';
 import { WithTranslation, withTranslation } from 'react-i18next';
 import { RouteComponentProps, withRouter } from 'react-router';
 import { Link } from 'react-router-dom';

 import AbstractMngtComponent, { IAbstractMngtComponentState, ITabItem } from '../../components/AbstractMngtComponent';
 import RequestUtil from '../../utils/RequestUtil';
 
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
     readonly customerCompany: string;
     readonly signCustomerName: string;
     readonly deliveryTime: string;
 }
 
 interface IResponseData {
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
         const resData: IResponseData = await RequestUtil.get<IResponseData>('/customer/contract', {
             ...filterValues,
             current: pagination.current || this.state.tablePagination.current,
             size: pagination.pageSize ||this.state.tablePagination.pageSize,
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
             key: 'contractNumber',
             title: '合同编号',
             dataIndex: 'contractNumber',
             render: (contractNumber: number): React.ReactNode => {
                 return <Link to="">{contractNumber}</Link>
            }
         }, {
             key: 'internalNumber',
             title: '内部合同编号',
             dataIndex: 'internalNumber',
             render: (internalNumber: number): React.ReactNode => {
                return <Link to="">{internalNumber}</Link>
           }
         }, {
             key: 'projectName',
             title: '工程名称',
             dataIndex: 'projectName'
         }, {
             key: 'saleType',
             title: '销售类型',
             dataIndex: 'saleType',
             render: (saleType: number): React.ReactNode => {
                return  saleType === 1 ? '国内客户' : '国际客户';
            }
         }, {
             key: 'winBidType',
             title: '中标类型',
             dataIndex: 'winBidType',
             render: (productType: number): React.ReactNode => {
                return  productType === 1 ? '国家电网' : '南方电网';
             }
         }, {
             key: 'productType',
             title: '产品类型',
             dataIndex: 'productType',
             render: (productType: number): React.ReactNode => {
                return  productType === 1 ? '角钢塔' : '管塔';
             }
         },  {
            key: 'voltageGrade',
            title: '电压等级（KV）',
            dataIndex: 'voltageGrade',
            render: (voltageGrade: number): React.ReactNode => {
                return  voltageGrade === 1 ? '220' : '110';
            }
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
             render: (): React.ReactNode => (
                 <Space direction="horizontal" size="small">
                     <Link to="">编辑</Link>
                     <Link to="">删除</Link>
                     <Link to="">添加汇款记录</Link>
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
      * @description Renders filter components
      * @param item 
      * @returns filter components 
      */
     public renderFilterComponents(item: ITabItem): React.ReactNode[] {
         return [
                <Form.Item name="internalNumber" key="internalNumber">
                    <Input placeholder="内部合同编号关键词"/>
                </Form.Item>,
                <Form.Item name="projectName" key="projectName">
                    <Input placeholder="工程名称关键词"/>
                </Form.Item>,
                <Form.Item name="customerCompany" key="customerCompany">
                    <Input placeholder="业主单位关键词"/>
                </Form.Item>,
                <Form.Item name="signCustomerName" key="signCustomerName">
                    <Input placeholder="合同签订单位关键词"/>
                </Form.Item>,
                <Form.Item name="winBidType" key="winBidType">
                    <Select defaultValue="0">
                        <Option value="0" >全部中标类型</Option>
                        <Option value="1">国家电网</Option>
                        <Option value="2">南方电网</Option>
                        <Option value="3">...</Option>
                    </Select>
                </Form.Item>
         ];
     }
 }
 
 export default withRouter(withTranslation(['translation'])(PromContract));