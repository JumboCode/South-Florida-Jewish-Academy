import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';
import topLogo from '../assets/CircleLogo.png';
import {Link} from 'react-router-dom';
import LoginChecker from './LoginChecker';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import HomeIcon from '@material-ui/icons/Home';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ListAltIcon from '@material-ui/icons/ListAlt';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
/* eslint-disable max-len */


const tabStyle = {color: 'grey', fontSize: 12, outline: 'none', textDecoration: 'none'};


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
      value: 1,
    };
  }

  /**
   * @see {@link https://reactjs.org/docs/react-dom.html#render}
   * @return {Reference}
   */
  render() {
    const {value} = this.state;
    return (
      <div>
        <LoginChecker/>
        <Paper square >
          <Tabs
            value={value}
            onChange={(e, newValue) => {
              if (newValue !== 0) {
                this.setState({value: newValue});
              }
            }}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="icon tabs example"
          >
            <Tab disabled={true} icon={<img width={60} id="topLogo" src={topLogo}/>} style={{textAlign: 'left'}}/>
            <Tab icon={<HomeIcon fontSize='large'/>} label='dashboard' to={'/dashboard'} component={Link} style={tabStyle}/>
            <Tab icon={<PeopleAltIcon fontSize='large'/>} label='students' to='/students' component={Link} style={tabStyle}/>
            <Tab icon={<ListAltIcon fontSize='large'/>} label='form management' to='/upload' component={Link} style={tabStyle}/>
            <Tab icon={<PersonAddIcon fontSize='large'/>} label='add student' to='/addStudent' component={Link} style={tabStyle}/>
            <Tab icon={<ExitToAppIcon fontSize='large'/>} label='logout' to='/logout' component={Link} style={tabStyle}/>
          </Tabs>
        </Paper>
      </div>
    );
  };
};
export default Header;
