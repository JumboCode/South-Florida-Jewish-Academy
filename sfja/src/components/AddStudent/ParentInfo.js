import React from 'react';
import {TextField} from '@material-ui/core';

const textSize = {style: {fontSize: 15}};
const textWidth = {
  padding: 10,
  paddingBottom: 20,
};

class ParentInfo extends React.Component {
  render() {
    const {addParentData, firstName, email, lastName, num} = this.props;
    return (
      <div>
        <div style={{paddingLeft: 10}}>
          Parent {num + 1}
        </div>
        <div>
          <TextField style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="First Name" required={true}
            onChange={(e) => {
              addParentData(num, e.target.value, email, lastName);
            }}
            value={firstName}
          />
          <TextField style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Last Name" required={true}
            onChange={(e) => {
              addParentData(num, firstName, email, e.target.value);
            }}
            value={lastName}
          />
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
