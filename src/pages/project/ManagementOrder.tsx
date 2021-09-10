import React from "react";
import {
  TablePaginationConfig,
  TableColumnType,
  Space,
  FormItemProps,
  Input,
} from "antd";
import { withTranslation } from "react-i18next";
import { Link, withRouter } from "react-router-dom";
import AbstractMngtComponent from "../../components/AbstractMngtComponent";
import AuthorityComponent from "../../components/AuthorityComponent";
import ConfirmableButton from "../../components/ConfirmableButton";
import { ITabItem } from "../../components/ITabableComponent";
import RequestUtil from "../../utils/RequestUtil";
import { IResponseData } from "../common/Page";
import {
  IPromContractWithRouteProps,
  IPromContractState,
} from "../prom/contract/PromContract";
import { ITableDataItem } from "../prom/order/SaleOrder";

/**
 * 项目管理-订单管理
 */
class SaleOrder extends AbstractMngtComponent<
  IPromContractWithRouteProps,
  IPromContractState
> {
  /**
   * @override
   * @description Gets state
   * @returns state
   */
  protected getState(): IPromContractState {
    return {
      ...super.getState(),
      tableDataSource: [],
    };
  }

  /**
   * @description Fetchs table data
   * @param filterValues
   */
  protected async fetchTableData(
    filterValues: Record<string, any>,
    pagination: TablePaginationConfig = {}
  ) {
    const resData: IResponseData = await RequestUtil.get<IResponseData>(
      "/saleOrder",
      {
        ...filterValues,
        current: pagination.current || this.state.tablePagination?.current,
        size: pagination.pageSize || this.state.tablePagination?.pageSize,
      }
    );
    if (resData?.records?.length == 0 && resData?.current > 1) {
      this.fetchTableData(
        {},
        {
          current: resData.current - 1,
          pageSize: 10,
          total: 0,
          showSizeChanger: false,
        }
      );
    }
    this.setState({
      ...filterValues,
      tableDataSource: resData.records,
      tablePagination: {
        ...this.state.tablePagination,
        current: resData.current,
        pageSize: resData.size,
        total: resData.total,
      },
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
    return [
      {
        key: "saleOrderNumber",
        title: "订单编号",
        dataIndex: "saleOrderNumber",
        render: (_: undefined, record: object): React.ReactNode => {
          return (
            <Link to={`/project/order/detail/${(record as ITableDataItem).id}`}>
              {(record as ITableDataItem).saleOrderNumber}
            </Link>
          );
        },
      },
      {
        key: "taskStatus",
        title: "任务下发状态",
        dataIndex: "taskStatus",
      },
      {
        key: "internalNumber",
        title: "内部合同编号",
        dataIndex: "internalNumber",
        render: (_: undefined, record: object): React.ReactNode => {
          return (
            <Link
              to={`/project/contract/detail/${
                (record as ITableDataItem).contractId
              }`}
            >
              {(record as ITableDataItem).internalNumber}
            </Link>
          );
        },
      },
      {
        key: "orderProjectName",
        title: "订单工程名称",
        dataIndex: "orderProjectName",
      },
      {
        key: "customerCompany",
        title: "业主单位",
        dataIndex: "customerCompany",
      },
      {
        key: "signCustomerName",
        title: "合同签订单位",
        dataIndex: "signCustomerName",
      },
      {
        key: "taxAmount",
        title: "订单总价",
        dataIndex: "taxAmount",
      },
      {
        key: "orderWeight",
        title: "订单重量",
        dataIndex: "orderWeight",
      },
      {
        key: "taxPrice",
        title: "订单单价",
        dataIndex: "taxPrice",
      },
      {
        key: "signContractTime",
        title: "签订日期",
        dataIndex: "signContractTime",
      },
      {
        key: "deliveryTime",
        title: "合同交货日期",
        dataIndex: "deliveryTime",
      },
      {
        key: "orderDeliveryTime",
        title: "订单交货日期",
        dataIndex: "orderDeliveryTime",
      },
      {
        key: "createUserName",
        title: "制单人",
        dataIndex: "createUserName",
      },
      {
        key: "createTime",
        title: "制单时间",
        dataIndex: "createTime",
      },
      {
        key: "operation",
        title: "操作",
        dataIndex: "operation",
        render: (_: undefined, record: object): React.ReactNode => (
          <Space direction="horizontal" size="small">
            <Link
              to={`/project/order/setting/${(record as ITableDataItem).id}`}
            >
              编辑
            </Link>
            <AuthorityComponent permissions="sale_order_del">
              <ConfirmableButton
                confirmTitle="要删除该订单吗？"
                type="link"
                placement="topRight"
                onConfirm={async () => {
                  let id = (record as ITableDataItem).id;
                  const resData: IResponseData = await RequestUtil.delete(
                    `/saleOrder?id=${id}`
                  );
                  this.fetchTableData({});
                }}
              >
                删除
              </ConfirmableButton>
            </AuthorityComponent>
          </Space>
        ),
      },
    ];
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
  public async onFilterSubmit(values: Record<string, any>) {}

  /**
   * @implements
   * @description Gets tab items
   * @returns tab items
   */
  public getTabItems(): ITabItem[] {
    return [
      {
        label: "",
        key: "tabitem1",
      },
    ];
  }

  /**
   * @implements
   * @description Determines whether tab change on
   * @param activeKey
   */
  public onTabChange(activeKey: string): void {}

  /**
   * @implements
   * @description Determines whether new click on
   * @param event
   */
  public onNewClick(event: React.MouseEvent<HTMLButtonElement>): void {
    this.props.history.push("/project/order/new");
  }

  /**
   * @implements
   * @description Renders filter components
   * @param item
   * @returns filter components
   */
  public getFilterFormItemProps(item: ITabItem): FormItemProps[] {
    return [];
  }
}

export default withRouter(withTranslation(["translation"])(SaleOrder));
