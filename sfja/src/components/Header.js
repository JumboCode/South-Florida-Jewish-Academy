import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';
import {ReactComponent as UploadIcon} from '../assets/Upload.svg';
import {ReactComponent as UploadIconGray} from '../assets/Upload_gray.svg';
import {ReactComponent as StudentsIcon} from '../assets/Students.svg';
import {ReactComponent as StudentsIconGray} from '../assets/Students_gray.svg';
import {ReactComponent as HomeIcon} from '../assets/Home.svg';
import {ReactComponent as HomeIconGray} from '../assets/Home_gray.svg';
import {ReactComponent as EmailIcon} from '../assets/Email.svg';
<<<<<<< HEAD
import {ReactComponent as LogoutIcon} from '../assets/Logout.svg';
import {ReactComponent as AuditIcon} from '../assets/Audit.svg';
=======
import {ReactComponent as EmailIconGray} from '../assets/Email_gray.svg';
>>>>>>> 6316add8251702eccf3113197fdd4b47ae26fe7f
import topLogo from '../assets/CircleLogo.png';
import {Link} from 'react-router-dom';
import LoginChecker from './LoginChecker';

/**
 * @classdesc The Header class acts as a navigation bar.
 */
class Header extends React.Component {
  static propTypes = {
    setTab: PropTypes.string,
    selectedTab: PropTypes.string,
    currTab: PropTypes.string,
  };

  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state={
      hover: '',
    };
  }

  /**
   * @see {@link https://reactjs.org/docs/react-dom.html#render}
   * @return {Reference}
   */
  render() {
    const {currTab} = this.props;
    const {hover} = this.state;

    console.log(currTab);
    return (
      <div>
        <LoginChecker/>
        <img
          style={{width: 120}}
          id="topLogo" src={topLogo}></img>
        <div id="toptitle">
          South Florida Jewish Academy <br></br>
          <div id="topsubtitle">Admissions Page</div>
        </div>
        <div className="navbar"
        >
          <Link to='/dashboard'
            onMouseEnter={() => this.setState({hover: 'dashboard'})}
            onMouseLeave={() => this.setState({hover: ''})}
            style={{textDecoration: 'none'}}
          >
            <div
              style={{display: 'flex'}}
            >
              {hover === 'dashboard' ? <HomeIconGray/> : <HomeIcon/>}
              <span
                style={{
                  marginTop: 5,
                  marginLeft: 7,
                  color: hover === 'dashboard' ? '#878686' : 'white',
                }}>dashboard
              </span>
            </div>

            <div style={{
              backgroundColor: '#0068af',
              height: 5,
              width: currTab === 'dashboard' ? 135 : 0,
              marginTop: 10,
            }}/>
          </Link>

          <Link to='/students'
            onMouseEnter={() => this.setState({hover: 'students'})}
            onMouseLeave={() => this.setState({hover: ''})}
            style={{textDecoration: 'none'}}
          >
            <div
              style={{display: 'flex'}}
            >
              {hover === 'students' ? <StudentsIconGray/> : <StudentsIcon/>}
              <span
                style={{
                  marginTop: 5,
                  marginLeft: 7,
                  color: hover === 'students' ? '#878686' : 'white',
                }}>students
              </span>
            </div>

            <div style={{
              backgroundColor: '#0068af',
              height: 5,
              width: currTab === 'students' ? 109 : 0,
              marginTop: 10,
            }}/>
          </Link>

          <Link to='/upload'
            onMouseEnter={() => this.setState({hover: 'upload'})}
            onMouseLeave={() => this.setState({hover: ''})}
            style={{textDecoration: 'none'}}
          >
            <div
              style={{display: 'flex'}}
            >
              {hover === 'upload' ? <UploadIconGray/> : <UploadIcon/>}
              <span
                style={{
                  marginTop: 5,
                  marginLeft: 7,
                  color: hover === 'upload' ? '#878686' : 'white',
                }}>upload
              </span>
            </div>

            <div style={{
              backgroundColor: '#0068af',
              height: 5,
              width: currTab === 'upload' ? 101 : 0,
              marginTop: 10,
            }}/>
          </Link>

          <Link to='/email'
            onMouseEnter={() => this.setState({hover: 'email'})}
            onMouseLeave={() => this.setState({hover: ''})}
            style={{textDecoration: 'none'}}
          >
            <div
<<<<<<< HEAD
              style={{
                backgroundColor: selectedTab == 'email' ? '#0068af' : null,
                position: 'absolute',
                marginTop: 19,
                width: 90,
                height: 7,
              }}></div>
          </a>
          <AuditIcon></AuditIcon>
          <a onClick={() => setTab('audit')}>Audit
            <div
              style={{
                backgroundColor: selectedTab == 'audit' ? '#0068af' : null,
                position: 'absolute',
                marginTop: 19,
                width: 100,
                height: 7,
              }}></div>
          </a>
          <LogoutIcon></LogoutIcon>
          <a onClick={() => setTab('logout')}>Logout
=======
              style={{display: 'flex'}}
            >
              {/* eslint-disable-next-line max-len */}
              <span style={{height: 30, marginTop: 3}}>{hover === 'email' ? <EmailIconGray/> : <EmailIcon/>}</span>

              <span
                style={{
                  marginTop: 4,
                  marginLeft: 7,
                  color: hover === 'email' ? '#878686' : 'white',
                }}>email
              </span>
            </div>

            <div style={{
              backgroundColor: '#0068af',
              height: 5,
              width: currTab === 'email' ? 86 : 0,
              marginTop: 10,
            }}/>
          </Link>
          <Link to='/logout'
            onMouseEnter={() => this.setState({hover: 'logout'})}
            onMouseLeave={() => this.setState({hover: ''})}
            style={{textDecoration: 'none'}}
          >
>>>>>>> 6316add8251702eccf3113197fdd4b47ae26fe7f
            <div
              style={{display: 'flex'}}
            >
              {/* eslint-disable-next-line max-len */}
              <span style={{height: 30, marginTop: 3}}>{hover === 'logout' ? <EmailIconGray/> : <EmailIcon/>}</span>

              <span
                style={{
                  marginTop: 4,
                  marginLeft: 7,
                  color: hover === 'logout' ? '#878686' : 'white',
                }}>logout
              </span>
            </div>

            <div style={{
              backgroundColor: '#0068af',
              height: 5,
              width: currTab === 'logout' ? 86 : 0,
              marginTop: 10,
            }}/>
          </Link>
        </div>
      </div>
    );
  };
};
export default Header;
