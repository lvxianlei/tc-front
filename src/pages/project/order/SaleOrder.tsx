import React from "react";
import { TableColumnType, Space, FormItemProps, Button } from "antd";
import { withTranslation } from "react-i18next";
import { Link, withRouter } from "react-router-dom";
import AuthorityComponent from "../../../components/AuthorityComponent";
import ConfirmableButton from "../../../components/ConfirmableButton";
import { ITabItem } from "../../../components/ITabableComponent";
import RequestUtil from "../../../utils/RequestUtil";
import { IResponseData } from "../../common/Page";
import { SaleOrder, ITableDataItem } from "../../prom/order/SaleOrder";

/**
 * 项目管理-订单管理
 */
class ManagementOrder extends SaleOrder {
  /**
   * @implements
   * @description Gets table columns
   * @param item
   * @returns table columns
   */
  public getTableColumns(item: ITabItem): TableColumnType<object>[] {
    const projectId = (this.props.match.params as any).id;
    return [
      {
        key: "saleOrderNumber",
        title: "订单编号",
        dataIndex: "saleOrderNumber",
        render: (_: undefined, record: object): React.ReactNode => {
          return (
            <Link
              to={`/project/order/detail/${projectId}/${(record as ITableDataItem).id
                }`}
            >
              {(record as ITableDataItem).saleOrderNumber}
            </Link>
          );
        },
      },
      {
        key: "taskStatus",
        title: "任务下发状态",
        dataIndex: "taskStatus",
        render: (value: number, record: object): React.ReactNode => {
          const renderEnum: any = [
            {
              value: 0,
              label: "未下发"
            },
            {
              value: 1,
              label: "部分下发"
            },
            {
              value: 2,
              label: "全部下发"
            },
          ]
          return <>{renderEnum.find((item: any) => item.value === value).label}</>
        }
      },
      {
        key: "internalNumber",
        title: "内部合同编号",
        dataIndex: "internalNumber",
        render: (_: undefined, record: object): React.ReactNode => {
          return (
            <Link
              to={`/project/contract/detail/${projectId}/${(record as ITableDataItem).contractId
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
        render: (_: undefined, record: any): React.ReactNode => (
          <Space direction="horizontal" size="small">
            <Button
              type="link"
              disabled={record.isProductGroupRef !== 0}
              onClick={() => this.props.history.push(`/project/order/setting/${projectId}/${(record as ITableDataItem).id}`)}>编辑</Button>
            <AuthorityComponent permissions="sale_order_del">
              <ConfirmableButton
                confirmTitle="要删除该订单吗？"
                type="link"

                placement="topRight"
                onConfirm={async () => {
                  let id = (record as ITableDataItem).id;
                  const resData: IResponseData = await RequestUtil.delete(
                    `/tower-market/saleOrder?id=${id}`
                  );
                  this.fetchTableData({});
                }}
              >
                <Button type="link" disabled={record.isProductGroupRef !== 0}>删除</Button>
              </ConfirmableButton>
            </AuthorityComponent>
          </Space>
        ),
      },
    ];
  }

  /**
   * @implements
   * @description Gets tab items
   * @returns tab items
   */
  public getTabItems(): ITabItem[] {
    return [
      {
        label: "",
        key: "",
      },
    ];
  }

  /**
   * @implements
   * @description Determines whether new click on
   * @param event
   */
  public onNewClick(event: React.MouseEvent<HTMLButtonElement>): void {
    this.props.history.push(`/project/order/new/${(this.props.match.params as any).id}`);
  }

  protected renderExtraOperationContent(item: ITabItem): React.ReactNode {
    return (
      <Button type="primary" onClick={this.onNewClick}>新增订单</Button>
    );
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

export default withRouter(withTranslation(["translation"])(ManagementOrder));
