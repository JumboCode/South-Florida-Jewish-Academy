import React from 'react';
import Input from './Input';
import FormSelector from './FormSelector';
import {Button, Paper} from '@material-ui/core';
import SuccessMessage from './SuccessMessage';
import {withCookies, Cookies} from 'react-cookie';
import {instanceOf} from 'prop-types';
// eslint-disable max-len

// eslint-disable-next-line require-jsdoc
class AddStudent extends React.PureComponent {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state =
        {
          inputData: null,
          formData: null,
          submitTime: Date.now(),
          successMessage: false,
          successParents: [],
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
    const {cookies} = this.props;
    const {inputData, formData} = this.state;
    const studentData = {
      firstName: inputData.firstNameStudent,
      middleName: inputData.middleNameStudent,
      lastName: inputData.lastNameStudent,
      grade: inputData.gradeStudent,
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

    return fetch('http://127.0.0.1:5000/addStudent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
      body: JSON.stringify(body),
      // eslint-disable-next-line arrow-parens
    }).then(response => {
      this.setState({
        submitTime: Date.now(),
        successMessage: true,
        successParents: inputData.parents.filter((parent) => (parent.email))
            .map((parent) => parent.email),
      });
    }).then(() => {
      this.setState({
        successMessage: false,
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
        inputData.dob === null
    ) {
      return true;
    }
    inputData.parents.forEach((parent) => {
      if (parent.firstName === '' || parent.lastName === '') {
        return true;
      }
    });
    if (inputData.parents[0].email === '') {
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
    const {submitTime, successMessage, successParents} = this.state;
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
        <SuccessMessage open={successMessage} successParents={successParents}/>
      </div>
    );
  }
}

export default withCookies(AddStudent);
