/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import AsyncPanel from './AsyncPanel';
import ApplicationContext from './configuration/ApplicationContext';
import { ComponentClazz, IRouterItem } from './configuration/IApplicationContext';
import './App.module.less'
interface IAppState {
  readonly shouldRender: boolean | undefined;
}

/**
 * @description App class
 */
export default class App extends React.Component<{}, IAppState> {

  /**
   * @description State  of app
   */
  public state: IAppState = {
    shouldRender: undefined
  };

  /**
     * @description Renders route
     * @param module 
     * @returns route 
     */
  protected renderRoute(module: string | undefined): (props: RouteComponentProps<{}>) => React.ReactNode {
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
            this.state.shouldRender
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
   * @description Renders app
   * @returns render 
   */
  public render(): React.ReactNode {
    const frame: ComponentClazz | undefined = ApplicationContext.get().layout?.frame;
    const FrameComponent: React.ComponentClass | undefined = frame?.componentClass;
    return (
      <Router>
        <Switch>
          {
            ApplicationContext.get().globalRouters?.map<React.ReactNode>((router: IRouterItem): React.ReactNode => {

              if (!router.path) {
                return null;
              }

              if (router.redirect) {
                return <Redirect from={router.path} key={router.path} exact={router.exact} to={router.redirect} />
              }

              return <Route
                path={router.path}
                key={router.path}
                exact={router.exact}
                render={this.renderRoute(router.module)} />
            })
          }
          {
            FrameComponent
              ?
              <FrameComponent {...frame?.props} />
              :
              null
          }
        </Switch>
      </Router>
    );
  }
}
