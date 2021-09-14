/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { RouteComponentProps } from 'react-router';

import ApplicationContext from '../configuration/ApplicationContext';
import AsyncComponent from './AsyncComponent';

/**
 * Can get title from router config item, if the component extends from this abstract class
 */
export default abstract class AbstractTitledRouteComponent<P extends RouteComponentProps, S = {}> extends AsyncComponent<P, S> {

    /**
     * @protected
     * @description Gets title
     * @returns title 
     */
     protected getTitle(): string {
        return ApplicationContext.getRouterItemByPath(this.props.location.pathname)?.name || '';
    }
}