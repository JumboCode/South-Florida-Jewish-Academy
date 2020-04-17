import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';

// eslint-disable-next-line require-jsdoc
class SuccessMessage extends React.Component {
  static propTypes = {
    successParents: PropTypes.array,
    open: PropTypes.bool,
  };
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      oldOpen: false,
    };
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    // eslint-disable-next-line no-invalid-this
    this.setState({
      open: false,
    });
  };

  // eslint-disable-next-line require-jsdoc
  formatEmails(list) {
    let emails = '';
    if (list.length === 1) {
      return list[0];
    } else if (list.length === 2) {
      return list[0] + ' and ' + list[1];
    } else {
      emails = list[0];
      for (let i = 1; i < list.length - 1; i++) {
        emails = emails + ', ' + list[i];
      }
      emails = emails + ', and ' + list[list.length - 1];
      return emails;
    }
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {oldOpen, open} = this.state;
    const {successParents} = this.props;
    if (successParents.length === 0) {
      return (<div/>);
    }
    if (this.props.open !== oldOpen) {
      this.setState({
        open: true,
        oldOpen: this.props.open,
      });
    }
    return (
      <div>
        {/* eslint-disable-next-line react/prop-types,max-len */}
        <Snackbar open={open} autoHideDuration={6000} onClose={this.handleClose}>
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={this.handleClose}
            severity="success"
            style={{fontSize: 15}}>
            {/* eslint-disable-next-line max-len */}
            Saved. New email sent to {this.formatEmails(successParents)} if not previously emailed.
          </MuiAlert>
        </Snackbar>
      </div>
    );
  }
}

export default SuccessMessage;
