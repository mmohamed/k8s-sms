import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import RouteWithLayout from './components/RouteWithLayout/RouteWithLayout';
import Main from './layouts/Main/Main'
import Minimal from './layouts/Minimal/Minimal'
import Dashboard from './views/Dashboard/Dashboard';
import Login from './views/Security/Login';

const Routes = () => {
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/dashboard"
      />
      <RouteWithLayout
        component={Dashboard}
        exact
        layout={Main}
        path="/dashboard"
      />
      <RouteWithLayout
        component={Login}
        exact
        layout={Minimal}
        path="/signin"
      />
    </Switch>
  );
};

export default Routes;
