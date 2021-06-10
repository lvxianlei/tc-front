import {
    Button,
    FormItemProps,
    Select,
    Space,
    TableColumnType,
    TablePaginationConfig
} from "antd";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
//引入路由
import { RouteComponentProps, withRouter } from "react-router";
//引入Link
//引入css
import styles from "./ApprovalList.module.less";
import AbstractMngtComponent, {
    IAbstractMngtComponentState,
} from "../../components/AbstractMngtComponent";
import { ITabItem } from "../../components/ITabableComponent";
import RequestUtil from "../../utils/RequestUtil";
// import { ITaskapprovalState } from './task/TaskApproval';

export interface IApprovalallProps { }
export interface IApprovalallRouteProps
    extends RouteComponentProps<IApprovalallProps>,
    WithTranslation { }
export interface IApprovalState extends IAbstractMngtComponentState {
    readonly tableDataSource: ITaskTableDataItem[];

}
//antd
const { Option } = Select;

interface IResponseData {
    readonly records: ITaskTableDataItem[];
    readonly size: number;
    readonly current: number;
    readonly pageSize: string;
    readonly total: number;
    readonly type: string | number;
}
//响应数据的限制
interface ITaskTableDataItem {
    readonly businessId: number;
    //id
    readonly id: number;

    readonly type: string | number;
    //业务类型
    readonly typeName: string;
    //状态类型
    readonly auditStatus?: number | string;
    //业务单编号
    readonly businessNumber: number;
    //开始时间
    readonly updateTime: number | string;
}


//审批状态
enum AuditStatus {
    PENDING_APPROVAL = 0,
    ADOPT = 1,
    REJECT = 2
}
//table
enum AuditStatusItem {
    PENDING_APPROVAL = "待审批",
    ADOPT = "通过",
    REJECT = "驳回"
}
//业务类型
enum BusinessType {
    SALE_ORDER_AUDIT = "产品信息变更审批",
    TASK_AUDIT = "任务单产品审批",
}

class ApprovalAll extends AbstractMngtComponent<
    IApprovalallRouteProps,
    IApprovalState
> {
    //取出state数据
    protected getState(): IApprovalState {
        return {
            //默认设置
            ...super.getState(),
            tableDataSource: []
        };
    }
    //发送请求
    protected async fetchTableData(
        filterValues: Record<string, any>,
        pagination: TablePaginationConfig = {}
    ) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>(
            "/tower-market/audit",
            {
                ...filterValues,
                //页数
                current: pagination.current || this.state?.tablePagination?.current,
                //每页数量
                size: pagination.pageSize || this.state?.tablePagination?.pageSize,
                //react.key
                auditStatus: this.state.selectedTabKey


            }
        );

        this.setState({
            ...filterValues,
            tableDataSource: resData.records,
            tablePagination: {
                ...this.state.tablePagination,
                current: resData.current,
                pageSize: resData.size,
                total: resData.total
            },
        });
    }
    //component Did mount
    public componentDidMount() {
        super.componentDidMount();
        this.fetchTableData({});
    }
    //
    public getTableData(): object[] {
        return this.state.tableDataSource;
    }
    //table
    public getTableColumns(item: ITabItem): TableColumnType<object>[] {
        return [
            {
                key: "businessId",
                title: "审批单编号",
                dataIndex: "businessId",
                align: "center",
                render: (id: number): React.ReactNode => {
                    return {id}
                }
            },
            {
                key: "type",
                title: "业务类型",
                dataIndex: "type",
                align: "center",
                width: 150,
                render: (type: string): React.ReactNode => {
                    switch (type) {
                        case "SALE_ORDER_AUDIT":
                            return BusinessType.SALE_ORDER_AUDIT
                        case "TASK_AUDIT":
                            return BusinessType.TASK_AUDIT
                    }
                }
            },
            {
                key: "businessNumber",
                title: "业务单编号",
                dataIndex: "businessNumber",
                align: "center",
                render: (businessNumber: number): React.ReactNode => {
                    return {businessNumber}
                }
            },
            {
                key: "updateTime",
                title: "提交时间",
                dataIndex: "updateTime",
                align: "center",
                width: 200
            },
            {
                key: "auditStatus",
                title: "审批状态",
                dataIndex: "auditStatus",
                align: "center",
                render: (auditStatus: number): React.ReactNode => {
                    switch (auditStatus) {
                        case AuditStatus.PENDING_APPROVAL:
                            return "待审批"
                        case AuditStatus.ADOPT:
                            return "通过"
                        case AuditStatus.REJECT:
                            return "驳回"
                    }
                }
            },
            {
                key: "operation",
                title: "操作",
                dataIndex: "operation",
                align: "center",
                render: (
                    _: undefined,
                    records: object): React.ReactNode => {
                    return (
                        <Space direction="horizontal" size="small">
                            {(records as ITaskTableDataItem).auditStatus ===
                                AuditStatus.PENDING_APPROVAL ?
                                (
                                    (records as ITaskTableDataItem).auditStatus === AuditStatus.PENDING_APPROVAL ?
                                        <Button href={`/approval/task/product-change/
                                    ${(records as ITaskTableDataItem).id}`} type="link" >审批</Button>
                                        :
                                        <Button href={`/approval/task/change/
                                    ${(records as ITaskTableDataItem).id}&
                                    ${(records as ITaskTableDataItem).businessId}`} type="link" >审批</Button>

                                ) : (
                                    <Button type="link" disabled>
                                        审批
                                    </Button>
                                )}
                        </Space>
                    );
                }
            },
        ];
    }
    /**
     * Determines whether filter submit on
     * @param values 
     */
    public async onFilterSubmit(values: Record<string, any>) {
        this.fetchTableData(values);
    }
    /**
     * Determines whether table change on
     * @param pagination 
     */
    public onTableChange(pagination: TablePaginationConfig): void {
        this.fetchTableData({}, pagination);
    }
    /**
     * @implements
     * @description Gets tab items
     * @returns 选项卡 items
    */
    public getTabItems(): ITabItem[] {
        return [
            {
                label: "全部",
                key: "",
            },
            {
                label: AuditStatusItem.PENDING_APPROVAL,
                key: AuditStatus.PENDING_APPROVAL,
            },
            {
                label: AuditStatusItem.ADOPT,
                key: AuditStatus.ADOPT,
            },
            {
                label: AuditStatusItem.REJECT,
                key: AuditStatus.REJECT,
            },
        ];
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
        console.log(this.state);
        return [
            {
                name: "type",
                initialValue: "",
                children: (
                    <Select className={styles.drop_down_menu}>
                        <Option value="">全部</Option>
                        <Option value="SALE_ORDER_AUDIT">产品信息变更审批</Option>
                        <Option value="TASK_AUDIT">任务单产品信息审批</Option>
                    </Select>
                ),
            }
        ];
    }
    /**
     * @implements
     * @description Determines whether new click on
     * @param event
     */
    public onNewClick(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void { }
    /**
     * @implements
     * @description Gets table data source
     * @param item
     * @returns table data source
     */
    public getTableDataSource(item: ITabItem): object[] {
        return this.state.tableDataSource;
    }
    protected renderExtraOperationContent(item: ITabItem): React.ReactNode {
        return }
}

export default withRouter(withTranslation()(ApprovalAll));
