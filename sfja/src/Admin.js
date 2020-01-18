import React from 'react';
import Header from './components/Header';
import Students from './components/Students/Students';
import NavBar from "./components/NavBar";
import {useAuth0} from "./components/react-auth0-spa";
import routing from './index.js';


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

  // eslint-disable-next-line require-jsdoc
  render() {
    const {loggedIn, tab} = this.state;

    if (!loggedIn) {
      return (
        <NavBar/>
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
        {tab === 'logout' && <div>logout </div>}
      </div>
    );
  }
}

export default Admin;
