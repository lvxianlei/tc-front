import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import {ContractSetting} from "../../prom/contract/ContractSetting";
class ManagementContractSetting extends ContractSetting {}

export default withRouter(withTranslation()(ManagementContractSetting));