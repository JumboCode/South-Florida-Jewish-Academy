import React from 'react';
import Header from './Header';
import FormManager from './components/FormManager';

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
        <div
          onClick={() => this.setState({loggedIn: true})}
        >Login</div>
      );
    }
    return (
      <div>
        <Header setTab={this.setTab.bind(this)} selectedTab={tab}/>
        {tab === 'dashboard' ? <div>dashboard </div> : null}
        {tab === 'students' ? <div>students </div> : null}
        {tab === 'upload' ? <div> <FormManager /> </div> : null}
        {tab === 'email' ? <div>email </div> : null}
        {tab === 'logout' ? <div>logout </div> : null}
      </div>);
  }
}

export default Admin;
