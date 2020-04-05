import React from 'react';
import PropTypes from 'prop-types';
import '../Header.css';
import {Link} from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import PersonIcon from '@material-ui/icons/Person';

const tabStyle = {color: 'grey', fontSize: 10, outline: 'none',
  textDecoration: 'none', minWidth: 20};

// eslint-disable-next-line require-jsdoc
class ParentDash extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      studentIds: [],
      studentNames: [],
      hover: '',
      value: null,
      parentKey: this.props.match.params.parent_key,
    };
  }

  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    fetch('http://127.0.0.1:5000/getStudentsOfParent', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({curr_link: this.state.parentKey}),
    }).then((res) => res.json())
        .then((data) => {
          this.setState({studentIds: data.student_ids});
          this.setState({studentNames: data.student_names});
          console.log(data);
        })
        .catch(console.log);
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {studentIds} = this.state;
    const {studentNames} = this.state;
    const {parentKey} = this.state;
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

ParentDash.propTypes = {
  match: PropTypes.any,
};

export default ParentDash;
