import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';
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


const tabStyle = {color: 'grey', fontSize: 10, outline: 'none', textDecoration: 'none', minWidth: 20};


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
              this.setState({value: newValue});
            }}
            variant="fullWidth"
            TabIndicatorProps={{style: {background: '#0068af'}}}
            textColor="primary"
            aria-label="icon tabs example"
          >
            <div>
              <div id='toptitle'>
                  South Florida Jewish Academy
              </div>
              <div id="topsubtitle">Admissions Page</div>
            </div>
            <Tab icon={<HomeIcon fontSize='medium'/>} label='dashboard' to={'/dashboard'} component={Link} style={tabStyle}/>
            <Tab icon={<PeopleAltIcon fontSize='medium'/>} label='students' to='/students' component={Link} style={tabStyle}/>
            <Tab icon={<ListAltIcon fontSize='medium'/>} label='forms' to='/upload' component={Link} style={tabStyle}/>
            <Tab icon={<PersonAddIcon fontSize='medium'/>} label='add student' to='/addStudent' component={Link} style={tabStyle}/>
            <Tab icon={<ExitToAppIcon fontSize='medium'/>} label='logout' to='/logout' component={Link} style={tabStyle}/>
          </Tabs>
        </Paper>
      </div>
    );
  };
};
export default Header;
