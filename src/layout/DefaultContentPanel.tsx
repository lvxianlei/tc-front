/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import AsyncPanel from '../AsyncPanel';
import AsyncComponent from '../components/AsyncComponent';
import { AuthorityBasic, hasAuthority } from '../components/AuthorityComponent';
import ApplicationContext from '../configuration/ApplicationContext';
import { IRouterItem } from '../configuration/IApplicationContext';

export interface IDefaultContentPanelProps { }
export interface IDefaultContentPanelState {
    readonly shouldRender: boolean | undefined;
}

/**
 * Default Content Panel
 */
export default class DefaultContentPanel<P extends IDefaultContentPanelProps, S extends IDefaultContentPanelState> extends AsyncComponent<P, S> {

    /**
     * @description State  of default content panel
     */
    public state: S = this.getState();

    /**
     * @description Gets state
     * @returns state 
     */
    protected getState(): S {
        return {
            shouldRender: undefined
        } as S;
    }

    /**
     * @description Renders route
     * @param module 
     * @returns route 
     */
    protected renderRoute(module: string | undefined, authority: AuthorityBasic): (props: RouteComponentProps<{}>) => React.ReactNode {
        return (props: RouteComponentProps<{}>): React.ReactNode => {
            if (this.state.shouldRender === undefined) {
                ApplicationContext.doFiltersAll(props).then((permit: boolean): void => {
                    this.setState({
                        shouldRender: permit
                    });
                });
            }
            return (
                <>
                    {
                        (hasAuthority(authority) || authority === "all") && this.state.shouldRender
                            ?
                            <AsyncPanel module={module} />
                            :
                            null
                    }
                </>
            );
        }
    }

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
                            <Route path={router.path} key={router.path} exact={router.exact}
                                render={this.renderRoute(router.module, router.authority)} />
                            :
                            null
                    ))
                }
            </>
        );
    }
}
