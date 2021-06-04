/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import ApplicationContext from './configuration/ApplicationContext';
import { ComponentClazz, IRouterItem } from './configuration/IApplicationContext';

function App() {
  const frame: ComponentClazz | undefined = ApplicationContext.get().layout?.frame;
  const Frame: React.ComponentClass | undefined = frame?.componentClass;
  return (
    <Router>
      <Switch>
        {
          ApplicationContext.get().globalRouters?.map<React.ReactNode>((router: IRouterItem): React.ReactNode => (
            router.path
            ?
            <Route path={ router.path } key={ router.path } exact={ router.exact }
                render={ ApplicationContext.routeRender(router.module) }/>
            :
            null
          ))
        }
        {
          Frame
          ? 
          <Frame { ...frame?.props }/>
          :
          null
        }
      </Switch>
    </Router>
  );
}

export default App;
