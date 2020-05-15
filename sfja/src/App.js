/* eslint-disable max-len */
import history from './utils/history';
import config from './auth_config';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
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
import Administration from './components/Administration/Administration';
import BlankFormBuilder from './components/FormManager/BlankFormBuilder/BlankFormBuilder';
import PreviewBlankForm from './components/FormManager/PreviewBlankForm';

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
            <Route path={['/students', '/formManager', '/addStudent', '/audit', '/formViewer', '/administration', '/blankFormBuilder', '/blankFormViewer']} component={Header}/>
            <Route path={['/parentdash/:parentKey/:studentId', '/parentdash/:parentKey/']} component={ParentHeader} />
            <Switch>
              <Route exact path='/parentdash/:parentKey' component={ParentDash}/>
              <Route exact path="/parentdash/:parentKey/:studentId" component={StudentDash}/>
              <Route exact path="/students" component={Students} />
              <Route exact path="/students/:id" component={StudentProfile} />
              <Route exact path="/students/:studentId/:formId" component={FormViewer} />
              {/* <Route exact path="/dashboard" component={Dashboard} />*/}
              <Route exact path="/administration" component={Administration} />
              <Route exact path="/formManager" component={FormManager} />
              <Route exact path="/formManager/builder" component={BlankFormBuilder} />
              <Route exact path="/formManager/builder/:id" component={BlankFormBuilder} />
              <Route exact path="/formManager/viewer/:id" component={PreviewBlankForm} />
              <Route exact path="/addStudent" component={AddStudent} />
              <Route exact path="/login" component={LoginPage}/>
              <Route exact path="/logout" component={Logout}/>
              <Route component={LoginPage}/>
            </Switch>
          </div>
        </Router>
      </Auth0Provider>
    </CookiesProvider>

  );
}
