import React from 'react';
import {useAuth0} from '../react-auth0-spa';
import './LoginPage.css';
import {Redirect} from 'react-router-dom';

/* eslint react/prop-types: 0 */
const LoginChecker = () => {
  const {isAuthenticated} = useAuth0();

  if (isAuthenticated) {
    return (
      <div/>
    )
  } else {
    return (
      <Redirect to={'/login'}/>
    )
  }
};

export default LoginChecker;
