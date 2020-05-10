import React from 'react';
import {useAuth0} from '../react-auth0-spa';
import './LoginPage.css';
import CircleLogo from '../assets/CircleLogo.png';
import {Redirect} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import {Button} from '@material-ui/core';
import {Paper} from '@material-ui/core';
/* eslint react/prop-types: 0 */

const boxStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const imageStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 20,
};

const buttonBoxStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: 20,
};

const buttonStyle = {
  width: 150,
  fontSize: 25,
  backgroundColor: 'DarkOrange',
};


const LoginPage = (props) => {
  const {isAuthenticated, loginWithPopup, getTokenSilently} = useAuth0();
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies();

  if (cookies.studentsCache !== '') {
    setCookie('studentsCache', '', {path: '/'});
  }

  if (isAuthenticated) {
    getTokenSilently().then((token) => {
      setCookie('token', token, {path: '/'});
    });
    return (
      <Redirect to="/students"/>
    );
  }
  return (
    <div>
      <h1>
        South Florida Jewish Academy
      </h1>
      <h6>
        Kindergarten to Grade 12, give your child
        <br/>the best Education
      </h6>
      <br/>
      <div style={boxStyle}>
        <Paper
          elevation={5}
          style={{width: 350}}>
          <div style={imageStyle}>
            <img src={CircleLogo}/>
          </div>
          <p>Administration Login </p>
          <hr/>
          <div style={buttonBoxStyle}>
            <Button
              variant={'contained'}
              size={'large'}
              style={buttonStyle}
              onClick={() => loginWithPopup({})}>
              log in
            </Button>
          </div>
        </Paper>
      </div>
      <div className="bottom_message">
        Looking for your student&apos;s form? <br/>
        Check your email or contact administration for more information.
      </div>

    </div>
  );
};


export default LoginPage;
