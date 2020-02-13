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
import {ReactComponent as EmailIconGray} from '../assets/Email_gray.svg';
import topLogo from '../assets/CircleLogo.png';
import {Link} from 'react-router-dom';

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
    return (
      <div>
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
        </div>
      </div>
    );
  };
};
export default Header;
