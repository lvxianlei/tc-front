import React from "react";
import { Input, Select, InputNumber } from "antd";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import ContractSelectionComponent from "../../../components/ContractSelectionModal";
import {
  currencyTypeOptions,
  saleTypeOptions,
  taxRateOptions,
} from "../../../configuration/DictionaryOptions";
import { IFormItemGroup } from "../../entrust/EntrustDetail";
import { ManagementSaleOrder } from "../../prom/order/AbstractSaleOrderSetting";
import { SaleOrderSetting } from "../../prom/order/SaleOrderSetting";
import layoutStyles from "../../../layout/Layout.module.less";

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
