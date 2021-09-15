import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { SaleOrderNew } from "../../prom/order/SaleOrderNew";

class ManagementSaleOrderNew extends SaleOrderNew {}
export default withRouter(withTranslation()(ManagementSaleOrderNew));
