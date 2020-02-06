import React from 'react';
import {useAuth0} from '../react-auth0-spa';
import './LoginPage.css';
import CircleLogo from '../assets/CircleLogo.png';
/* eslint react/prop-types: 0 */

const LoginPage = ({authenticate}) => {
  const {isAuthenticated, loginWithRedirect} = useAuth0();

  if (isAuthenticated) {
    authenticate();
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
            <button onClick={() => loginWithRedirect({})}>Log in</button>
          )}
        </div>
      </div>
    </div>
  );
};


export default LoginPage;
