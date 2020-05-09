/* eslint-disable max-len */
import React from 'react';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from '../../utils/Env';
import {instanceOf} from 'prop-types';
import ConfirmationDialog from '../../utils/ConfirmationDialog';
import SnackBarMessage from '../../utils/SnackBarMessage';
import Paper from '@material-ui/core/Paper';
import {TextField} from '@material-ui/core';
import {Button} from '@material-ui/core';

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
class ChangeGrades extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      difference: '0',
      openSuccessMessage: false,
      openFailureMessage: false,
      openConfirmationDialog: false,
    };
  }

  // eslint-disable-next-line require-jsdoc
  changeGrade() {
    const {cookies} = this.props;
    const {difference} = this.state;
    const body = {
      difference: difference,
    };

    fetch(apiUrl() + '/changeGrades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
      body: JSON.stringify(body),
    }).then((x) => {
      if (x.status === 200) {
        this.setState({
          openSuccessMessage: true,
          difference: '0',
        });
      } else {
        this.setState({
          openFailureMessage: true,
        });
      }
    }).catch((error) => {
      this.setState({
        openFailureMessage: true,
      });
    });
  }

  // eslint-disable-next-line require-jsdoc
  isValid(s) {
    if (s === '' || s === '0' || s === '') {
      return false;
    }
    if (s[0] === '-') {
      return Number.isInteger(parseInt(s.substring(1)));
    } else {
      return Number.isInteger(parseInt(s));
    }
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    const {openSuccessMessage, openFailureMessage, openConfirmationDialog, difference} = this.state;
    return (
      <div>
        <Paper elevation={2} style={{width: 300, padding: 20}}>
          <div style={{paddingBottom: 10, fontSize: 20}}>
            Bulk Change Grades
          </div>
          <div style={{paddingBottom: 10, fontSize: 15}}>
            Change grades with a positive or negative integer. (eg: &apos;-1&apos; or &apos;1&apos;)
          </div>
          <br/>
          <TextField onChange={(event) => {
            this.setState({difference: event.target.value});
          }}
          value={difference} style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Change all student's grades by" fullWidth/>
          <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
            <Button onClick={() => {
              this.setState({openConfirmationDialog: true});
            }} variant='contained' disabled={!this.isValid(difference)}>Change</Button>
          </div>
        </Paper>
        <ConfirmationDialog
          showWarning={openConfirmationDialog}
          setShowWarning={(newVal) => this.setState({openConfirmationDialog: newVal})}
          onConfirm={this.changeGrade.bind(this)}
          message={'Are you sure you want to change grades of all students by ' + difference + '?'}
          confirmMessage='yes'
          notConfirmMessage='back'
        />
        <SnackBarMessage
          open={openSuccessMessage}
          closeSnackbar={() => this.setState({openSuccessMessage: false})}
          message={'Grades successfully changed.'}
          severity='success'
        />
        <SnackBarMessage
          open={openFailureMessage}
          closeSnackbar={() => this.setState({openFailureMessage: false})}
          message={'There was an error.'}
          severity='error'
        />
      </div>
    );
  }
}
export default withCookies(ChangeGrades);
