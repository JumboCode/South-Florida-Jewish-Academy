import React from 'react';
import {Button} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import PropTyes from 'prop-types';
import {ReactFormBuilder} from 'react-form-builder2';
import './css/bootstrap.min.css';
import './css/font-awesome.min.css';
import Demo from './Demo';
require('./scss/application.scss');

// eslint-disable-next-line require-jsdoc
class BlankFormBuilder extends React.Component {
  // eslint-disable-next-line require-jsdoc
  static propTypes = {
    setCreateForm: PropTyes.func,
  };

  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      openSuccessSnackBar: false,
      data: {},
    };
  }

  // eslint-disable-next-line require-jsdoc
  setOpenSuccessSnackBar(newSuccess) {
    this.setState({openSuccessSnackBar: newSuccess});
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    const {setCreateForm} = this.props;
    const {openSuccessSnackBar} = this.state;
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
          <Demo/>
          <ReactFormBuilder/>
        </React.Fragment>
        <div>
          {/* eslint-disable-next-line react/prop-types,max-len */}
          <Snackbar open={openSuccessSnackBar} autoHideDuration={6000} onClose={() => this.setOpenSuccessSnackBar(false)}>
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={() => this.setOpenSuccessSnackBar(false)}
              severity="success"
              style={{fontSize: 15}}>
              {/* eslint-disable-next-line max-len */}
              Saved.
            </MuiAlert>
          </Snackbar>
        </div>
      </div>
    );
  }
}


export default BlankFormBuilder;
