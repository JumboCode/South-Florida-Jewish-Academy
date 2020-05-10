/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import {ReactFormGenerator} from 'react-form-builder2';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import apiUrl from '../../utils/Env';
import SnackBarMessage from '../../utils/SnackBarMessage';
import Complete from '../../utils/Complete';
import Incomplete from '../../utils/Incomplete';

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
      submitted: false,
      studentInfo: '',
      numIncomplete: 0,
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
            numIncomplete: data.form_data.filter((form) => !form.completed).length,
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
            submitted: data.submitted,
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
    })
        .then(this.refreshStudentForms())
        .then(this.refreshFormData(this.state.selected));
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {studentId, formData, formFilledData, blankFormData, openSentMessage,
      success, studentInfo, selectedName, numIncomplete,
      submitted} = this.state;

    if (studentId !== this.props.match.params.studentId) {
      this.setState({studentId: this.props.match.params.studentId});
      this.setState({blankFormData: null});
      this.refreshStudentForms();
    }
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
          <Paper elevation={2} style={{padding: 20, minWidth: 750}} >
            <div style={{paddingBottom: 10, fontSize: 20}}>
              {studentInfo.first_name} {studentInfo.last_name}
            </div>
            <div style={{paddingBottom: 10, fontSize: 15}}>
              DOB: {studentInfo.DOB}
              <br/>
              Grade: {studentInfo.grade}
            </div>
            <div style={{paddingBottom: 10, fontSize: 15}}>
              Number of forms to complete: {numIncomplete === 0 ? '0 - Nice work! You\'re all set.' : numIncomplete}
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
                    <TableCell align="right" style={{fontSize: 12}}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.map((form) => {
                    const opacity = this.isSelected(form.form_id) ? 0.7: 0.5;
                    return (
                      <TableRow
                        style={{cursor: 'pointer', backgroundColor: form.completed ? 'rgba(76, 209, 27,' + opacity + ')' : this.isSelected(form.form_id) ? 'rgba(219, 103, 103, 0.7)' : '#fff'}}
                        key={form.form_id}
                        onClick={(event) => this.handleOnClick(event, form.form_id, form.form_name)}
                      >
                        <TableCell component="th" scope="row" style={{fontSize: 12}}>
                          {form.form_name}
                        </TableCell>
                        <TableCell align="right" style={{fontSize: 12}}>{form.last_updated}</TableCell>
                        <TableCell align="right" style={{fontSize: 12}}>{form.completed ? <Complete/> : <Incomplete/>}</TableCell>
                      </TableRow>
                    );
                  })}
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
            <Paper elevation={2} style={{paddingTop: 20,
              paddingLeft: 40,
              paddingBottom: 40,
              paddingRight: 40,
              minWidth: 750,
              marginTop: 30}}>
              <div style={{paddingBottom: 10, fontSize: 20, paddingTop: 10}}>
                {selectedName}
              </div>
              <ReactFormGenerator
                onSubmit={this.handleSubmit.bind(this)}
                answer_data={formFilledData}
                data={blankFormData} // Question data
                hide_actions={submitted}
                read_only={submitted}
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
