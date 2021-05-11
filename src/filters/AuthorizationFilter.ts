/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */

import { RouteComponentProps, StaticContext } from "react-router";
import { IFilter } from "./IFilter";

/**
 * Authorization Filter
 */
export default class AuthorizationFilter implements IFilter {

    /**
     * @description Do filter
     * @param props 
     * @returns true if filter 
     */
    public doFilter(props: RouteComponentProps<{}, StaticContext, unknown>): boolean {
        return true;
    }
}