import React from 'react';
import {TextField} from '@material-ui/core';

const textSize = {style: {fontSize: 15}};
const textWidth = {
  padding: 10,
  paddingBottom: 20,
};

// eslint-disable-next-line require-jsdoc
class ParentInfo extends React.Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    // eslint-disable-next-line react/prop-types
    const {addParentData, firstName, email, lastName, num} = this.props;
    return (
      <div>
        <div style={{paddingLeft: 10}}>
          Parent {num + 1}
        </div>
        <div>
          {/* eslint-disable-next-line max-len */}
          <TextField style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="First Name" required={true}
            onChange={(e) => {
              addParentData(num, e.target.value, email, lastName);
            }}
            value={firstName}
          />
          {/* eslint-disable-next-line max-len */}
          <TextField style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Last Name" required={true}
            onChange={(e) => {
              addParentData(num, firstName, email, e.target.value);
            }}
            value={lastName}
          />
          {/* eslint-disable-next-line max-len */}
          <TextField style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Email" required={true}
            onChange={(e) => {
              addParentData(num, firstName, e.target.value, lastName);
            }}
            value={email}
          />
        </div>
      </div>
    );
  }
}

export default ParentInfo;
