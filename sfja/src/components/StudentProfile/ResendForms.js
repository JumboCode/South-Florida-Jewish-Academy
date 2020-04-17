/* eslint-disable max-len */
import React from 'react';
import Proptypes, {instanceOf} from 'prop-types';
import apiUrl from '../../utils/Env';
import {Cookies, withCookies} from 'react-cookie';
import {Button, Checkbox, List, ListItem, ListItemIcon, Paper} from '@material-ui/core';
import CommentIcon from '@material-ui/icons/Comment';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// eslint-disable-next-line require-jsdoc
class ResendForms extends React.Component {
  static propTypes = {
    studentId: Proptypes.string,
    cookies: instanceOf(Cookies).isRequired,
  };

  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      studentId: props.studentId,
      allBlankForms: [],
      studentBlankForms: [],
      forms: [],
      openDialog: false,
      dialogId: 0,
    };
  }


  // maybe do one call later? Depends. Don't know what we would rather yet.
  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    const {studentId} = this.state;
    const {cookies} = this.props;
    const body = {
      id: studentId,
    };

    fetch(apiUrl() + '/studentProfileBlankForms', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
    }).then((response) => response.json())
        .then((data) => {
          this.setState({
            studentBlankForms: data.forms.map((currForm) => ({
              id: currForm.blankFormId,
              name: currForm.blankFormName,
            })),
          });
        }).then(() => {
          fetch(apiUrl() + '/getAllForms', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${cookies.get('token')}`,
            },
          }).then((res) => res.json())
              .then((result) => {
                const {studentBlankForms} = this.state;
                const allBlankForms = result.forms.map((currForm) => (
                  {
                    id: currForm.id,
                    name: currForm.name,
                  }
                ));
                // eslint-disable-next-line max-len
                const studentBlankFormsIds = studentBlankForms.map((currForm) => currForm.id);
                const currBlankForms = allBlankForms.map((currForm) => (
                  {
                    id: currForm.id,
                    name: currForm.name,
                    checked: studentBlankFormsIds.includes(currForm.id),
                  }
                ));
                this.setState({
                  allBlankForms: allBlankForms,
                  forms: currBlankForms,
                });
              });
        });
  }

  // eslint-disable-next-line require-jsdoc
  handleClose() {
    this.setState({
      openDialog: false,
      dialogId: 0,
    });
  }

  // eslint-disable-next-line require-jsdoc
  formFlipper(formID) {
    const oldForms = this.state.forms;
    // eslint-disable-next-line max-len
    const newForms = oldForms.map((currForm) => (currForm.id === formID ? {id: currForm.id, name: currForm.name, checked: !currForm.checked} : currForm));
    this.setState({
      forms: newForms,
    });
  }

  // eslint-disable-next-line require-jsdoc
  selectAll(theBool) {
    const oldForms = this.state.forms;
    // eslint-disable-next-line max-len
    const newForms = oldForms.map((currForm) => ({id: currForm.id, name: currForm.name, checked: theBool}));
    this.setState({
      forms: newForms,
    });
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {forms, openDialog, dialogId} = this.state;
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 40}}>
          <Paper elevation={2} style={{padding: 10}}>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: 10}}>
              <Paper elevation={3} style={{display: 'flex', margin: 10}}>
                <div style={{width: 300}}>
                  <List>
                    {/* eslint-disable-next-line max-len */}
                    <ListItem key={'select_all'} role={undefined} dense button onClick={() => {
                      this.selectAll(!forms.every((currForm) => currForm.checked));
                    }}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={forms.every((currForm) => currForm.checked)}
                          tabIndex={-1}
                          disableRipple
                          // inputProps={{'aria-labelledby': labelId}}
                        />
                      </ListItemIcon>
                      Select All
                    </ListItem>
                    {forms.map((value) => {
                      const labelId = `checkbox-list-label-${value}`;
                      return (
                        // eslint-disable-next-line max-len
                        <ListItem key={value.id} role={undefined} dense button onClick={() => {
                          this.formFlipper(value.id);
                        }}>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={value.checked}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{'aria-labelledby': labelId}}
                            />
                          </ListItemIcon>
                          {value.name}
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="comments"
                              onClick={() => {
                                this.setState({openDialog: true, dialogId: value.id});
                              }}
                            >
                              <CommentIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
              </Paper>
              <br/>
              <Paper elevation={3} style={{display: 'flex', margin: 10}}>
                right?
              </Paper>
            </div>
            <div style={{display: 'flex', justifyContent: 'right', alignItems: 'right', flexDirection: 'row-reverse', margin: 20}}>
              <Button variant='contained' size='large' onClick={()=> {}}>Submit</Button>
            </div>
          </Paper>
        </div>
        <Dialog open={openDialog} onClose={this.handleClose.bind(this)} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address here. We will send updates
              occasionally. {dialogId}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withCookies(ResendForms);

