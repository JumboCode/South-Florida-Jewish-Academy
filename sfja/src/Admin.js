import React from 'react';
import StudentTab from './components/StudentTab';
import Header from './components/Header';

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
        <div onClick={() => this.setState({loggedIn: true})}>
                    Login
        </div>
      );
    }
    return (
      <div>
        <Header setTab={this.setTab.bind(this)} selectedTab={tab} />
        {tab === 'dashboard' && <div>dashboard </div>}
        {tab === 'students' && (
          <StudentTab/>
        )}
        {tab === 'upload' && <div>upload forms </div>}
        {tab === 'email' && <div>email </div>}
        {tab === 'logout' && <div>logout </div>}
      </div>
    );
  }
}

export default Admin;
