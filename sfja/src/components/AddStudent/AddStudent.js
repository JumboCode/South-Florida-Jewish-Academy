import React from 'react';
import Header from '../Header';
import Input from './Input';
import FormSelector from './FormSelector';
import {Button} from '@material-ui/core';


// eslint-disable-next-line require-jsdoc
class AddStudent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state =
        {
          inputData: null,
          formData: null,
        };
  }

  updateInputData(newInputData) {
    this.setState({
      inputData: newInputData,
    });
    console.log(this.state);
  }

  updateFormData(newFormData) {
    this.setState({
      formData: newFormData,
    });
    console.log(this.state);
  }

  submit() {
    const {inputData, formData} = this.state;
    const studentData = {
      firstName: inputData.firstNameStudent,
      middleName: inputData.middleNameStudent,
      lastName: inputData.lastNameStudent,
      grade: inputData.gradeStudent,
      dob: inputData.dob,
    };

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
    }).then(response => response);
  };



  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div>
        <Header currTab='addStudent'/>
        <Input updateInputData={this.updateInputData.bind(this)}/>
        <FormSelector updateFormData={this.updateFormData.bind(this)}/>
        <Button onClick={()=> this.submit()}>Submit</Button>
      </div>
    );
  }
}

export default AddStudent;
