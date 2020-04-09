import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },

});
// eslint-disable-next-line require-jsdoc
class StudentDash extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    console.log('constructor');
    super(props);
    this.state = {
      studentId: this.props.match.params.studentId,
      form_data: []
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
    fetch('http://127.0.0.1:5000/getStudentForms', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({student_id: this.state.studentId}),
    }).then((res) => res.json())
        .then((data) => {
          this.setState({form_data : data.form_data});
          console.log(data);
        }).catch(console.log);
  }


  // eslint-disable-next-line require-jsdoc
  render() {
    const {studentId, form_data} = this.state;

    if (studentId !== this.props.match.params.studentId) {
      this.refreshStudentForms();
    }

    return (
      <div>
        <h1>HELLO STUDENT {studentId}</h1>
        <TableContainer component={Paper}>
          <Table className={useStyles.table} aria-label="form table">
          <TableHead>
            <TableRow>
              <TableCell>Form Name(100g serving)</TableCell>
              <TableCell align="right">Last Updated</TableCell>
              <TableCell align="right">Last Viewed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {form_data.map((form) => (
            <TableRow key={form.form_id}>
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
      </div>
    );
  }
}

StudentDash.propTypes = {
  match: PropTypes.any,
};

export default StudentDash;
