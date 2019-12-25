import React from 'react';
import ReactDOM from 'react-dom';
import './header.css';
    
var chosen = document.createAttribute('checked'); 
chosen.value = "false";   

class Header extends React.Component {

    render() {
      const {setTab, selectedTab} = this.props;
      return(
        <div>
          <img src="CircleLogo.png"></img>
          {/* logo would go here */}
          <div className="navbar">
            <div onClick={() => setTab('dashboard')}> Dashboard
             <div
                 style={{
                  backgroundColor: selectedTab == 'dashboard' ? '#0068af' : null,
                  width: 80,
                  height: 10
                }} 
              > </div>
            </div>
            <a onClick={() => setTab('students')}>Students
            <div
                 style={{
                  backgroundColor: selectedTab == 'students' ? '#0068af' : null,
                  width: 80,
                  height: 10
                }}></div>
            </a>
            <a onClick={() => setTab('upload')}> Upload Forms
            <div
                 style={{
                  backgroundColor: selectedTab == 'upload' ? '#0068af' : null,
                  width: 80,
                  height: 10
                }}></div>
            </a>
            <a onClick={() => setTab('email')}> Email
            <div
                 style={{
                  backgroundColor: selectedTab == 'email' ? '#0068af' : null,
                  width: 80,
                  height: 10
                }}></div>
            </a>
            <a onClick={() => setTab('settings')}> Settings
            <div
                 style={{
                  backgroundColor: selectedTab == 'settings' ? '#0068af' : null,
                  width: 80,
                  height: 10
                }}></div>
            </a>
            <a onClick={() => setTab('logout')}> Logout
            <div
                 style={{
                  backgroundColor: selectedTab == 'logout' ? '#0068af' : null,
                  width: 80,
                  height: 10
                }}></div>
            </a>
          </div>
        </div>
      )
    };
};
export default Header;