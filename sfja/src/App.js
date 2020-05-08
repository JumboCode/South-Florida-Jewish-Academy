/* eslint-disable max-len */
import history from './utils/history';
import config from './auth_config';
import {BrowserRouter as Router, Redirect, Route} from 'react-router-dom';
import Header from './components/Header';
import ParentHeader from './components/ParentDash/ParentHeader';
import ParentDash from './components/ParentDash/ParentDash';
import StudentDash from './components/ParentDash/StudentDash';
import StudentProfile from './components/StudentProfile/StudentProfile';
// import Dashboard from './components/Dashboard';
import Students from './components/Students/Students';
import FormManager from './components/FormManager/FormManager';
import AddStudent from './components/AddStudent/AddStudent';
import LoginPage from './components/LoginPage';
import Logout from './components/Logout';
import FormViewer from './components/StudentProfile/FormViewer';
import {Auth0Provider} from './react-auth0-spa';
import React from 'react';
import {CookiesProvider} from 'react-cookie';
import Audit from './components/Audit';

// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.targetUrl ?
      appState.targetUrl :
      window.location.pathname,
  );
};

// eslint-disable-next-line require-jsdoc
export default function App() {
  return (
    <CookiesProvider>
      <Auth0Provider
        domain={config.domain}
        client_id={config.clientId}
        redirect_uri={window.location.origin}
        onRedirectCallback={onRedirectCallback}
        audience={config.audience}
      >
        <Router>
          <div style={{width: '100vw'}}>
            <Route path={['/students', '/formManager', '/addStudent', '/profile', '/audit', '/formViewer']} component={Header}/>
            <Route exact path="/">
              <Redirect to="/students" />
            </Route>
            <Route path={['/parentdash/:parentKey/:studentId', '/parentdash/:parentKey/']} component={ParentHeader} />
            <Route exact path='/parentdash/:parentKey' component={ParentDash}/>
            <Route exact path="/parentdash/:parentKey/:studentId" component={StudentDash}/>
            <Route exact path="/profile/:id" component={StudentProfile} />
            <Route exact path="/profile/:studentId/:formId" component={FormViewer} />
            {/* <Route exact path="/dashboard" component={Dashboard} />*/}
            <Route exact path="/students" component={Students} />
            <Route exact path="/formManager" component={FormManager} />
            <Route exact path="/addStudent" component={AddStudent} />
            <Route exact path="/login" component={LoginPage}/>
            <Route exact path="/logout" component={Logout}/>
            <Route exact path="/audit" component={Audit}/>
          </div>
        </Router>
      </Auth0Provider>
    </CookiesProvider>

  );
}
