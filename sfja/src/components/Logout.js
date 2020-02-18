import {useAuth0} from '../react-auth0-spa';
import React from 'react';

const Logout = () => {
  // if (useAuth0() === undefined)
  //   return (<div/>)
  const {logout} = useAuth0();
  logout();
  return (
    <div >
      Logging out...
    </div>
  );
};

export default Logout;

