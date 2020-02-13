import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Auth0Provider} from './react-auth0-spa';
import config from './auth_config.json';
import history from './utils/history';
import Admin from './Admin';
import Form from './Form';
import {Route, BrowserRouter as Router, Redirect} from 'react-router-dom';
import Header from './components/Header';
import Student from './components/Students/Student';
import Dashboard from './components/Dashboard';
import Students from './components/Students/Students';
import Upload from './components/Upload';
import Email from './components/Email';


// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState) => {
  history.push(
        appState && appState.targetUrl ?
            appState.targetUrl :
            window.location.pathname
  );
};

ReactDOM.render(
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <App/>
    </Auth0Provider>,
    document.getElementById('root')
);

const routing = (
  <Router>
    <div>
      <Route exact path="/">
        <Redirect to="/admin" />
      </Route>
      <Route exact path="/admin" component={Admin} />
      <Route path="/form/:key" component={Form} />
      <Route path="/profile/:id" component={Student} />
      <Route exact path="/header" component={Header} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/students" component={Students} />
      <Route exact path="/upload" component={Upload} />
      <Route exact path="/email" component={Email} />
    </div>
  </Router>
);


serviceWorker.unregister();
