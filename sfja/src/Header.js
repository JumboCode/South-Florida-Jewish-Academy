import React from 'react';
import ReactDOM from 'react-dom';
import './header.css';

class Header extends React.Component {

    constructor(props){
        super(props);
        this.state = {tab: "dashboard"};
    }
    componentDidMount(){

    }
    render() {
      const {tab} = this.state;
      const {setTab} = this.props;
      return(
        <div>
          {/* logo would go here */}
          <div class ="navbar">
          <a onClick={() => this.setState({tab:"dashboard"})}> Dashboard </a>
          <a onClick={() => this.setState({tab:"students"})}> Students </a>
          <a onClick={() => this.setState({tab:"upload"})}> Upload Forms</a>
          <a onClick={() => this.setState({tab:"email"})}> Email </a>
          <a onClick={() => setTab('settings')}> Settings </a>
          <a onClick={() => this.setState({tab:"logout"})}> Logout </a>
          </div>
          {tab == "dashboard" ? <div>dashboard </div> : null}
          {tab == "students" ? <div>students </div> : null}
          {tab == "upload" ? <div>upload forms </div> : null}
          {tab == "email" ? <div> email </div> : null}
          {tab == "settings" ? <div>settings </div> : null}
          {tab == "logout" ? <div> logout </div> : null}
        </div>
      )
  };
};
export default Header;