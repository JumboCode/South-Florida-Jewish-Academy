import React from 'react';
import Input from './Input';
import FormSelector from './FormSelector';
import {Button, Paper} from '@material-ui/core';
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
    const {inputData, formData} = this.state;
    const studentData = {
      firstName: inputData.firstNameStudent,
      middleName: inputData.middleNameStudent,
      lastName: inputData.lastNameStudent,
      grade: inputData.gradeStudent,
      dob: inputData.dob,
    };

    // eslint-disable-next-line max-len
    const parentData = inputData.parents.filter((currParent) => (currParent.firstName));
    const forms = formData.forms.filter((currForm) => (currForm.checked));
    const body = {
      studentData: studentData,
      parentData: parentData,
      forms: forms,
    };

    return fetch('http://127.0.0.1:5000/addStudent', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
      // eslint-disable-next-line arrow-parens
    }).then(response => {
      this.setState({submitTime: Date.now()});
    });
  };


  // eslint-disable-next-line require-jsdoc
  render() {
    const {submitTime} = this.state;
    return (
      <div>
        {/* eslint-disable max-len */}
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
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
              <Button variant='contained' size='large' onClick={()=> this.submit()}>Submit</Button>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default AddStudent;
