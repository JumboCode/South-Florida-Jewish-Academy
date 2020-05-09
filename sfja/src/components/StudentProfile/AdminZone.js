/* eslint-disable max-len,react/prop-types */
import React from 'react';
import PropTypes, {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from '../../utils/Env';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ConfirmationDialog from '../../utils/ConfirmationDialog';
import SnackBarMessage from '../../utils/SnackBarMessage';
import {Redirect} from 'react-router-dom';

// eslint-disable-next-line require-jsdoc
class AdminZone extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
    studentId: PropTypes.string,
  };
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      openSuccessMessage: false,
      openFailureMessage: false,
      openConfirmationDialog: false,
      redirect: false,
    };
  }

  // eslint-disable-next-line require-jsdoc
  deleteStudent() {
    const {cookies, studentId} = this.props;
    const body = {
      id: studentId,
    };
    fetch(apiUrl() + '/deleteStudent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
      // eslint-disable-next-line react/prop-types
      body: JSON.stringify(body),
    }).then((response) => response.json())
        .then((data) => {
          this.setState({
            openSuccessMessage: data.success,
          });
        })
        .catch((error) => {
          this.setState({
            openFailureMessage: true,
          });
        });
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    const {openConfirmationDialog, openFailureMessage, openSuccessMessage, redirect} = this.state;
    if (redirect) {
      return (
        <Redirect to={'/students'}/>
      );
    }
    return (
      <div style={{maxWidth: 1000, width: '100%'}}>
        <Paper elevation={2} style={{padding: 20}}>
          <div style={{fontSize: 25}}>
            Admin Zone
          </div>
          <br/>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Paper elevation={2} style={{padding: 20, width: 400}}>
              <div style={{fontSize: 20}}>
                Delete student.
              </div>
              <div style={{fontSize: 15}}>
                This operation cannot be undone.
              </div>
              <br/>
              <div style={{display: 'flex', alignContent: 'center', justifyContent: 'center'} }>
                <Button variant='contained' onClick={() => this.setState({openConfirmationDialog: true})}>Delete Student</Button>
              </div>
            </Paper>
          </div>
        </Paper>
        <ConfirmationDialog
          showWarning={openConfirmationDialog}
          setShowWarning={(newVal) => this.setState({openConfirmationDialog: newVal})}
          onConfirm={this.deleteStudent.bind(this)}
          message={'Are you sure you want to delete?'}
          confirmMessage='yes'
          notConfirmMessage='cancel'
        />
        <SnackBarMessage
          open={openSuccessMessage}
          closeSnackbar={() => {
            this.setState({openSuccessMessage: false, redirect: true});
          }}
          autoHideDuration={3000}
          message={'Student deleted. Redirecting back to students page.'}
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

export default withCookies(AdminZone);
