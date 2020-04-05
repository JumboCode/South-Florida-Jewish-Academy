import React from 'react';
import PropTypes from 'prop-types';
import FormDisplay from './FormDisplay';
import { Select, InputLabel, MenuItem} from '@material-ui/core';

// eslint-disable-next-line require-jsdoc
class StudentDash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            student_id: this.props.match.params.student_id,
            form_ids: [],
            form_names: [],
            curr_form: null,
            curr_name: null
        }
    }

    handleChange = event => {
      this.setState({curr_name: event.target.value});
    }; 


    componentDidMount() {
      fetch('http://127.0.0.1:5000/getStudentForms', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({student_id: this.state.student_id}),
        }).then((res) => res.json())
          .then((data) => {
            this.setState({form_ids: data.form_ids,
                          form_names: data.form_names});
            console.log(data);
          })
          .catch(console.log);
    }


    // eslint-disable-next-line require-jsdoc
    render() {
      const {student_id} = this.state;
      const {form_ids} = this.state;
      const {form_names} = this.state;
      const {curr_form} = this.state;
      const {curr_name} = this.state;

      return (
        <div>
        <h1>HELLO STUDENT {student_id}</h1>
        <InputLabel id="form-label">Forms</InputLabel>
        <Select 
          labelId="label" 
          id="select" 
          value={curr_name}
          onChange={this.handleChange}>
          {form_ids.map((value) => {
            return (
              <MenuItem 
                key={form_ids.indexOf(value)} 
                value={value}>
                {form_names[form_ids.indexOf(value)]}
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
