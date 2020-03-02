import React from 'react';
import Header from '../Header';
import Input from './Input';


// eslint-disable-next-line require-jsdoc
class AddStudent extends React.Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div>
        <Header currTab='addStudent'/>
        <Input/>

      </div>
    );
  }
}

export default AddStudent;
