import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

// eslint-disable-next-line require-jsdoc
export default function SuccessMessage(props) {
  const {open, closeSuccessMessage} = props;
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={closeSuccessMessage}>
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={closeSuccessMessage}
        severity="success"
        style={{fontSize: 15}}>
        Emails sent.
      </MuiAlert>
    </Snackbar>
  );
}

SuccessMessage.propTypes = {
  open: PropTypes.bool,
  closeSuccessMessage: PropTypes.func,
};
