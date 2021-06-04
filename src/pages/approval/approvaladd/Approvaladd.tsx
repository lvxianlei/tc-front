import { FormItemProps, Input, Select, Space, TableColumnType, TablePaginationConfig, Button, Dropdown, Menu, } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../../components/AbstractMngtComponent'
import { ITabItem } from "../../../components/ITabableComponent";
import RequestUtil from '../../../utils/RequestUtil';

const { Option } = Select;
function handleChange(value: string) {
    console.log(`selected ${value}`);
}
export interface ITaskMngtProps { }
export interface ITaskMngtWithRouteProps extends RouteComponentProps<ITaskMngtProps>, WithTranslation { }
export interface ITaskMngtState extends IAbstractMngtComponentState {
    readonly tableDataSource: ITaskTableDataItem[];
}
interface ITaskTableDataItem {
    readonly id: number;
    readonly marketAuditId: string;
    readonly materialDemand: string;
    readonly materialStandard: number;
    readonly planDeliveryTime: number;
    readonly deliveryTime: string;
    readonly projectName: string;
    readonly saleOrderNumber: string;
    readonly taskNumber: string;
    readonly edit: number;
}

interface IResponseData {
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly hitCount: boolean;
    readonly pages: number;
    readonly records: ITaskTableDataItem[];
}
const menu = (record: any) => {
    return (
        <Menu mode="inline">
            <Menu.Item>
                <Button href={`/approval/taskone/${(record as ITaskTableDataItem).id}`} ghost>
                    任务单审批
                </Button>
            </Menu.Item>
            <Menu.Item>
                <Button href={`/approval/taskchange/${(record as ITaskTableDataItem).id}`} ghost>
                    任务单产品变更审批
                </Button>
            </Menu.Item>
            <Menu.Item>
                <Button href={`/approval/information/${(record as ITaskTableDataItem).id}`} ghost>
                    产品信息变更审批
                </Button>
            </Menu.Item>
        </Menu>
    )

}
//审批管理

class Approvallp extends AbstractMngtComponent<ITaskMngtWithRouteProps, ITaskMngtState> {
    /**
      * @override
      * @description Gets state
      * @returns state 
      */

    protected getState(): ITaskMngtState {
        return {
            ...super.getState(),
            tableDataSource: []
        }
    }

    /**
      * @description Fetchs table data
      * @param filterValues 
      */
    protected async fetchTableData(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('tower-market/taskNotice/page', {
            ...filterValues,
            current: pagination.current || this.state.tablePagination?.current,
            size: pagination.pageSize || this.state?.tablePagination?.pageSize,
            countryCode: this.state?.tablePagination?.pageSize
        })
        this.setState({
            ...filterValues,
            tableDataSource: resData.records,
            tablePagination: {
                ...this.state.tablePagination,
                current: resData.current,
                pageSize: resData.size,
                total: resData.total

            }
        })
    }
    /**
     * @override
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount()
        this.fetchTableData({})
    }
    /**
     * @implements
     * @description Gets table data source
     * @param item 
     * @returns table data source 
     */
    public getTableDataSource(item: ITabItem): object[] {
        return this.state.tableDataSource
    }
    /**
    * @implements
    * @description Gets table columns
    * @param item 
    * @returns table columns 
    */
    public getTableColumns(item: ITabItem): TableColumnType<object>[] {
        return [
            {
                key: 'marketAuditId',
                title: '审批单编号',
                dataIndex: 'marketAuditId',
                render: (_: undefined, record: object): React.ReactNode => {
                    return <Link to={`/approval/missiondetail/1`}>{(record as ITaskTableDataItem).marketAuditId}</Link>
                }
            },
            {
                key: 'businessType',
                title: '业务类型',
                dataIndex: 'businessType',
                render: (type: number): React.ReactNode => {
                    return type === 1 ? '产品信息变更审批' : '任务单产品审批';
                }
            },
            {
                key: 'internalNumber',
                title: '业务单编号',
                dataIndex: 'internalNumber',
                render: (internalNumber: number): React.ReactNode => {
                    return <Link to={`/approval/missiondetail/${(internalNumber)}`}>{internalNumber}</Link>
                }
            },
            {
                key: 'startTime',
                title: '提交时间',
                dataIndex: 'startTime',
                render: (startTime: number): React.ReactNode => {
                    return <Link to={``}>{startTime}</Link>
                }
            },
            {
                key: 'auditStatus',
                title: "审批状态",
                dataIndex: 'auditStatus',
                render: (auditStatus: number): React.ReactNode => {
                    return auditStatus === 0 ? '待审批' : auditStatus === 1 ? '已通过 ' : '已驳回';
                }
            }, {
                key: "edit",
                title: "操作",
                dataIndex: "edit",
                render: (_: undefined, record: object): React.ReactNode => (
                    <Space direction="horizontal" size="small">
                        {
                            // (record as ITaskTableDataItem).edit === 2 ?
                            <Dropdown overlay={menu(record)} placement="bottomLeft" trigger={['click']} >
                                <Button type="primary" ghost>
                                    审批
                                    </Button>
                            </Dropdown>
                            //     : <Button type="primary" disabled >
                            //         审批
                            //   </Button>
                        }
                    </Space>
                )
            }]
    }
    /**
   * @implements
   * @description Determines whether table change on
   * @param pagination 
   */
    public onTableChange(pagination: TablePaginationConfig): void {
        this.fetchTableData(pagination)
    }
    /**
     * @implements
     * @description Determines whether filter submit on
     * @param values 
     */
    public async onFilterSubmit(values: Record<string, any>) {
        this.fetchTableData(values)
    }
    /**
     * @implements
     * @description Gets tab items
     * @returns tab items 
     */
    public getTabItems(): ITabItem[] {
        return [
            {
                label: '全部',
                key: ""
            },
            {
                label: '审批中',
                key: 0
            },
            {
                label: '已驳回',
                key: 1
            },
            {
                label: "已通过",
                key: 2
            }
        ]
    }
    /**
    * @implements
    * @description Determines whether tab change on
    * @param activeKey 
    */
    public onTabChange(activeKey: string): void {
        this.fetchTableData({ auditStatus: activeKey });
        console.log(activeKey);


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

                children: (
                    <>
                        <Select defaultValue="全部" style={{ width: 170 }} onChange={handleChange}>
                            <Option value="全部">全部</Option>
                            <Option value="产品信息变更审批">产品信息变更审批</Option>
                            <Option value="任务单产品信息审批">任务单产品信息审批</Option>
                        </Select>
                    </>
                )
            },

        ];
    }

}

export default withRouter(withTranslation()(Approvallp));
