/* eslint-disable react/prop-types */
import React from 'react';
import './Header.css';
import {Link, Redirect} from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
// import HomeIcon from '@material-ui/icons/Home';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ListAltIcon from '@material-ui/icons/ListAlt';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import {useAuth0} from '../react-auth0-spa';
/* eslint-disable max-len */


const tabStyle = {color: 'grey', fontSize: 10, outline: 'none', textDecoration: 'none', minWidth: 20};

const tabs = ['/students', '/formManager', '/addStudent', '/administration'];

// eslint-disable-next-line require-jsdoc
export default function Header(props) {
  const [value, setValue] = React.useState(tabs.indexOf(props.match.path) + 1);
  const {isAuthenticated} = useAuth0();
  if (isAuthenticated !== undefined && !isAuthenticated) {
    return (
      <Redirect to={'/login'}/>
    );
  }

  // compatibility for forwards/back buttons
  if (tabs.indexOf(props.match.path) + 1 !== value) {
    setValue(tabs.indexOf(props.match.path) + 1);
  }

  return (
    <div>
      <Paper square >
        <Tabs
          value={value}
          onChange={(e, newValue) => {
            setValue(newValue);
          }}
          variant="fullWidth"
          TabIndicatorProps={{style: {background: '#0068af'}}}
          aria-label="icon tabs example"
        >
          <div
            style={{cursor: 'pointer'}}
            onClick={() => {
              if (props.match.path !== '/students') {
                props.history.push('/students');
              }
            }}
          >
            <div id='toptitle'>
              South Florida Jewish Academy
            </div>
            <div id="topsubtitle">Admissions Page</div>
          </div>
          {/* <Tab icon={<HomeIcon fontSize='medium'/>} label='dashboard' to={'/dashboard'} component={Link} style={tabStyle}/>*/}
          <Tab icon={<PeopleAltIcon fontSize='medium'/>} label='students' to='/students' component={Link} style={tabStyle}/>
          <Tab icon={<ListAltIcon fontSize='medium'/>} label='forms' to='/formManager' component={Link} style={tabStyle}/>
          <Tab icon={<PersonAddIcon fontSize='medium'/>} label='add student' to='/addStudent' component={Link} style={tabStyle}/>
          <Tab icon={<SupervisorAccountIcon fontSize='medium'/>} label='administration' to='/administration' component={Link} style={tabStyle}/>
          <Tab icon={<ExitToAppIcon fontSize='medium'/>} label='logout' to='/logout' component={Link} style={tabStyle}/>
        </Tabs>
      </Paper>
    </div>
  );
}
