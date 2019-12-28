import React from 'react';
import Home from './components/home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
// npm install --save react-router-dom

// eslint-disable-next-line require-jsdoc
function App() {
  // need some function to request id from backend for each student
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home/>
        </Route>
        {/* // here we are needing to route each page to an id */}
      </Switch>
    </Router>
  );
}


export default App;
