/* eslint-disable max-len */
import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import PropTypes from 'prop-types';

// eslint-disable-next-line require-jsdoc
export default function ConfirmationDialog2({showWarning, setShowWarning, onConfirm, message, confirmMessage, notConfirmMessage, setNewName}) {
  const [name, setname] = useState(
      'name',
  );

  return (
    <Dialog
      open={showWarning}
      onClose={() => {
        setShowWarning(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle style={{fontSize: 10}} id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
      <DialogContent>
        <DialogContentText style={{fontSize: 15, textAlign: 'left'}} id="alert-dialog-description">
          {message}
        </DialogContentText>

        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="New File Name"
          type="string"
          onChange={(event) => setname(event.target.value)}
          fullWidth
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setShowWarning(false);
        }}
        variant='contained'
        style={{fontSize: 12}}
        >
          {notConfirmMessage}
        </Button>
        <Button onClick={() => {
          setShowWarning(false);
          setNewName(name);
          onConfirm();
        }}
        autoFocus
        variant='contained'
        style={{fontSize: 12}}>
          {confirmMessage}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialog2.propTypes = {
  showWarning: PropTypes.bool,
  setShowWarning: PropTypes.func,
  onConfirm: PropTypes.func,
  message: PropTypes.string,
  confirmMessage: PropTypes.string,
  notConfirmMessage: PropTypes.string,
  setNewName: PropTypes.func,
};
