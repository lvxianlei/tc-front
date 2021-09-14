import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { PaymentRecordNew } from "../../prom/contract/PaymentRecordNew";
class ManagementPaymentRecordNew extends PaymentRecordNew {}

export default withRouter(withTranslation()(ManagementPaymentRecordNew));
