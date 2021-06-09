/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */

import { RouteComponentProps, StaticContext } from "react-router";
import AuthUtil from "../utils/AuthUtil";
import { IFilter } from "./IFilter";

/**
 * Authorization Filter
 */
export default class AuthorizationFilter implements IFilter {

    /**
     * @description Descriptions authorization filter
     * @param props 
     * @returns filter 
     */
    public doFilter(props: RouteComponentProps<{}, StaticContext, unknown>): Promise<boolean> {
        let accessable: boolean = true;
        if (props.location.pathname !== '/login') {
            accessable = !!(AuthUtil.getAuthorization() && AuthUtil.getSinzetechAuth() && AuthUtil.getTenantId());
            if (!accessable) {
                const { location } = window;
                props.history.replace(`/login?goto=${ encodeURIComponent(location.href.replace(`${ location.protocol }//${ location.host }`, '')) }`);
            }
        }
        return Promise.resolve(accessable);
    }
}