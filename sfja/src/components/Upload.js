import React from 'react';
import Header from './Header';
import FormManager from './FormManager/FormManager';
import FormCreator from './FormManager/FormCreator'

// eslint-disable-next-line require-jsdoc
class Upload extends React.Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div>
        <Header currTab='upload'/>
        <FormManager/>
      </div>
    );
  }
}

export default Upload;
