// src/components/NavBar.js

import React from 'react';
import {useAuth0} from './react-auth0-spa';


const NavBar = ({authenticate}) => {
  const {isAuthenticated, loginWithRedirect, logout, loading} = useAuth0();
  console.log('navbar');
  console.log('loading', loading, 'isAuth', isAuthenticated)
  if (isAuthenticated){
    console.log('isauth')
    authenticate();
    return (
        <div>
          done
        </div>
    )
  }
  return (
    <div>

      {!isAuthenticated && <button onClick={() => loginWithRedirect({})}>LOGIN</button>}

      {isAuthenticated && <button onClick={() => logout()}>LOGOUT</button>}


    </div>


  );
};

export default NavBar;
