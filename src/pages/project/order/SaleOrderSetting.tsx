import React from "react";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { SaleOrderSetting } from "../../prom/order/SaleOrderSetting";

class ManagementSaleOrderSetting extends SaleOrderSetting {

  protected getReturnPath(): string {
    this.props.history.goBack();
    return "";
  }
  renderExtraSections() {
    return [];
  }
}
export default withRouter(withTranslation()(ManagementSaleOrderSetting));
