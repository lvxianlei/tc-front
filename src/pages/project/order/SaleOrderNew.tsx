import React from "react";
import { Button, Spin, Form, message } from "antd"
import { withTranslation } from "react-i18next"
import { withRouter, useHistory } from "react-router-dom";
import { SaleOrderNew } from "../../prom/order/SaleOrderNew";
import { DetailContent, BaseInfo, DetailTitle } from "../../common"
class ManagementSaleOrderNew extends SaleOrderNew {
  protected getReturnPath(): string {
    this.props.history.goBack();
    return "";
  }
}
export default withRouter(withTranslation()(ManagementSaleOrderNew));