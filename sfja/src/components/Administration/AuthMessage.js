import React from 'react';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';

// eslint-disable-next-line require-jsdoc
export default function AuthMessage(props) {
  return (
    <div>
      <Paper elevation={2} style={{width: 500, padding: 20}}>
        <div style={{paddingBottom: 10, fontSize: 30}}>
          {props.message}
        </div>
      </Paper>
    </div>
  );
};

AuthMessage.propTypes = {
  message: PropTypes.string,
};
