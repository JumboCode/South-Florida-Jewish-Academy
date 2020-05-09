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
import SnackBarMessage from '../../utils/SnackBarMessage';

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
      selectedName: '',
      blankFormData: null,
      formFilledData: null,
      openSentMessage: false,
      success: true,
      studentInfo: '',
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
      body: JSON.stringify({student_id: this.props.match.params.studentId}),
    }).then((res) => res.json())
        .then((data) => {
          this.setState({
            formData: data.form_data,
            studentInfo: data.student_info,
            selected: null,
          });
          console.log(data);
        }).catch(console.log);
  }

  // eslint-disable-next-line require-jsdoc
  refreshFormData(formId) {
    fetch(apiUrl() + '/getForm', {
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

  handleOnClick = (event, formId, formName) => {
    // eslint-disable-next-line no-invalid-this
    this.setState({selected: formId, selectedName: formName});
    // eslint-disable-next-line no-invalid-this
    this.refreshFormData(formId);
  };

  // eslint-disable-next-line require-jsdoc
  handleSubmit(answerData) {
    const {selected} = this.state;
    fetch(apiUrl() + '/submitForm', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      // eslint-disable-next-line react/prop-types
      body: JSON.stringify({form_id: selected,
        answer_data: answerData}),
    }).then((response) => {
      if (response.ok) {
        this.setState({
          openSentMessage: true,
          success: true,
        });
      } else {
        this.setState({
          openSentMessage: true,
          success: false,
        });
      }
    },
    );
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    // eslint-disable-next-line max-len
    const {studentId, formData, formFilledData, blankFormData, openSentMessage, success, studentInfo, selectedName} = this.state;

    if (studentId !== this.props.match.params.studentId) {
      this.setState({studentId: this.props.match.params.studentId});
      this.setState({blankFormData: null});
      this.refreshStudentForms();
    }
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
          <Paper elevation={2} style={{padding: 20, minWidth: 650}} >
            <div style={{paddingBottom: 10, fontSize: 20}}>
              {studentInfo.first_name} {studentInfo.last_name}
            </div>
            <div style={{paddingBottom: 10, fontSize: 15}}>
              DOB: {studentInfo.DOB}
              <br/>
              Grade: {studentInfo.grade}
            </div>
            <div style={{paddingBottom: 10, fontSize: 15}}>
              Please click on a form below, fill it out, and submit it.
            </div>
            <TableContainer component={Paper}>
              <Table aria-label="form table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{fontSize: 12}}>Form Name</TableCell>
                    <TableCell align="right" style={{fontSize: 12}}>Last Updated</TableCell>
                    <TableCell align="right" style={{fontSize: 12}}>Last Viewed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.map((form) => (
                    <TableRow
                      style={{cursor: 'pointer'}}
                      key={form.form_id}
                      onClick={(event) => this.handleOnClick(event, form.form_id, form.form_name)}
                      selected={this.isSelected(form.form_id)}
                    >
                      <TableCell component="th" scope="row" style={{fontSize: 12}}>
                        {form.form_name}
                      </TableCell>
                      <TableCell align="right" style={{fontSize: 12}}>{form.last_updated}</TableCell>
                      <TableCell align="right" style={{fontSize: 12}}>{form.last_viewed}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
        {blankFormData !== null ?
          <div style={{display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 10,
            paddingBottom: 40}}>
            <Paper elevation={2} style={{paddingTop: 10,
              paddingLeft: 40,
              paddingBottom: 40,
              minWidth: 650,
              marginTop: 30}}>
              <div style={{paddingBottom: 10, fontSize: 20, paddingTop: 10}}>
                {selectedName}
              </div>
              <ReactFormGenerator
                onSubmit={this.handleSubmit.bind(this)}
                answer_data={formFilledData}
                data={blankFormData} // Question data
                // form_id={selected}
              />
            </Paper>
          </div> :
          <h2 style={{fontSize: 25,
            fontFamily: 'Futura',
            color: '#0068af',
            textAlign: 'center',
            marginTop: 30}}>
            Please select a form.
          </h2>
        }
        <SnackBarMessage
          open={openSentMessage}
          closeSnackbar={() => this.setState({openSentMessage: false})}
          severity={success ? 'success' : 'error'}
          message={success ? 'Form submitted! Thank you.' : 'An error occurred.'}
        />
      </div>
    );
  }
}

StudentDash.propTypes = {
  match: PropTypes.any,
};

export default StudentDash;
