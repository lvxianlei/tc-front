/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { RouteComponentProps } from 'react-router';

/**
 * @description The interface of filter under the web router.
 */
export interface IFilter {

    /**
     * @description 
     * @template RP 
     * @param props 
     * @returns filter 
     */
    doFilter(props: RouteComponentProps<{}>): Promise<boolean>;
}