/* eslint-disable */
import React from 'react';
import Paper from '@material-ui/core/Paper';

export default function ExpiredCard() {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
      <Paper elevation={2} style={{padding: 20, minWidth: 650}} >
        <div style={{paddingBottom: 10, fontSize: 20}}>
          You are authorized to view this page, but your link has expired!
          <br/>
          Please click on the new link sent to your email for access.
          <br/>
          <br/>
          Didn&apos;t get an email? Contact administration for information.
        </div>
      </Paper>
    </div>
  );
}
