import React from 'react';
import {Button, TextField} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
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
    // eslint-disable-next-line react/prop-types
    const {parents} = this.props;
    const oldBasicInfo = JSON.parse(JSON.stringify(basicInfo));
    const oldParentsInfo = JSON.parse(JSON.stringify(parents));
    this.state = {
      oldBasicInfo: oldBasicInfo,
      basicInfo: basicInfo,
      openSuccessMessage: false,
      disableButton: true,
      oldParentsInfo: oldParentsInfo,
      parents: parents,
    };
  }

  // eslint-disable-next-line require-jsdoc
  sendUpdate() {
    // eslint-disable-next-line react/prop-types
    const {token} = this.props;
    const {basicInfo} = this.state;
    const {parents} = this.state;
    this.setState({
      disableButton: true,
    });
    const body = {
      basicInfo: basicInfo,
      id: basicInfo['_id'],
      parents: parents,
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
          oldParentsInfo: JSON.parse(JSON.stringify(parents)),
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
  updateValueParent(key, value, index) {
    const {parents} = this.state;
    parents[index][key] = value;
    this.setState({
      parents: parents,
      disableButton: !this.isDifferenceParent(),
    });
  }
  // eslint-disable-next-line require-jsdoc
  isDifferenceParent() {
    const {parents, oldParentsInfo} = this.state;
    let difference = false;
    {oldParentsInfo.map((currOld, index)=>{
      Object.keys(currOld).forEach((key) => {
        if (currOld[key] !== parents[index][key]) {
          difference = true;
        }
      });
    });}

    // Object.keys(oldParentsInfo).forEach((key) => {
    //   if (oldParentsInfo[key] !== parents[count][key]) {
    //     difference = true;
    //   }
    //   count++;
    // });
    return difference;
  }

  // eslint-disable-next-line require-jsdoc
  titleFormatter(str) {
    return str[0].toUpperCase() + str.replace('_', ' ').substring(1);
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    const {basicInfo, openSuccessMessage, disableButton, parents} = this.state;
    // eslint-disable-next-line react/prop-types
    const {authorized} = this.props;
    return (
      <div style={{padding: 20}}>
        <div style={{margin: 14}}>
          <Typography variant="h5">
            Student Information
          </Typography>
        </div>
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
        <div style={{margin: 14}}>
          <Typography variant="h5">
            Parent Information
          </Typography>
        </div>

        <div>
          {parents.map((parent, index) =>{
            return (
              <div>
                <Typography>Parent {index+1}</Typography>

                {/* eslint-disable-next-line max-len */}
                <TextField onChange={(event) => this.updateValueParent('first_name', event.target.value, index)} disabled={basicInfo.archived || !authorized} value={parent['first_name']} style={textWidth} inputProps={textSize} variant='outlined' label={this.titleFormatter('first_name')} id="standard-basic" required={true}/>

                {/* eslint-disable-next-line max-len */}
                <TextField onChange={(event) => this.updateValueParent('last_name', event.target.value, index)} disabled={basicInfo.archived || !authorized} value={parent['last_name']} style={textWidth} inputProps={textSize} variant='outlined' label={this.titleFormatter('last_name')} id="standard-basic" required={true}/>

                {/* eslint-disable-next-line max-len */}
                <TextField onChange={(event) => this.updateValueParent('email', event.target.value, index)} disabled={basicInfo.archived || !authorized} value={parent['email']} style={textWidth} inputProps={textSize} variant='outlined' label= "Email" id="standard-basic" required={true}/>
              </div>
            );
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
