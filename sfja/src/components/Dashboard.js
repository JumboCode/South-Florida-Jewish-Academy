import React from 'react';
import {useAuth0} from '../react-auth0-spa';


const welcomeStyle = {
  fontSize: 30,
  fontFamily: 'Futura',
  color: 'SteelBlue',
};

const wrapperStyle = {
  margin: 20,
};

// eslint-disable-next-line require-jsdoc
export default function Dashboard() {
  const {user} = useAuth0();

  return (
    <div style={wrapperStyle}>
      <div style={welcomeStyle}>
        Welcome, {user ? user.nickname : null}
      </div>
    </div>

  );
}
