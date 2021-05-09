/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import ApplicationContext from './configuration/ApplicationContext';
import { ComponentClazz } from './configuration/IApplicationContext';

function App() {
  const frame: ComponentClazz | undefined = ApplicationContext.get().layout?.frame;
  const Frame: React.ComponentClass | undefined = frame?.componentClass;
  return (
    Frame
    ? 
    <Router>
      <Frame { ...frame?.props }/>
    </Router>
    :
    null
  );
}

export default App;
