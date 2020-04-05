import React from 'react';
import PropTypes from 'prop-types';
import {Select, InputLabel, MenuItem} from '@material-ui/core';

// eslint-disable-next-line require-jsdoc
class StudentDash extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      studentId: this.props.match.params.studentId,
      formIds: [],
      formNames: [],
      currForm: null,
      currName: null,
    };
  }

    handleChange = (event) => {
      // eslint-disable-next-line no-invalid-this
      this.setState({currName: event.target.value});
    };

    // eslint-disable-next-line require-jsdoc
    componentDidMount() {
      fetch('http://127.0.0.1:5000/getStudentForms', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({student_id: this.state.studentId}),
      }).then((res) => res.json())
          .then((data) => {
            this.setState({formIds: data.form_ids,
              formNames: data.form_names});
            console.log(data);
          })
          .catch(console.log);
    }


    // eslint-disable-next-line require-jsdoc
    render() {
      const {studentId} = this.state;
      const {formIds} = this.state;
      const {formNames} = this.state;
      const {currName} = this.state;

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
