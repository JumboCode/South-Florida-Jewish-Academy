import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

// eslint-disable-next-line require-jsdoc
export default function Complete() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'}}>
      <div style={{paddingRight: 1}}>
        complete-
      </div>
      <CheckCircleIcon/>
    </div>
  );
};
