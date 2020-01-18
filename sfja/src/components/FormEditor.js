import React from 'react';
import FormBuilder from 'react-form-builder2';
import DemoBar from './DemoBar';
// eslint-disable-next-line require-jsdoc
class FormEditor extends React.Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      // eslint-disable-next-line react/jsx-no-comment-textnodes
      <React.Fragment>
        {/* eslint-disable-next-line react/prop-types */}
        <DemoBar backFunc={this.props.backFunc}/>
        {/* Font Awesome icons don't appear. */}
        <FormBuilder.ReactFormBuilder/>
      </React.Fragment>
    );
  }
}


export default FormEditor;
