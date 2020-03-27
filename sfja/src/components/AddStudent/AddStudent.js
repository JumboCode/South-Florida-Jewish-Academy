import React from 'react';
import Header from '../Header';
import Input from './Input';
import FormSelector from './FormSelector';
import {Button} from '@material-ui/core';


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
        <Header currTab='addStudent'/>
        {/* eslint-disable max-len */}
        <Input updateInputData={this.updateInputData.bind(this)} submitTime={submitTime}/>
        <FormSelector updateFormData={this.updateFormData.bind(this)} submitTime={submitTime}/>
        <Button onClick={()=> this.submit()}>Submit</Button>
      </div>
    );
  }
}

export default AddStudent;
