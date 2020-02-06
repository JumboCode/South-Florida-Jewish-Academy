import React from 'react';
import DemoBar from './DemoBar';
import FormBuilder from './FormBuilder/index';

import './css/bootstrap.min.css';
import './css/font-awesome.min.css';
require('./scss/application.scss');

class FormManager extends React.Component {
    render(){
        return (
            <React.Fragment>
                <DemoBar />
                <FormBuilder.ReactFormBuilder />
            </React.Fragment>
          );

    }
}
  
export default FormManager;
  