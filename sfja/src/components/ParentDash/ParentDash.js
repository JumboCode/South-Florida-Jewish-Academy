import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Button } from '@material-ui/core';
import '../Header.css';
import {Link} from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import PersonIcon from '@material-ui/icons/Person';

const tabStyle = {color: 'grey', fontSize: 10, outline: 'none', textDecoration: 'none', minWidth: 20};

// eslint-disable-next-line require-jsdoc
class ParentDash extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          student_ids: [],
          student_names: [],
          hover: '',
          value: null,
          parent_key: this.props.match.params.parent_key,
      };
  }

  componentDidMount() {
    fetch('http://127.0.0.1:5000/getStudentsOfParent', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({curr_link: this.state.parent_key}),
      }).then((res) => res.json())
        .then((data) => {
          this.setState({student_ids: data.student_ids});
          this.setState({student_names: data.student_names});
          console.log(data);
        })
        .catch(console.log);
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {student_ids} = this.state;
    const {student_names} = this.state;
    const {parent_key} = this.state;
    const {value} = this.state;

    return (
      <div>
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
            <div id="topsubtitle">Parent Dashboard</div>
          </div>
          {student_ids.map((value) => {
            return (
              <Tab icon={<PersonIcon fontSize='medium'/>} label={student_names[student_ids.indexOf(value)]} 
                to={'/parentdash/' + parent_key + '/'+ value} component={Link} style={tabStyle}/>
            );
          })}
        </Tabs>
      </Paper>
      </div>
    );

  

  }
}

ParentDash.propTypes = {
  match: PropTypes.any,
};

export default ParentDash;
