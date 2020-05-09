import React from 'react';
import PropTypes from 'prop-types';
import {Paper} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';


// eslint-disable-next-line require-jsdoc
export default function MessageBox(props) {
  const {message, updateMessage, disabled} = props;
  return (
    // eslint-disable-next-line max-len
    <Paper elevation={3} style={{display: 'flex', margin: 10, flexDirection: 'column'}}>
      {/* eslint-disable-next-line max-len */}
      <div style={{display: 'flex', marginTop: 10, marginLeft: 10, marginRight: 10, flexDirection: 'column'}}>
        Optional Additional Message:
      </div>
      {/* eslint-disable-next-line max-len */}
      <div style={{display: 'flex', marginTop: 10, marginLeft: 10, marginRight: 10, flexDirection: 'column'}}>
        <TextField
          disabled={disabled}
          multiline
          autoFocus
          margin="dense"
          id="message"
          label="message"
          type="text"
          value={message}
          onChange={(e) => updateMessage(e.target.value)}
        />
      </div>
    </Paper>
  );
}

MessageBox.propTypes = {
  message: PropTypes.string,
  updateMessage: PropTypes.func,
};
