import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import RouteWithLayout from './components/RouteWithLayout/RouteWithLayout';
import Main from './layouts/Main/Main'
import Dashboard from './views/Dashboard/Dashboard';

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
    </Switch>
  );
};

export default Routes;
