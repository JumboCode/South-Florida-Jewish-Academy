/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

// open - open the snackbar?
// closeSnackbar - callback function to close the snackbar in parent state
// severity - 'error', 'info', 'success', 'warning'
// message - message to display
// eslint-disable-next-line require-jsdoc
export default function SnackBarMessage(props) {
  const {open, closeSnackbar, severity, message, autoHideDuration} = props;
  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={closeSnackbar}>
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={closeSnackbar}
        severity={severity}
        style={{fontSize: 15}}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
}

SnackBarMessage.propTypes = {
  open: PropTypes.bool,
  closeSnackbar: PropTypes.func,
  severity: PropTypes.string,
  message: PropTypes.string,
  autoHideDuration: PropTypes.number,
};

SnackBarMessage.defaultProps = {
  autoHideDuration: 6000,
};
