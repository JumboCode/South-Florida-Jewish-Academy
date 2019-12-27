import React from 'react';
import ReactDOM from 'react-dom';
import './header.css';
import {ReactComponent as UploadIcon} from './VectorsForNavbar/Upload.svg';
import {ReactComponent as StudentsIcon} from './VectorsForNavbar/Students.svg';
import {ReactComponent as HomeIcon} from './VectorsForNavbar/Home.svg';
import {ReactComponent as EmailIcon} from './VectorsForNavbar/Email.svg';
import {ReactComponent as LogoutIcon} from './VectorsForNavbar/Logout.svg';

var chosen = document.createAttribute('checked'); 
chosen.value = "false";   

class Header extends React.Component {

    render() {
      const {setTab, selectedTab} = this.props;
      return(
        <div>
          <div id="toptitle">
          {/* logo would go here */}
          South Florida Jewish Academy <br></br><div id="topsubtitle">Admissions Page</div>
          </div>
          <div className="navbar">
            <HomeIcon></HomeIcon>
            <div onClick={() => setTab('dashboard')}> Dashboard
             <div
                 style={{
                  backgroundColor: selectedTab == 'dashboard' ? '#0068af' : null,
                  width: 150,
                  height: 10
                }} 
              > </div>
            </div>
            <StudentsIcon></StudentsIcon>
            <a onClick={() => setTab('students')}>Students
            <div
                 style={{
                  backgroundColor: selectedTab == 'students' ? '#0068af' : null,
                  width: 150,
                  height: 10
                }}></div>
            </a>
            <UploadIcon></UploadIcon>
            <a onClick={() => setTab('upload')}> Upload Forms
            <div
                 style={{
                  backgroundColor: selectedTab == 'upload' ? '#0068af' : null,
                  width: 150,
                  height: 10
                }}></div>
            </a>
            <EmailIcon></EmailIcon>
            <a onClick={() => setTab('email')}> Email
            <div
                 style={{
                  backgroundColor: selectedTab == 'email' ? '#0068af' : null,
                  width: 150,
                  height: 10
                }}></div>
            </a>
            <LogoutIcon></LogoutIcon>
            <a onClick={() => setTab('logout')}> Logout
            <div
                 style={{
                  backgroundColor: selectedTab == 'logout' ? '#0068af' : null,
                  width: 150,
                  height: 10
                }}></div>
            </a>
          </div>
        </div>
      )
    };
};
export default Header;