import React from 'react';
import DemoBar from './DemoBar';
import FormBuilder from './FormBuilder';
import {Button} from '@material-ui/core';
import PropTyes from 'prop-types';

import './css/bootstrap.min.css';
import './css/font-awesome.min.css';
require('./scss/application.scss');

// eslint-disable-next-line require-jsdoc
class BlankFormBuilder extends React.Component {
  // eslint-disable-next-line require-jsdoc
  static propTypes = {
    setCreateForm: PropTyes.func,
  };
  // eslint-disable-next-line require-jsdoc
  render() {
    const {setCreateForm} = this.props;
    return (
      <div className="fm-container">
        <React.Fragment>
          <Button
            variant='contained'
            onClick={() => setCreateForm(false)}
          >
            back
          </Button>
          <DemoBar/>
          <FormBuilder.ReactFormBuilder/>
        </React.Fragment>
      </div>
    );
  }
}


export default BlankFormBuilder;
