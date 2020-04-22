/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import {Button} from '@material-ui/core';

// eslint-disable-next-line require-jsdoc
export default function CommentDialog(props) {
  const {open, dialogCommentName, dialogCommentId, handleCommentClose, comment, updateComment, deleteAndClose} = props;
  return (
    <Dialog open={open} onClose={handleCommentClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Comment on {dialogCommentName}</DialogTitle>
      <DialogContent>
        Write your comment here for {dialogCommentName}:
        <TextField
          multiline
          autoFocus
          margin="dense"
          id="comment"
          label="comment"
          type="text"
          fullWidth
          value={comment}
          onChange={(e) => updateComment(dialogCommentId, e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => deleteAndClose(dialogCommentId)} variant="contained">
          Delete
        </Button>
        <Button onClick={handleCommentClose} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CommentDialog.propTypes = {
  open: PropTypes.bool,
  dialogCommentName: PropTypes.string,
  dialogCommentId: PropTypes.string,
  handleCommentClose: PropTypes.func,
  comment: PropTypes.string,
  updateComment: PropTypes.func,
  deleteAndClose: PropTypes.func,
};
