/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */

import { RouteComponentProps, StaticContext } from "react-router";
import { AuthorityBasic } from "../components/AuthorityComponent";
import ApplicationContext from "../configuration/ApplicationContext";
import AuthUtil from "../utils/AuthUtil";
import EventBus from "../utils/EventBus";
import RequestUtil from "../utils/RequestUtil";
import { IFilter } from "./IFilter";
import { setAuthorities } from "../hooks"
/**
 * Authorization Filter
 */
export default class AuthorizationFilter implements IFilter {

    /**
     * @description Descriptions authorization filter
     * @param props 
     * @returns filter 
     */
    public async doFilter(props: RouteComponentProps<{}, StaticContext, unknown>): Promise<boolean> {
        let accessable: boolean = true;
        if (props.location.pathname !== '/login' && props.location.pathname !== '/driverSide/taskDetail') {
            accessable = !!(AuthUtil.getAuthorization() && AuthUtil.getSinzetechAuth() && AuthUtil.getTenantId());
            if (accessable) {
                const [, authorities] = await Promise.all<any>([
                    RequestUtil.get<any>('/sinzetech-user/user/info'),
                    RequestUtil.get<AuthorityBasic[]>('/sinzetech-system/role/componentList')
                ]);
                // ApplicationContext.get({ authorities: authorities });
                setAuthorities(authorities as string[])
                EventBus.emit('get/authorities');
            } else {
                // const { location } = window;
                // props.history.replace(`/login?goto=${encodeURIComponent(location.href.replace(`${location.protocol}//${location.host}`, ''))}`);
                props.history.replace(`/login`);
            }
        }
        return Promise.resolve(accessable);
    }
}