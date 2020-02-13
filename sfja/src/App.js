import React from 'react';
import Home from './components/home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Student from './components/Students/Student';
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
        <Route exact path="/profile">
          <Student/>
        </Route>
        {/* // here we are needing to route each page to an id */}
      </Switch>
    </Router>
  );
}


export default App;
