/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */

import { RouteComponentProps } from "react-router";

export interface IFilter {

    /**
     * @description 
     * @returns filter 
     */
    doFilter(props: RouteComponentProps<{}>): boolean;
}