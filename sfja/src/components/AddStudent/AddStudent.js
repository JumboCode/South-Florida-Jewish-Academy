import React from 'react';
import Header from '../Header';
import Input from './Input';
import FormSelector from "./FormSelector";


// eslint-disable-next-line require-jsdoc
class AddStudent extends React.Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div>
        <Header currTab='addStudent'/>
        <Input/>
        <FormSelector/>
      </div>
    );
  }
}

export default AddStudent;
