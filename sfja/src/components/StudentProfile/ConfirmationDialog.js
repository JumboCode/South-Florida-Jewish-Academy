import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {Button} from '@material-ui/core';
import PropTypes from 'prop-types';

// eslint-disable-next-line require-jsdoc
export default function ConfirmationDialog(props) {
  // eslint-disable-next-line max-len
  const {openConfirmationDialog, parents, resendForms, setOpenConfirmationDialog} = props;
  return (
    // eslint-disable-next-line max-len
    <Dialog open={openConfirmationDialog} onClose={() => setOpenConfirmationDialog(false)} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Email?</DialogTitle>
      <DialogContent>
        Are you sure you want to resend these forms?
      </DialogContent>
      <DialogContent>
        Emails will be sent to parents whose emails are on record:
        {parents.filter((parent) => (parent.email !== '')).map((parent) => (
          <div key={parent.email}>
            {parent.first_name} {parent.last_name} - {parent.email}
          </div>))}
      </DialogContent>
      <DialogActions>
        {/* eslint-disable-next-line max-len */}
        <Button onClick={() => setOpenConfirmationDialog(false)} variant="contained">
          Cancel
        </Button>
        <Button onClick={() => {
          setOpenConfirmationDialog(false);
          resendForms();
        }} variant="contained">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialog.propTypes = {
  openConfirmationDialog: PropTypes.func,
  parents: PropTypes.array,
  resendForms: PropTypes.func,
  setOpenConfirmationDialog: PropTypes.func,
};

