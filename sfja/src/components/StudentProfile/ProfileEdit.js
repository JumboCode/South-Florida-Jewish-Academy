import React from 'react';
import {Button, TextField, Typography} from '@material-ui/core';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {withAuth0} from '../../utils/Auth0Wrapper';
import apiUrl from '../../utils/Env';
import SnackBarMessage from '../../utils/SnackBarMessage';

const textSize = {
  style: {fontSize: 15},
  autoComplete: 'new-password',
  form: {
    autoComplete: 'off',
  },
};

const textWidth = {
  padding: 10,
  marginBottom: 10,
};

// eslint-disable-next-line require-jsdoc
class ProfileEdit extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    // eslint-disable-next-line react/prop-types
    const {basicInfo} = this.props;
    const oldBasicInfo = JSON.parse(JSON.stringify(basicInfo));
    this.state = {
      oldBasicInfo: oldBasicInfo,
      basicInfo: basicInfo,
      openSuccessMessage: false,
      disableButton: true,
    };
  }

  // eslint-disable-next-line require-jsdoc
  sendUpdate() {
    // eslint-disable-next-line react/prop-types
    const {token} = this.props;
    const {basicInfo} = this.state;
    this.setState({
      disableButton: true,
    });
    const body = {
      basicInfo: basicInfo,
      id: basicInfo['_id'],
    };

    fetch(apiUrl() + '/studentProfileUpdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }).then((x) => {
      if (x.status === 200) {
        this.setState({
          oldBasicInfo: JSON.parse(JSON.stringify(basicInfo)),
          openSuccessMessage: true,
        });
      }
    });
  }

  // eslint-disable-next-line require-jsdoc
  updateValue(key, value) {
    const {basicInfo} = this.state;
    basicInfo[key] = value;
    this.setState({
      basicInfo: basicInfo,
      disableButton: !this.isDifference(),
    });
  }
  // eslint-disable-next-line require-jsdoc
  isDifference() {
    const {basicInfo, oldBasicInfo} = this.state;
    let difference = false;
    Object.keys(oldBasicInfo).forEach((key) => {
      if (oldBasicInfo[key] !== basicInfo[key]) {
        difference = true;
      }
    });
    return difference;
  }

  // eslint-disable-next-line require-jsdoc
  titleFormatter(str) {
    return str[0].toUpperCase() + str.replace('_', ' ').substring(1);
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {basicInfo, openSuccessMessage, disableButton} = this.state;
    // eslint-disable-next-line react/prop-types
    const {authorized} = this.props;
    const {parents}= this.props;
    return (
      <div style={{padding: 20}}>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div>
            {/* eslint-disable-next-line max-len */}
            <TextField onChange={(event) => this.updateValue('first_name', event.target.value)} disabled={basicInfo.archived || !authorized} value={basicInfo['first_name']} style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label={this.titleFormatter('first_name')} required={true}/>
          </div>
          <div>
            {/* eslint-disable-next-line max-len */}
            <TextField onChange={(event) => this.updateValue('middle_name', event.target.value)} disabled={basicInfo.archived || !authorized} value={basicInfo['middle_name']} style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label={this.titleFormatter('middle_name')} required={true}/>
          </div>
          <div>
            {/* eslint-disable-next-line max-len */}
            <TextField onChange={(event) => this.updateValue('last_name', event.target.value)} disabled={basicInfo.archived || !authorized} value={basicInfo['last_name']} style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label={this.titleFormatter('last_name')} required={true}/>
          </div>
          <div>
            {/* eslint-disable-next-line max-len */}
            <TextField onChange={(event) => this.updateValue('grade', event.target.value)} disabled={basicInfo.archived || !authorized} value={basicInfo['grade']} style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label={this.titleFormatter('grade')} required={true}/>
          </div>
          <div>
            {/* eslint-disable-next-line max-len */}
            <TextField onChange={(event) => this.updateValue('class', event.target.value)} disabled={basicInfo.archived || !authorized} value={basicInfo['class']} style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label={this.titleFormatter('class')} required={true}/>
          </div>
          <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <KeyboardDatePicker
              disabled={basicInfo.archived || !authorized}
              error={basicInfo.DOB === null}
              required={true}
              inputProps={textSize}
              style={{marginLeft: 10, width: 175}}
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Birthday"
              value={basicInfo.DOB}
              onChange={
                (event) => this.updateValue(
                    'DOB',
                    event ? event.toLocaleDateString() : null)
              }
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
        <div>
          {parents.map((parent,index) =>{
            return(
              <div>
                <Typography>Parent {index+1}</Typography>

                <TextField  disabled={basicInfo.archived || !authorized} value={parent['first_name']} style={textWidth} inputProps={textSize} variant='outlined' label={this.titleFormatter('first_name')} id="standard-basic" required={true}/>
            
                <TextField  disabled={basicInfo.archived || !authorized} value={parent['last_name']} style={textWidth} inputProps={textSize} variant='outlined' label={this.titleFormatter('last_name')} id="standard-basic" required={true}/>
              
                <TextField  disabled={basicInfo.archived || !authorized} value={parent['email']} style={textWidth} inputProps={textSize} variant='outlined' label= "Email" id="standard-basic" required={true}/>
              </div>
            )
          })}
        </div>
        {/* eslint-disable-next-line max-len */}
        <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
          <Button
            variant='contained'
            size='large'
            onClick={this.sendUpdate.bind(this)}
            disabled={disableButton || basicInfo.archived || !authorized}>
            Update
          </Button>
        </div>

        <SnackBarMessage
          open={openSuccessMessage}
          closeSnackbar={() => this.setState({openSuccessMessage: false})}
          severity='success'
          message='Successfully Updated.'
        />
      </div>
    );
  }
}

export default withAuth0(ProfileEdit);
