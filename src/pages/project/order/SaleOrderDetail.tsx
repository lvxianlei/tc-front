import { Button } from "antd";
import React from "react";
import { withTranslation } from "react-i18next";
import { Link, withRouter } from "react-router-dom";
import ConfirmableButton from "../../../components/ConfirmableButton";
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
    const projectId = (this.props.match.params as any).id;
    
    return [
      <Button key="new">
        <Link to={"/project/order/new"}>新增</Link>
      </Button>,
      <Button key="setting">
        <Link to={`/project/order/setting/${projectId}/${this.props.match.params.id}`}>
          编辑
        </Link>
      </Button>,
      <ConfirmableButton
        key="delete"
        confirmTitle="要删除该订单吗？"
        onConfirm={this.deleteOrder}
      >
        删除
      </ConfirmableButton>,
    ];
  }
}
export default withRouter(withTranslation()(ManagementSaleOrderDetail));
