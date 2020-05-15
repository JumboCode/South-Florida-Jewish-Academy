import React from 'react';
import {useAuth0} from '../react-auth0-spa';
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


const LoginPage = () => {
  const {isAuthenticated, loginWithPopup, getTokenSilently} = useAuth0();
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies();

  // eslint-disable-next-line max-len
  if (isAuthenticated && cookies.token !== undefined && cookies.studentsCache !== undefined) {
    return (
      <Redirect to="/students"/>
    );
  } else if (cookies.studentsCache !== '') {
    setCookie('studentsCache', '');
  } else if (isAuthenticated) {
    getTokenSilently().then((token) => {
      setCookie('token', token, {path: '/'});
    });
  }
  return (
    <div style={{
      fontFamily: 'Futura',
      textAlign: 'center',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
        <div style={{
          marginTop: 40,
          fontSize: 50,
          color: '#0068af',
        }}>
          South Florida Jewish Academy
        </div>
        <div style={{
          fontSize: 25,
          marginTop: 30,
        }}>
          Kindergarten to Grade 12, give your child
          <br/>the best Education
        </div>
        <br/>
        <div style={boxStyle}>
          <Paper
            elevation={5}
            style={{width: 350, marginTop: 30}}>
            <div style={imageStyle}>
              <img src={CircleLogo}/>
            </div>
            <div style={{
              fontSize: 30,
              marginTop: 20,
            }}
            >Administration Login </div>
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
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute',
          bottom: 20,
        }}>
          Looking for your student&apos;s form? <br/>
          Check your email or contact administration for more information.
        </div>
      </div>

    </div>
  );
};


export default LoginPage;
