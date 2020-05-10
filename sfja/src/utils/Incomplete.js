import React from 'react';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

// eslint-disable-next-line require-jsdoc
export default function Incomplete() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'}}>
      <div style={{paddingRight: 1}}>
        incomplete-
      </div>
      <HighlightOffIcon/>
    </div>
  );
};
