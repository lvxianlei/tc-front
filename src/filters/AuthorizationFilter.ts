/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */

import { IFilter } from "./IFilter";

/**
 * @TODO Describe the class
 */
export default class AuthorizationFilter implements IFilter {

    /**
     * @description Do filter
     * @returns filter 
     */
    public doFilter(): boolean {
        return true;
    }
    
}