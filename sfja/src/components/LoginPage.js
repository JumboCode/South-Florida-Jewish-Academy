import React from 'react';
import {useAuth0} from '../react-auth0-spa';
import './LoginPage.css';
import CircleLogo from '../assets/CircleLogo.png';
import {Redirect} from 'react-router-dom';
import {useCookies} from 'react-cookie';
/* eslint react/prop-types: 0 */

const LoginPage = (props) => {
  const {isAuthenticated, loginWithPopup, getTokenSilently} = useAuth0();
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies();

  if (isAuthenticated) {
    getTokenSilently().then((token) => {
      setCookie('token', token, {path: '/'});
    });
    return (
      <Redirect to="/dashboard"/>
    );
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
        <hr/>
        <div className="button_container">
          <button className="button" onClick={() => loginWithPopup({})}>
            log in
          </button>
        </div>
      </div>
      <div className="bottom_message">
        Looking for your student&apos;s form? <br/>
        Check your email or contact administration for more information.
      </div>

    </div>
  );
};


export default LoginPage;
