import React from 'react';
import PropTypes from 'prop-types';
import {Select, InputLabel, MenuItem} from '@material-ui/core';
import apiUrl from '../../utils/Env';

// eslint-disable-next-line require-jsdoc
class StudentDash extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    console.log('constructor');
    super(props);
    this.state = {
      studentId: this.props.match.params.studentId,
      formIds: [],
      formNames: [],
      currForm: null,
      currName: '',
    };
  }

    handleChange = (event) => {
      // eslint-disable-next-line no-invalid-this
      this.setState({currName: event.target.value});
    };

    // eslint-disable-next-line require-jsdoc
    componentDidMount() {
      this.refreshStudentForms();
    }

    // eslint-disable-next-line require-jsdoc
    refreshStudentForms() {
      fetch(apiUrl() + '/getStudentForms', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({student_id: this.state.studentId}),
      }).then((res) => res.json())
          .then((data) => {
            this.setState({
              formIds: data.form_ids,
              formNames: data.form_names,
              studentId: this.props.match.params.studentId,
            });
            console.log(data);
          }).catch(console.log);
    }


    // eslint-disable-next-line require-jsdoc
    render() {
      const {studentId, formIds, formNames, currName} = this.state;

      if (studentId !== this.props.match.params.studentId) {
        this.refreshStudentForms();
      }

      return (
        <div>
          <h1>HELLO STUDENT {studentId}</h1>
          <InputLabel id="form-label">Forms</InputLabel>
          <Select
            labelId="label"
            id="select"
            value={currName}
            onChange={this.handleChange}>
            {formIds.map((value) => {
              return (
                <MenuItem
                  key={formIds.indexOf(value)}
                  value={value}>
                  {formNames[formIds.indexOf(value)]}
                </MenuItem>
              );
            })}
          </Select>
        </div>
      );
    }
}

StudentDash.propTypes = {
  match: PropTypes.any,
};

export default StudentDash;
