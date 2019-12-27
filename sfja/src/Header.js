import React from 'react';
import ReactDOM from 'react-dom';
import './header.css';
import {ReactComponent as UploadIcon} from './VectorsForNavbar/Upload.svg';
import {ReactComponent as StudentsIcon} from './VectorsForNavbar/Students.svg';
import {ReactComponent as HomeIcon} from './VectorsForNavbar/Home.svg';
import {ReactComponent as EmailIcon} from './VectorsForNavbar/Email.svg';
import {ReactComponent as LogoutIcon} from './VectorsForNavbar/Logout.svg';
import topLogo from "./CircleLogo.png";


var chosen = document.createAttribute('checked'); 
chosen.value = "false";   

class Header extends React.Component {

    render() {
      const {setTab, selectedTab} = this.props;
      return(
        <div>
          <img id="topLogo" src={topLogo}></img>
          <div id="toptitle">
          South Florida Jewish Academy <br></br><div id="topsubtitle">Admissions Page</div>
          </div>
          <div className="navbar">
            <HomeIcon></HomeIcon>
            <div onClick={() => setTab('dashboard')}>Dashboard
             <div
                 style={{
                  backgroundColor: selectedTab == 'dashboard' ? '#0068af' : null,
                  position: "absolute",
                  marginTop: 19,
                  width: 140,
                  height: 7
                }} 
              > </div>
            </div>
            <StudentsIcon></StudentsIcon>
            <a onClick={() => setTab('students')}>Students
            <div
                 style={{
                  backgroundColor: selectedTab == 'students' ? '#0068af' : null,
                  position: "absolute",
                  marginTop: 19,
                  width: 120,
                  height: 7
                }}></div>
            </a>
            <UploadIcon></UploadIcon>
            <a onClick={() => setTab('upload')}>Upload Forms
            <div
                 style={{
                  backgroundColor: selectedTab == 'upload' ? '#0068af' : null,
                  position: "absolute",
                  marginTop: 19,
                  width: 170,
                  height: 7
                }}></div>
            </a>
            <EmailIcon></EmailIcon>
            <a onClick={() => setTab('email')}>Email
            <div
                 style={{
                  backgroundColor: selectedTab == 'email' ? '#0068af' : null,
                  position: "absolute",
                  marginTop: 19,
                  width: 90,
                  height: 7
                }}></div>
            </a>
            <LogoutIcon></LogoutIcon>
            <a onClick={() => setTab('logout')}>Logout
            <div
                 style={{
                  backgroundColor: selectedTab == 'logout' ? '#0068af' : null,
                  position: "absolute",
                  marginTop: 19,
                  width: 100,
                  height: 7
                }}></div>
            </a>
          </div>
        </div>
      )
    };
};
export default Header;