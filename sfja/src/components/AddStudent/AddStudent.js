import React from 'react';
import Input from './Input';
import FormSelector from './FormSelector';
import {Button, Paper} from '@material-ui/core';
import ResultMessage from './ResultMessage';
import {withAuth0} from '../../utils/Auth0Wrapper';
import apiUrl from '../../utils/Env';
// eslint-disable max-len

// eslint-disable-next-line require-jsdoc
class AddStudent extends React.PureComponent {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state =
        {
          inputData: null,
          formData: null,
          submitTime: Date.now(),
          showResultMessage: false,
          failedParents: [],
        };
  }

  // eslint-disable-next-line require-jsdoc
  updateInputData(newInputData) {
    this.setState({
      inputData: newInputData,
    });
  }

  // eslint-disable-next-line require-jsdoc
  updateFormData(newFormData) {
    this.setState({
      formData: newFormData,
    });
  }

  // eslint-disable-next-line require-jsdoc
  submit() {
    // eslint-disable-next-line react/prop-types
    const {token} = this.props;
    const {inputData, formData} = this.state;
    const studentData = {
      firstName: inputData.firstNameStudent,
      middleName: inputData.middleNameStudent,
      lastName: inputData.lastNameStudent,
      grade: inputData.gradeStudent,
      class: inputData.classStudent,
      dob: inputData.dob,
    };

    // eslint-disable-next-line max-len
    const parentData = inputData.parents.filter((currParent) => (currParent.firstName)); // null check
    const forms = formData.forms.filter((currForm) => (currForm.checked));
    const body = {
      studentData: studentData,
      parentData: parentData,
      forms: forms,
    };

    return fetch(apiUrl() + '/addStudent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      // eslint-disable-next-line arrow-parens
    }).then((response) => (response.json()))
        .then((data) => {
          this.setState({
            submitTime: Date.now(),
            showResultMessage: true,
            failedParents: data.failed,
          });
        }).then(() => {
          this.setState({
            showResultMessage: false,
          });
        });
  };

  // eslint-disable-next-line require-jsdoc
  submitButtonDisabled() {
    const {inputData, formData} = this.state;
    if (inputData === null) {
      return true;
    }
    if (inputData.firstNameStudent === '' ||
      inputData.lastNameStudent === '' ||
      inputData.gradeStudent === '' ||
      !inputData.gradeStudent.match(/^[0-9]+$/) ||
      inputData.dob === null ||
      inputData.classStudent === ''
    ) {
      return true;
    }
    inputData.parents.forEach((parent) => {
      if (parent.firstName === '' || parent.lastName === '') {
        return true;
      }
    });
    // eslint-disable-next-line max-len
    if (inputData.parents[0].email === '' || !inputData.parents[0].email.match(/.+@.+/)) {
      return true;
    }

    if (formData.forms.every((form) => !form.checked)) {
      return true;
    }

    return false;
  }

  // eslint-disable-next-line require-jsdoc
  submitButton(disabled) {
    return (
      <Button
        disabled={disabled}
        variant='contained'
        size='large'
        onClick={()=> this.submit()}>
        Submit
      </Button>
    );
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    const {submitTime, showResultMessage, failedParents} = this.state;
    return (
      <div>
        {/* eslint-disable max-len */}
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 40}}>
          <Paper elevation={2} style={{padding: 10}}>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: 10}}>
              <Paper elevation={3} style={{display: 'flex', margin: 10}}>
                <Input updateInputData={this.updateInputData.bind(this)} submitTime={submitTime} style={{textAlign: 'left'}}/>
              </Paper>
              <br/>
              <Paper elevation={3} style={{display: 'flex', margin: 10}}>
                <FormSelector updateFormData={this.updateFormData.bind(this)} submitTime={submitTime}/>
              </Paper>
            </div>
            <div style={{display: 'flex', justifyContent: 'right', alignItems: 'right', flexDirection: 'row-reverse', margin: 20}}>
              {this.submitButton(this.submitButtonDisabled())}
            </div>
          </Paper>
        </div>
        <ResultMessage open={showResultMessage} failedParents={failedParents}/>
      </div>
    );
  }
}

export default withAuth0(AddStudent);
