import React from 'react';
import {Button, TextField} from '@material-ui/core';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from '../../utils/Env';

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
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    // eslint-disable-next-line react/prop-types
    const {basicInfo} = this.props;
    const oldBasicInfo = JSON.parse(JSON.stringify(basicInfo));
    this.state = {
      oldBasicInfo: oldBasicInfo,
      basicInfo: basicInfo,
    };
  }

  // eslint-disable-next-line require-jsdoc
  sendUpdate() {
    const {cookies} = this.props;
    const {basicInfo} = this.state;
    const body = {
      basicInfo: basicInfo,
      id: basicInfo['_id'],
    };

    fetch(apiUrl() + '/studentProfileUpdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
      body: JSON.stringify(body),
    }).then((x) => {
      console.log(x);
    });
    //   .then((data) => {
    //     this.setState({
    //       formData: data.form_data,
    //       blankFormData: data.blank_form_data,
    //       basicInfo: data.basic_info,
    //       parentProfile: data.parent_profile,
    //       formInfo: data.form_info,
    //     });
    //   }).catch((error) => {
    //   console.log(error);
    // });
  }

  // eslint-disable-next-line require-jsdoc
  updateValue(key, value) {
    const {basicInfo} = this.state;
    basicInfo[key] = value;
    this.setState({
      basicInfo: basicInfo,
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
    const {basicInfo} = this.state;
    return (
      <div style={{padding: 20}}>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* eslint-disable-next-line max-len */}
          {Object.keys(basicInfo).filter((key) => (key !== '_id' && key !== 'DOB')).map((key) => (
            <div key={key}>
              {/* eslint-disable-next-line max-len */}
              <TextField onChange={(event) => this.updateValue(key, event.target.value)} value={basicInfo[key]} style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label={this.titleFormatter(key)} required={true}/>
            </div>
          ))}
          <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <KeyboardDatePicker
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
        <Button variant='outlined' onClick={this.sendUpdate.bind(this)} disabled={!this.isDifference()} >Update</Button>
      </div>
    );
  }
}

export default withCookies(ProfileEdit);
