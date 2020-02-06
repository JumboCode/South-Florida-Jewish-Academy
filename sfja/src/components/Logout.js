import {useAuth0} from '../react-auth0-spa';
import React from 'react';

const Logout = () => {
  const {logout} = useAuth0();
  return (
    <div >
      {<button onClick={() => logout()}>LOGOUT</button>}
    </div>
  );
};

export default Logout;

