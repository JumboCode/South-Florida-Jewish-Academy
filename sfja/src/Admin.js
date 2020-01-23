import React from 'react';
import Header from './components/Header';
import Students from './components/Students/Students';
import NavBar from './components/NavBar';
import LoginPage from "./components/LoginPage";
import {useAuth0} from "./components/react-auth0-spa";
import Logout from "./components/Logout";
// import PropTypes from 'prop-types';


// eslint-disable-next-line require-jsdoc
class Admin extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      tab: 'dashboard',
    };
  }
  // eslint-disable-next-line require-jsdoc
  setTab(newTab) {
    this.setState({
      tab: newTab,
    });
  }

  authenticate = () => {
    this.setState({
      loggedIn: true
    })
  };

  // eslint-disable-next-line require-jsdoc
  render() {
    const {loggedIn, tab} = this.state;
    console.log('in admin', loggedIn)
    if (!loggedIn) {
      return (
          <LoginPage authenticate={this.authenticate.bind(this)}/>
      );
    }


    return (
      <div>
        <Header setTab={this.setTab.bind(this)} selectedTab={tab} />
        {tab === 'dashboard' && <div>dashboard </div>}
        {tab === 'students' && (
          <Students/>
        )}
        {tab === 'upload' && <div>upload forms </div>}
        {tab === 'email' && <div>email </div>}
        {tab === 'logout' && <Logout/>}
      </div>
    );
  }
}

export default Admin;
