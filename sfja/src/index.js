import React from 'react';
import './index.css';
import Admin from './Admin';
import Form from './Form';
import * as serviceWorker from './serviceWorker';
import {Route, BrowserRouter as Router, Redirect} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import Audit from './components/Audit';

const routing = (
  <Router>
    <div>
      <Route exact path="/">
        <Redirect to="/admin" />
      </Route>
      <Route exact path="/admin" component={Audit} />
      <Route path="/form/:key" component={Form} />
      <Route exact path="/header" component={Header} />
    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
