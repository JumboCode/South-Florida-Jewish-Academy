import React from 'react';
import { TextField } from '@material-ui/core';


const textSize = {style: {fontSize: 15}};
const textWidth = {
  padding: 10,
};

class Input extends React.Component{
  render() {
    return(
      <div>
        <div>
          Step 1.
        </div>
        <div>
          <TextField style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="First Name" required={true}/>
          <TextField style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Middle Name" required={true}/>
          <TextField style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Last Name" required={true}/>
        </div>
        <div>
          <TextField style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Grade" required={true}/>
          <TextField style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Age" required={true}/>
        </div>
      </div>
    );
  }
}

export default Input;