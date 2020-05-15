import React from 'react';
import {Route} from 'react-router-dom';
import auth0Client from './Auth';

function SecuredRoute(props) {
  const {component: Component, path} = props;
  return (
    <Route path={path} render={(props) => {
      if (!auth0Client.isAuthenticated()) {
        auth0Client.signIn();
        return <div></div>;
      }
      return <Component {...props}/>;
    }} />
  );
}

export default SecuredRoute;