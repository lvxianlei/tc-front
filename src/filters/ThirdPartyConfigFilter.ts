import { IFilter } from "./IFilter";
import { RouteComponentProps, StaticContext } from "react-router";
import ThirdPartyUtil from "@utils/ThirdPartyUtil";
import AuthUtil from "@utils/AuthUtil";


/**
 * 第三方应用配置 Filter
 */
export default class ThirdPartyConfigFilter implements IFilter {

    /**
     * @description Descriptions dictionary filter
     * @param props
     * @returns filter
     */
    public async doFilter(props: RouteComponentProps<{}, StaticContext, unknown>): Promise<boolean> {
        let accessable: boolean = true;
        if (props.location.pathname !== '/login') {
            accessable = !!(AuthUtil.getAuthorization() && AuthUtil.getSinzetechAuth() && AuthUtil.getTenantId());
            if (accessable) {
                ThirdPartyUtil.setMesBaseInfo("mes");
                ThirdPartyUtil.setMesBaseInfo("qms");
            }
        }
        return true;
    }
}
