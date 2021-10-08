import React from "react";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { SaleOrderNew } from "../../prom/order/SaleOrderNew";

class ManagementSaleOrderNew extends SaleOrderNew {
  protected getReturnPath(): string {
    this.props.history.goBack();
    return "";
  }
}
export default withRouter(withTranslation()(ManagementSaleOrderNew));
