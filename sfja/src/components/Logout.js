import {useAuth0} from '../react-auth0-spa';
import React from 'react';
import {useCookies} from 'react-cookie';

const Logout = () => {
  // if (useAuth0() === undefined)
  //   return (<div/>)
  const {logout} = useAuth0();
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies();
  logout();
  removeCookie('studentsCache');
  removeCookie('token');
  return (
    <div >
      Logging out...
    </div>
  );
};

export default Logout;

