import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { Modal } from 'antd';
import AuthUtil from "./utils/AuthUtil"
import Login from "./pages/login/Login"
import Layout from "./layout"
import './App.module.less'

const PrivateRoute = ({ component: Component }: any) => (
  <Route
    render={props => {
      if (AuthUtil.getSinzetechAuth()) {
        return <Component {...props} />
      } else {
        return <Redirect to={{ pathname: "/login" }} />
      }
    }
    }
  />
)

export default function App() {
  return (
    <Router getUserConfirmation={(message: any, callback: any) => {
      const formatMessage = message.split("/")
      Modal.confirm({
        title: formatMessage[0],
        content: formatMessage[1],
        onOk: () => callback(true),
        onCancel: () => callback(false)
      })
    }}>
      <Switch>
        <Route exact path="/login" component={Login} />
        <PrivateRoute path="/" component={Layout} />
      </Switch>
    </Router>
  );
}
