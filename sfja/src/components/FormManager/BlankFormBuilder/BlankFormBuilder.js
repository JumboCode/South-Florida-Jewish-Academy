import React from 'react';
import {Button} from '@material-ui/core';
import PropTypes from 'prop-types';
import {ReactFormBuilder} from 'react-form-builder2';
import './css/bootstrap.min.css';
import './css/font-awesome.min.css';
import DemoBar from './DemoBar';
require('./scss/application.scss');

// eslint-disable-next-line require-jsdoc
class BlankFormBuilder extends React.Component {
  // eslint-disable-next-line require-jsdoc
  static propTypes = {
    setCreateForm: PropTypes.func,
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
            style={{margin: 10}}
          >
            back
          </Button>
          {/* eslint-disable-next-line max-len */}
          <DemoBar/>
          <ReactFormBuilder/>
        </React.Fragment>
      </div>
    );
  }
}


export default BlankFormBuilder;
