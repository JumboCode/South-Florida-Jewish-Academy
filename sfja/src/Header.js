import React from 'react';
import ReactDOM from 'react-dom';
import './header.css';

class header extends React.Component {

    constructor(props){
        super(props);
        this.state = {tab: "dashboard"};
        //this.clickTab = this.clickTab.bind(this);
    }
    componentDidMount(){

    }
    render() {

      const {tab} = this.state;
        if (tab == "dashboard"){
          return(
            //TODO modularize-- have react write this code for other ones
            <div>
              <div class ="navbar">
              <a onClick={() => this.setState({tab:"dashboard"})}> Dashboard </a>
              <a onClick={() => this.setState({tab:"students"})}> Students </a>
              <a onClick={() => this.setState({tab:"upload forms"})}> Upload Forms</a>
              <a onClick={() => this.setState({tab:"email"})}> Email </a>
              <a onClick={() => this.setState({tab:"settings"})}> Settings </a>
              <a onClick={() => this.setState({tab:"logout"})}> Logout </a>
              </div>
              This is the dashboard
            </div>
          )
        }
        if (tab == "students"){
          return(
             <div>
              <div class ="navbar">
              <a onClick={() => this.setState({tab:"dashboard"})}> Dashboard </a>
              <a onClick={() => this.setState({tab:"students"})}> Students </a>
              <a onClick={() => this.setState({tab:"upload forms"})}> Upload Forms</a>
              <a onClick={() => this.setState({tab:"email"})}> Email </a>
              <a onClick={() => this.setState({tab:"settings"})}> Settings </a>
              <a onClick={() => this.setState({tab:"logout"})}> Logout </a>
              </div>
              This is the students page
 
            </div>
          );
        }
        if (tab == "upload forms"){
           return(
            <div>Yo upload yo forms here</div>
          ); 
        }
  };
};
export default header;