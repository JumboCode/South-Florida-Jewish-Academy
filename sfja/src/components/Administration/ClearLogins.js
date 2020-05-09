/* eslint-disable max-len */
import React from 'react';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from '../../utils/Env';
import PropTypes, {instanceOf} from 'prop-types';
import Paper from '@material-ui/core/Paper';
import {Button} from '@material-ui/core';
import ConfirmationDialog from '../../utils/ConfirmationDialog';
import SnackBarMessage from '../../utils/SnackBarMessage';

// eslint-disable-next-line require-jsdoc
class ClearLogins extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
    cacheSize: PropTypes.number,
  };

  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      openSuccessMessage: false,
      openFailureMessage: false,
      openConfirmationDialog: false,
    };
  }

  // eslint-disable-next-line require-jsdoc
  clearCache() {
    const {cookies} = this.props;
    this.setState({
      showConfirmation: false,
    });
    fetch(apiUrl() + '/clearLogins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
    }).then((response) => (response.json()))
        .then((data) => {
          this.setState({
            openSuccessMessage: true,
          });
        }).catch((error) => {
          this.setState({
            openFailureMessage: true,
          });
        });
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    const {openConfirmationDialog, openSuccessMessage, openFailureMessage} = this.state;
    const {cacheSize} = this.props;
    return (
      <div>
        <Paper elevation={2} style={{width: 300, padding: 20}}>
          <div style={{paddingBottom: 10, fontSize: 20}}>
            Clear Login Cache
          </div>
          <div style={{paddingBottom: 10, fontSize: 15}}>
            Click after updating permissions.
            Current size: {cacheSize}, automatically cleared at 100.
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}>
            <Button
              onClick={() => {
                this.setState({openConfirmationDialog: true});
              }} variant='contained' >Clear Cache</Button>
          </div>
        </Paper>
        <ConfirmationDialog
          showWarning={openConfirmationDialog}
          setShowWarning={(newVal) => this.setState({openConfirmationDialog: newVal})}
          onConfirm={this.clearCache.bind(this)}
          message={'Are you sure you want to clear login cache?'}
          confirmMessage='yes'
          notConfirmMessage='back'
        />
        <SnackBarMessage
          open={openSuccessMessage}
          closeSnackbar={() => this.setState({openSuccessMessage: false})}
          message={'Cache cleared.'}
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
export default withCookies(ClearLogins);
