import React from 'react';
import PropTypes from 'prop-types';
import '../Header.css';
import {Link} from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import PersonIcon from '@material-ui/icons/Person';
import HomeIcon from '@material-ui/icons/Home';
import apiUrl from '../../utils/Env';

const tabStyle = {color: 'grey', fontSize: 10, outline: 'none',
  textDecoration: 'none', minWidth: 20};

// eslint-disable-next-line require-jsdoc
class ParentHeader extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      studentIds: [],
      studentNames: [],
      hover: '',
      value: null,
      parentKey: this.props.match.params.parentKey,
    };

    console.log(this.props.match);
  }

  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    fetch(apiUrl() + '/getStudentsOfParent', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({curr_link: this.state.parentKey}),
    }).then((res) => res.json())
        .then((data) => {
          this.setState({
            studentIds: data.student_ids,
            studentNames: data.student_names,
          });
          console.log(data);
        })
        .catch(console.log);
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {studentIds, studentNames, parentKey, value} = this.state;
    if (value !== studentIds.indexOf(this.props.match.params.studentId) + 2) {
      this.setState({
        value: studentIds.indexOf(this.props.match.params.studentId) + 2,
      });
    }
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
            <Tab
              key={value}
              icon={<HomeIcon fontSize='medium'/>}
              label={'dashboard'}
              to={'/parentdash/' + parentKey}
              component={Link}
              style={tabStyle}/>
            {studentIds.map((value) => {
              return (
                <Tab
                  key={value}
                  icon={<PersonIcon fontSize='medium'/>}
                  label={studentNames[studentIds.indexOf(value)]}
                  to={'/parentdash/' + parentKey + '/'+ value}
                  component={Link}
                  style={tabStyle}/>
              );
            })}
          </Tabs>
        </Paper>
      </div>
    );
  }
}

ParentHeader.propTypes = {
  match: PropTypes.any,
};

export default ParentHeader;
