/* eslint-disable react/prop-types */
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
      // eslint-disable-next-line max-len
      <div style={{display: 'flex', justifyContent: 'center', marginLeft: '10%'}}>
        <div style={{width: '100%', maxWidth: 1000}}>
          <div className="fm-container" >
            <React.Fragment>
              <Button
                variant='contained'
                onClick={() => this.props.history.goBack()}
                style={{marginTop: 30}}
              >
                back
              </Button>
              {/* eslint-disable-next-line max-len */}
              <DemoBar setCreateForm={setCreateForm} {...this.props}/>
              <ReactFormBuilder/>
            </React.Fragment>
          </div>
        </div>
      </div>
    );
  }
}


export default BlankFormBuilder;
