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
 * Default Content Panel
 */
export default class DefaultContentPanel extends AsyncComponent<IDefaultContentPanelProps, IDefaultContentPanelState> {

    /**
     * @description Renders DefaultContentPanel
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <>
                {
                    ApplicationContext.get().routers?.map<React.ReactNode>((router: IRouterItem): React.ReactNode => (
                        router.path
                        ?
                        <Route path={ router.path } key={ router.path } exact={ router.exact }
                            render={ ApplicationContext.routeRender(router.module) }/>
                        :
                        null
                    ))
                }
            </>
        );
    }
}