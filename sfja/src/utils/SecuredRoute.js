import React from 'react';
import {Route} from 'react-router-dom';
import auth0Client from "./Auth";

function SecuredRoute(props) {
  const {component: Component, path} = props;
  console.log('securedRoute', props)
  return (
    <Route path={path} render={() => {
      if (!auth0Client.isAuthenticated()) {
        console.log('not auth')
        auth0Client.callback = '/students'
        auth0Client.signIn();
        return <div></div>;
      }
      return <Component />;
    }} />
  );
}

export default SecuredRoute;