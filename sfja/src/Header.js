import React from 'react';

class Header extends React.Component {

    constructor(props){
        super(props);
        this.state = {tab: "dashboard"};
    }
    componentDidMount(){

    }
    //handle click changes tab 
    clickButton = () => {
      this.setState({
        tab: "students"
      })
    }
    render() {

        if (this.state.tab == "dashboard"){
                  return(
             <div> Ya dashboard
             <button onClick={this.clickButton}>click me</button></div>
          )
        }
        if (this.state.tab == "students"){
          return(
            <div> Yo students </div>
          );
        }
        if (this.state.tab == "upload forms"){
           return(
            <div>Yo upload yo forms here</div>
          ); 
        }
  };
};
export default Header;