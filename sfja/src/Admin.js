import React from 'react';
import Header from './header'
// eslint-disable-next-line require-jsdoc
class Admin extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      loggedIn: false,
      tab: ''
    }
  }

  setTab(newTab) {
    this.setState({
      tab: newTab
    })
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {loggedIn, tab} = this.state;
    
    if (!loggedIn){
      return(
        <div
          onClick={() => this.setState({loggedIn: true})}
        >Login</div>
      )
    }

    return (
      <div>
        <Header setTab={this.setTab.bind(this)} />
        {tab == "settings" ? <div>settings </div> : null}
      </div>);
  }
}


export default Admin;
