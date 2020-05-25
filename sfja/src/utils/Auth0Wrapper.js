import {useAuth0} from '../react-auth0-spa';
import React, {useState} from 'react';


// eslint-disable-next-line require-jsdoc
export function withAuth0(Component) {
  return function WrappedComponent(props) {
    const {getTokenSilently, loading} = useAuth0();
    const [token, setToken] = useState(null);

    if (loading) {
      return <div/>;
    }
    getTokenSilently().then((token) => {
      setToken(token);
    });
    if (token === null) {
      return <div/>;
    } else {
      return <Component {...props} token={token} />;
    }
  };
};
