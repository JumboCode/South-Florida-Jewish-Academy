import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {Auth0Provider} from './react-auth0-spa';
import config from './auth_config.json';
import history from './utils/history';
import Form from './Form';
import {Route, BrowserRouter as Router, Redirect} from 'react-router-dom';
import Header from './components/Header';
import Student from './components/Students/Student';
import Dashboard from './components/Dashboard';
import Students from './components/Students/Students';
import AddStudent from './components/AddStudent/AddStudent';
import LoginPage from './components/LoginPage';
import Logout from './components/Logout';
import Upload from './components/Upload';


// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState) => {
  history.push(
        appState && appState.targetUrl ?
            appState.targetUrl :
            window.location.pathname,
  );
};

const routing = (
  <Router>
    <div style={{width: '100vw'}}>
      {/* eslint-disable-next-line max-len */}
      <Route path={['/dashboard', '/students', '/upload', '/addStudent', '/profile']} component={Header}/>
      <Route exact path="/">
        <Redirect to="/dashboard" />
      </Route>
      {/* <Route exact path="/admin" component={Admin} />*/}
      <Route path="/form/:key" component={Form} />
      <Route path="/profile/:id" component={Student} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/students" component={Students} />
      <Route exact path="/upload" component={Upload} />
      <Route exact path="/addStudent" component={AddStudent} />
      <Route exact path="/login" component={LoginPage}/>
      <Route exact path="/logout" component={Logout}/>
    </div>
  </Router>
);

ReactDOM.render(
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      {routing}
    </Auth0Provider>,
    document.getElementById('root'),
);


serviceWorker.unregister();
