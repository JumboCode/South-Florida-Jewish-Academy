import React from 'react';
import './Header.css';
import {Link, Redirect} from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import HomeIcon from '@material-ui/icons/Home';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import People from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ListAltIcon from '@material-ui/icons/ListAlt';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {useAuth0} from '../react-auth0-spa';
/* eslint-disable max-len */


const tabStyle = {color: 'grey', fontSize: 10, outline: 'none', textDecoration: 'none', minWidth: 20};

// eslint-disable-next-line require-jsdoc
export default function Header() {
  const [value, setValue] = React.useState(1);
  const {isAuthenticated} = useAuth0();
  if (!isAuthenticated) {
    return (
      <Redirect to={'/login'}/>
    );
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
          <div>
            <div id='toptitle'>
              South Florida Jewish Academy
            </div>
            <div id="topsubtitle">Admissions Page</div>
          </div>
          <Tab icon={<HomeIcon fontSize='large'/>} label='dashboard' to={'/dashboard'} component={Link} style={tabStyle}/>
          <Tab icon={<PeopleAltIcon fontSize='large'/>} label='students' to='/students' component={Link} style={tabStyle}/>
          <Tab icon={<People fontSize='large'/>} label='parents' to='/parents' component={Link} style={tabStyle}/>
          <Tab icon={<ListAltIcon fontSize='large'/>} label='forms' to='/formManager' component={Link} style={tabStyle}/>
          <Tab icon={<PersonAddIcon fontSize='large'/>} label='add student' to='/addStudent' component={Link} style={tabStyle}/>
          <Tab icon={<ExitToAppIcon fontSize='large'/>} label='logout' to='/logout' component={Link} style={tabStyle}/>
        </Tabs>
      </Paper>
    </div>
  );
}
