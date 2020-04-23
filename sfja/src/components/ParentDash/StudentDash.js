import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line max-len
import {ReactFormGenerator} from 'react-form-builder2';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import apiUrl from '../../utils/Env';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },

});
// eslint-disable-next-line require-jsdoc
class StudentDash extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      studentId: this.props.match.params.studentId,
      formData: [],
      selected: null,
      blankFormData: null,
      formFilledData: null,
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
          this.setState({formData: data.form_data});
          console.log(data);
        }).catch(console.log);
  }

  // eslint-disable-next-line require-jsdoc
  refreshFormData(formId) {
    fetch('http://127.0.0.1:5000/getForm', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      // eslint-disable-next-line react/prop-types
      body: JSON.stringify({form_id: formId}),
    }).then((res) => res.json())
        .then((data) => {
          this.setState({
            blankFormData: data.blank_form_data,
            formFilledData: data.form_data,
          });
          console.log(data);
        }).catch(console.log);
  }

  // eslint-disable-next-line no-invalid-this
  isSelected = (formId) => this.state.selected === formId

  handleOnClick = (event, formId) => {
    // eslint-disable-next-line no-invalid-this
    this.setState({selected: formId});
    // eslint-disable-next-line no-invalid-this
    this.refreshFormData(formId);
  }

  // eslint-disable-next-line require-jsdoc
  handleSubmit(answerData) {
    const {selected} = this.state;
    fetch('http://127.0.0.1:5000/submitForm', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      // eslint-disable-next-line react/prop-types
      body: JSON.stringify({form_id: selected,
        answer_data: answerData}),
    }).then((response) => response);
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    // eslint-disable-next-line max-len
    const {studentId, formData, formFilledData, blankFormData} = this.state;

    if (studentId !== this.props.match.params.studentId) {
      this.refreshStudentForms();
    }
    console.log(blankFormData);
    return (
      <div>
        <TableContainer component={Paper}>
          <Table className={useStyles.table} aria-label="form table">
            <TableHead>
              <TableRow>
                <TableCell>Form Name</TableCell>
                <TableCell align="right">Last Updated</TableCell>
                <TableCell align="right">Last Viewed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.map((form) => (
                <TableRow
                  key={form.form_id}
                  onClick={(event) => this.handleOnClick(event, form.form_id)}
                  selected={this.isSelected(form.form_id)}
                >
                  <TableCell component="th" scope="row">
                    {form.form_name}
                  </TableCell>
                  <TableCell align="right">{form.last_updated}</TableCell>
                  <TableCell align="right">{form.last_viewed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {blankFormData !== null ?
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 10}}>
            <Paper elevation={2} style={{padding: 40, minWidth: 650, marginTop: 30}}>
              <ReactFormGenerator
                onSubmit={this.handleSubmit.bind(this)}
                answer_data={formFilledData}
                data={blankFormData} // Question data
                // form_id={selected}
              />
            </Paper>
          </div> :
          <h1>Please select a form.</h1>
        }
      </div>
    );
  }
}

StudentDash.propTypes = {
  match: PropTypes.any,
};

export default StudentDash;
