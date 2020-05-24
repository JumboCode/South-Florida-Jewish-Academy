/* eslint-disable max-len,require-jsdoc,react/prop-types */
import React from 'react';
import {
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  Switch,
} from '@material-ui/core';
import {withCookies} from 'react-cookie';
import ScaleText from 'react-scale-text';
import MessageBox from '../StudentProfile/MessageBox';
import ConfirmationDialog from '../../utils/ConfirmationDialog';
import apiUrl from '../../utils/Env';
import SnackBarMessage from '../../utils/SnackBarMessage';

class ResendForms extends React.Component {
  constructor(props) {
    console.log('constructor, props', props);
    super(props);
    this.state = {
      openDialog: false,
      selected: null,
      blankForms: this.cleanBlankForms(props.blankForms),
      message: 'Please note the new changes made on your student\'s forms.\n\nThank you for your attention.',
      showWarning: false,
      success: false,
      openSnackBar: false,
    };
  }

  resetBlankForms() {
    const {blankForms} = this.props;
    this.setState({
      blankForms: this.cleanBlankForms(blankForms),
    });
  }

  setMessage(newVal) {
    this.setState({message: newVal});
  }
  setSelected(newVal) {
    this.setState({selected: newVal});
  }
  setOpenDialog(newVal) {
    this.setState({openDialog: newVal});
  }

  cleanBlankForms(blankForms) {
    return blankForms.map((form) => ({id: form.id, name: form.name, checked: false}));
  };

  updateFormChecked(formId, newVal) {
    const {blankForms} = this.state;
    this.setState({
      blankForms: blankForms.map((form) => (formId === form.id ? {id: form.id, name: form.name, checked: newVal} : form)),
    });
  };

  selectAll() {
    const {blankForms} = this.state;
    const newVal = !blankForms.every((form) => form.checked);
    this.setState({
      blankForms: blankForms.map((form) => ({id: form.id, name: form.name, checked: newVal})),
    });
  }

  sendEmails() {
    const {cookies, studentsChecked, updateData, resetCheckedStudents} = this.props;
    const {blankForms, message} = this.state;
    const body = {
      students: Array.from(studentsChecked),
      blankForms: blankForms.filter((form) => form.checked),
      message: message,
    };

    fetch(apiUrl() + '/bulkResendEmails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
      body: JSON.stringify(body),
    }).then((x) => {
      if (x.status === 200) {
        this.setState({
          success: true,
          openDialog: false,
        });
      }
    }).then((() => resetCheckedStudents())).then(() => updateData()).catch((error) => {
      this.setState({
        success: false,
      });
    }).finally(() => {
      this.setState({
        openSnackBar: true,
      });
    });
  }

  render() {
    const {openDialog, selected, blankForms, message, showWarning, openSnackBar, success} = this.state;
    const {setShowSelectors, showSelectors, studentsChecked} = this.props;
    return (
      <Paper
        style={{marginTop: 20, height: 120}}
      >
        <div>
          Resend Forms
        </div>
        <div>
          <Switch
            checked={showSelectors}
            onChange={(event) => setShowSelectors(event.target.checked)}
            name='resend form mode'
          />
        </div>
        <Button
          onClick={() => {
            this.setOpenDialog(true);
            this.resetBlankForms();
          }}
          variant='contained'
          disabled={!showSelectors}
        >
          Resend Forms
        </Button>
        { showSelectors && <div style={{paddingTop: 10}}>
          Selected {studentsChecked.size} student{studentsChecked.size === 1 ? '' : 's'}.
        </div>}
        <Dialog
          open={openDialog}
          onClose={() => this.setOpenDialog(false)}
          fullWidth={true}
          maxWidth='md'
        >
          <DialogTitle>
            Resend Forms
          </DialogTitle>
          <DialogContent>
            Select forms below to choose to send to selected students. If the student already has the form assigned, an email will still be sent to remind their parents. All students without the form previously will now be assigned the form.
          </DialogContent>
          <DialogContent>
            <Paper
              elevation={3}
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: 20,
                margin: 20,
                flexGrow: 1,
              }}
            >
              <Paper
                style={{margin: 20, padding: 20}}
                elevation={3}
              >
                Select Forms:
                <List>
                  <ListItem
                    onClick={this.selectAll.bind(this)}
                    onMouseEnter={() => this.setSelected('all')}
                    onMouseLeave={() => this.setSelected(null)}
                    style={{
                      paddingTop: 1,
                      paddingBottom: 1,
                      cursor: 'pointer',
                      backgroundColor: selected === 'all' ?
                        'rgba(211,211,211, 0.7)' :
                        '#ffffff'}}
                  >
                    <ListItemIcon
                      style={{width: 150}}
                    >
                      <Checkbox
                        edge='start'
                        checked={blankForms.every((form) => form.checked)}
                      />
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <ScaleText
                          widthOnly={true}
                          maxFontSize={14}
                        >
                          Select All
                        </ScaleText>
                      </div>

                    </ListItemIcon>
                  </ListItem>
                  {/* eslint-disable-next-line react/prop-types */}
                  {blankForms.map((form) => (<ListItem
                    key={form.id}
                    onClick={() => this.updateFormChecked(form.id, !form.checked)}
                    onMouseEnter={() => this.setSelected(form.id)}
                    onMouseLeave={() => this.setSelected(null)}
                    style={{
                      paddingTop: 1,
                      paddingBottom: 1,
                      cursor: 'pointer',
                      backgroundColor: selected === form.id ?
                        'rgba(211,211,211, 0.7)' :
                        '#ffffff'}}
                  >
                    <ListItemIcon
                      style={{width: 150}}
                    >
                      <Checkbox
                        edge='start'
                        checked={form.checked}
                      />
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <ScaleText
                          widthOnly={true}
                          maxFontSize={14}
                        >
                          {form.name}
                        </ScaleText>
                      </div>

                    </ListItemIcon>
                  </ListItem>))}
                </List>
              </Paper>
              <div
                style={{margin: 20, padding: 20, minWidth: 300}}
              >
                <MessageBox disabled={false} message={message} updateMessage={this.setMessage.bind(this)}/>
                <div style={{display: 'flex', flexDirection: 'row-reverse', marginTop: 20, alignItems: 'center'}}>
                  <Button
                    variant='contained'
                    onClick={() => this.setState({showWarning: true})}
                    disabled={!blankForms.some((form) => form.checked)}
                  >
                    Send Emails
                  </Button>
                  <div
                    style={{
                      marginRight: 10,
                    }}
                  >
                    Selected {studentsChecked.size} student{studentsChecked.size === 1 ? '' : 's'}.
                  </div>
                </div>
              </div>
            </Paper>
          </DialogContent>
        </Dialog>
        <ConfirmationDialog
          showWarning={showWarning}
          setShowWarning={(newVal) => this.setState({showWarning: newVal})}
          onConfirm={this.sendEmails.bind(this)}
          message={'Are you sure you want to send emails to parents of ' + studentsChecked.size.toString() + ' student' + (studentsChecked.size === 1 ? '?' : 's?')}
          confirmMessage='yes'
          notConfirmMessage='back'
        />
        <SnackBarMessage
          open={openSnackBar}
          closeSnackbar={() => {
            this.setState({openSnackBar: false});
          }}
          severity={success ? 'success' : 'error'}
          message={success ? 'Parents of ' + studentsChecked.size.toString() + ' student' + (studentsChecked.size === 1 ? '' : 's') + ' emailed' : 'An error occurred.'}
        />
      </Paper>
    );
  }
};

export default withCookies(ResendForms);
