import React from 'react';
import Home from './components/home';
import FakeUserForm from './components/fakeUserForm'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"; 
//npm install --save react-router-dom

// eslint-disable-next-line require-jsdoc
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home/>
        </Route>
        <Route path="/FakeUserForm">
          <FakeUserForm/>
        </Route>
      </Switch>
  </Router>
);
}


export default App;
