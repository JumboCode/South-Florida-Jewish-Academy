import React from 'react';
import {useAuth0} from '../react-auth0-spa';
import './LoginPage.css';
import CircleLogo from '../assets/CircleLogo.png';
import {Route, BrowserRouter as Router, Redirect} from 'react-router-dom';
/* eslint react/prop-types: 0 */

const LoginPage = () => {
  const {isAuthenticated, loginWithPopup, logout} = useAuth0();

  if (isAuthenticated) {
    return (
      <Redirect to="/dashboard"/>
    )
  }
  return (
    <div className="App">
      <h1>
                South Florida Jewish Academy
      </h1>
      <h6>
                Kindergarten to Grade 12, give your child
        <br/>the best Education
      </h6>
      <br/>
      <div className="center_rect">
        <img className="logo" id="CircleLogo" src={CircleLogo}></img>
        <p>Administration Login </p>
        <hr>
        </hr>
        <div className="button_container">
          {!isAuthenticated && (
            <button onClick={() => loginWithPopup({})}>Log in</button>
          )}
          {isAuthenticated && (
            <button onClick={() => logout({})}>Log out</button>
          )}
        </div>
      </div>
    </div>
  );
};


export default LoginPage;
