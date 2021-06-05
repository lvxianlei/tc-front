import { Space, Button, Dropdown, Menu, Select } from "antd"
import React from 'react';
//引入Link
import { Link } from "react-router-dom"
import { WithTranslation, withTranslation } from 'react-i18next';
import { FormItemProps, TablePaginationConfig, TableColumnType } from 'antd';
//引入路由
import { RouteComponentProps, withRouter } from "react-router"
//引入css
// import "./Approvalall.modal.less"
import AbstractMngtComponent, { IAbstractMngtComponentState } from "../../../components/AbstractMngtComponent"
import { ITabItem } from '../../../components/ITabableComponent';
import RequestUtil from '../../../utils/RequestUtil';
import { ITaskapprovalState } from '../task/Taskapproval';

export interface IApprovalallProps { }
export interface IApprovalallRouteProps extends RouteComponentProps<IApprovalallProps>, WithTranslation { }
export interface IApprovalState extends IAbstractMngtComponentState {
    readonly tableDataSource: ITaskTableDataItem[]
}
//菜单
function handleChange(value: string) {
    console.log(`selected ${value}`);
}
//antd
const { Option } = Select

interface IResponseData {
    readonly records: ITaskTableDataItem[];
    readonly size: number;
    readonly current: number;
    readonly pageSize: string;
    readonly total: number;

}


//响应数据的限制
interface ITaskTableDataItem {
    //id
    readonly id: number;

    readonly type: string;
    //业务类型
    readonly typeName: string;
    //状态类型
    readonly auditStatus?: number | string;
    //业务单编号
    readonly businessNumber: number
    //开始时间
    readonly updateTime: number | string;
}

//操作
const menu = (records: any) => {
    return (
        <Menu mode="inline">
            <Menu.Item>
                <Button href={`/approval/task/${(records as ITaskTableDataItem).id}`} ghost>
                    任务单审批
                </Button>
            </Menu.Item>
            <Menu.Item>
                <Button href={`/approval/taskchange/${(records as ITaskTableDataItem).id}`} ghost>
                    任务单产品变更审批
                </Button>
            </Menu.Item>
            <Menu.Item>
                <Button href={`/approval/information/${(records as ITaskTableDataItem).id}`} ghost>
                    产品信息变更审批
                </Button>
            </Menu.Item>
        </Menu>
    )

}
class Approvalall extends AbstractMngtComponent<IApprovalallRouteProps, IApprovalState> {

    //取出state数据
    protected getState(): IApprovalState {
        return {
            //默认设置
            ...super.getState(),
            tableDataSource: []
        }
    }
    //发送请求 
    protected async fetchTableData(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>("/tower-market/audit", {
            ...filterValues,
            //页数
            current: pagination.current || this.state?.tablePagination?.current,
            //每页数量
            size: pagination.pageSize || this.state?.tablePagination?.pageSize,
            //react.key
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
    //component Did mount
    public async componentDidMount() {
        super.componentDidMount();
        this.fetchTableData({});
        console.log(this.state);


    }
    //
    public getTableData(item: ITabItem): object[] {
        return this.state.tableDataSource;
    }
    //table
    public getTableColumns(item: ITabItem): TableColumnType<object>[] {
        return [{
            key: "businessId",
            title: "审批单编号",
            dataIndex: "businessId",
            align: "center",
            render: (id: number): React.ReactNode => {
                return <Link to={``}>{id}</Link>
            }
        }, {
            key: "typeName",
            title: "业务类型",
            dataIndex: "typeName",
            align: "center",
            width: 150,
        }, {
            key: "businessNumber",
            title: "业务单编号",
            dataIndex: "businessNumber",
            align: "center",
            render: (businessNumber: number): React.ReactNode => {
                return <Link to={``}>{businessNumber}</Link>
            }
        }, {
            key: "updateTime",
            title: "提交时间",
            dataIndex: "updateTime",
            align: "center",
            width: 200,
            render: (updateTime: string): React.ReactNode => {
                return <Link to={``}>{updateTime}</Link>
            }
        }, {
            key: "auditStatus",
            title: "审批状态",
            dataIndex: "auditStatus",
            align: "center",
            render: (auditStatus: number): React.ReactNode => {
                return auditStatus === 0 ? "待审批" : auditStatus === 1 ? "通过" : "驳回"
            }
        }, {
            key: "operation",
            title: "操作",
            dataIndex: "operation",
            align: "center",
            render: (_: undefined, records: object): React.ReactNode => {
                return (
                    <Space direction="horizontal" size="small">
                        {
                            (records as ITaskTableDataItem).auditStatus === 2 ?
                                <Dropdown overlay={menu(records)} placement="bottomLeft" trigger={['click']} >
                                    <Button type="primary" ghost>
                                        审批
                                </Button>
                                </Dropdown>
                                : <Button type="primary" disabled >
                                    审批
                              </Button>
                        }
                    </Space>
                )
            }
        }];
    }

    /**
     * 
     */
    public onTableChange(pagination: TablePaginationConfig): void {
        this.fetchTableData(pagination);
        console.log(pagination);

    }
    /**
     * @implements
     * @description Gets tab items
     * @returns 选项卡 items 
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
    /**
      * @implements
      * @description Determines whether new click on
      * @param event 
      */
    public onNewClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        return
    }
    /**
    * 为什么异步
    */
    public async onFilterSubmit(values: Record<string, any>) {
        this.fetchTableData(values);
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


}

export default withRouter(withTranslation(['translation'])(Approvalall));