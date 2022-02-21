import { Button, Popconfirm } from "antd";
import React from "react";
import { withTranslation } from "react-i18next";
import { Link, withRouter } from "react-router-dom";
import { ITabItem } from "../../../components/ITabableComponent";
import { SaleOrderDetail } from "../../prom/order/SaleOrderDetail";
import ManagementSaleOrderSummary from "./SaleOrderSummary";

class ManagementSaleOrderDetail extends SaleOrderDetail {
  public getTabItems(): ITabItem[] {
    return [
      Object.assign({}, super.getTabItems()[0], {
        content: (
          <ManagementSaleOrderSummary
            baseInfo={this.state.detail}
            sysInfo={this.state.detail}
          />
        ),
      }),
    ];
  }
  public renderOperationArea(): React.ReactNode | React.ReactNode[] {
    const projectId = (this.props.match.params as any).projectId;
    return [
      <Button key="setting" disabled={(this.state.detail as any)?.isProductGroupRef !== 0}>
        <Link to={`/project/order/setting/${projectId}/${this.props.match.params.id}`}>
          编辑
        </Link>
      </Button>,
      <Popconfirm
        key="delete"
        title="要删除该订单吗？"
        okText="确认"
        cancelText="取消"
        onConfirm={this.deleteOrder}
      >
        <Button type="default">删除</Button>
      </Popconfirm>,
      <Button type="default" key="goback" onClick={() => this.props.history.go(-1)}>返回</Button>
    ];
  }
}
export default withRouter(withTranslation()(ManagementSaleOrderDetail));
