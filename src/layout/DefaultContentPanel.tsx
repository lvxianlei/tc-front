/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import AsyncPanel from '../AsyncPanel';
import AsyncComponent from '../components/AsyncComponent';
import ApplicationContext from '../configuration/ApplicationContext';
import { IRouterItem } from '../configuration/IApplicationContext';

export interface IDefaultContentPanelProps {}
export interface IDefaultContentPanelState {}

/**
 * @TODO Describe the class
 */
export default class DefaultContentPanel extends AsyncComponent<IDefaultContentPanelProps, IDefaultContentPanelState> {

    /**
     * @description Renders DefaultContentPanel
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <Switch>
                {
                    ApplicationContext.get().routers?.map<React.ReactNode>((router: IRouterItem): React.ReactNode => (
                        router.path
                        ?
                        <Route path={ router.path } key={ router.path } exact={ router.exact }
                            render={ this.routeRender(router.module) }/>
                        :
                        null
                    ))
                }
            </Switch>
        );
    }

    protected routeRender(module: string | undefined): (props: RouteComponentProps<{}>) => React.ReactNode {
        return (props: RouteComponentProps<{}>): React.ReactNode => {
            let valid: boolean = true;
            for (let filter of ApplicationContext.get().filters || []) {
                if (!filter.doFilter(props)) { // As long as one filter failed, valid will be false.
                    valid = false;
                }
            }
            if (valid) {
                return <AsyncPanel module={ module}/>;
            } else {
                return null;
            }
        };
    }
}