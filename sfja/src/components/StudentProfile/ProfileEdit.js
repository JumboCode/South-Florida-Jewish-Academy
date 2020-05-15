import React from 'react';
import {Button, TextField} from '@material-ui/core';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import apiUrl from '../../utils/Env';
import SnackBarMessage from '../../utils/SnackBarMessage';
import auth0Client from "../../utils/Auth";

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
    const {cookies} = this.props;
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
        'Authorization': `Bearer ${auth0Client.getToken()}`,
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
    return (
      <div style={{padding: 20}}>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* eslint-disable-next-line max-len */}
          {Object.keys(basicInfo).filter((key) => (key !== '_id' && key !== 'DOB')).map((key) => (
            <div key={key}>
              {/* eslint-disable-next-line max-len */}
              <TextField onChange={(event) => this.updateValue(key, event.target.value)} disabled={basicInfo.archived} value={basicInfo[key]} style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label={this.titleFormatter(key)} required={true}/>
            </div>
          ))}
          <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <KeyboardDatePicker
              disabled={basicInfo.archived}
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
        {/* eslint-disable-next-line max-len */}
        <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
          <Button
            variant='contained'
            size='large'
            onClick={this.sendUpdate.bind(this)}
            disabled={disableButton || basicInfo.archived}>
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

export default ProfileEdit;
