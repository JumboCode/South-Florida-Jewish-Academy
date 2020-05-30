/* eslint-disable max-len */
import React from 'react';
import {withAuth0} from '../../utils/Auth0Wrapper';
import apiUrl from '../../utils/Env';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import {Button} from '@material-ui/core';
import ConfirmationDialog from '../../utils/ConfirmationDialog';
import SnackBarMessage from '../../utils/SnackBarMessage';

// eslint-disable-next-line require-jsdoc
class DeleteArchived extends React.Component {
  static propTypes = {
    numArchived: PropTypes.number,
  };

  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      openSuccessMessage: false,
      openFailureMessage: false,
      openConfirmationDialog: false,
      numDeleted: 0,
    };
  }

  // eslint-disable-next-line require-jsdoc
  deleteArchivedStudents() {
    // eslint-disable-next-line react/prop-types
    const {token} = this.props;
    this.setState({
      showConfirmation: false,
    });
    fetch(apiUrl() + '/deleteArchivedStudents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }).then((response) => (response.json()))
        .then((data) => {
          this.setState({
            openSuccessMessage: true,
            numDeleted: data.numDeleted,
          });
        }).catch((error) => {
          this.setState({
            openFailureMessage: true,
          });
        });
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    const {openConfirmationDialog, openSuccessMessage, openFailureMessage, numDeleted} = this.state;
    const {numArchived} = this.props;
    return (
      <div>
        <Paper elevation={2} style={{width: 300, padding: 20}}>
          <div style={{paddingBottom: 10, fontSize: 20}}>
            Delete Archived
          </div>
          <div style={{paddingBottom: 10, fontSize: 15}}>
            Delete {numDeleted === 0 ? numArchived : 0} archived students.
            <br/>
            {numArchived === 0 || numDeleted !== 0 ? 'No archived students to delete.' : 'This cannot be undone.'}
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}>
            <Button
              disabled={numArchived === 0 || numDeleted !== 0 }
              onClick={() => {
                this.setState({openConfirmationDialog: true});
              }} variant='contained' >Delete Archived Students</Button>
          </div>
        </Paper>
        <ConfirmationDialog
          showWarning={openConfirmationDialog}
          setShowWarning={(newVal) => this.setState({openConfirmationDialog: newVal})}
          onConfirm={this.deleteArchivedStudents.bind(this)}
          message={'Are you sure you want to delete all archived students?'}
          confirmMessage='yes'
          notConfirmMessage='back'
        />
        <SnackBarMessage
          open={openSuccessMessage}
          closeSnackbar={() => this.setState({openSuccessMessage: false})}
          message={numDeleted + ' students deleted.'}
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
export default withAuth0(DeleteArchived);
