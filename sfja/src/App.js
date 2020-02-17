import React from 'react';
import {useAuth0} from './react-auth0-spa';
import Admin from './Admin';


// eslint-disable-next-line require-jsdoc
function App() {
  const {loading} = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      hello
      {/*<header>*/}
      {/*  <Admin />*/}
      {/*</header>*/}
    </div>
  );
}

export default App;
