/* eslint-disable max-len,react/prop-types */
import React from 'react';
import PropTypes, {instanceOf} from 'prop-types';
import {CircularProgress} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import apiUrl from '../../utils/Env';
import auth0Client from '../../utils/Auth';

const textSize = {
  fontSize: '13px',
};

// eslint-disable-next-line require-jsdoc
class FormManager extends React.Component {
  static propTypes = {
    formsList: PropTypes.any,
  };
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      formsList: null,
      showWarning: false,
      formToTrash: null,
      selected: null,
    };
  }
  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    this.fetchData();
  }
  // eslint-disable-next-line require-jsdoc
  fetchData() {
    fetch(apiUrl() + '/getBlankFormDetails', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth0Client.getToken()}`,
      },
    })
        .then((res) => res.json())
        .then((data) => {
          this.setState({formsList: data.forms});
        });
  }

  // eslint-disable-next-line require-jsdoc
  trashForm() {
    const {formToTrash} = this.state;
    const body = {
      form_id: formToTrash,
    };
    fetch(apiUrl() + '/deleteBlankForm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth0Client.getToken()}`,
      },
      body: JSON.stringify(body),
      // eslint-disable-next-line arrow-parens
    })
        .then((res) => res.text())
        .then((res) => console.log(res))
        .then(() => {
          this.fetchData();
        });
  }

  // eslint-disable-next-line require-jsdoc
  setCreateForm(newCreateForm) {
    this.fetchData();
    this.setState({createForm: newCreateForm});
  }

  // eslint-disable-next-line require-jsdoc
  setViewForm(newViewForm) {
    this.fetchData();
    this.setState({viewForm: newViewForm});
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {formsList, showWarning, selected} = this.state;

    if (formsList === null) {
      return (
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
          <CircularProgress/>
        </div>
      );
    }

    const result = Object.values(formsList);
    const allInfoArr = [];
    for (let i = 0; i < result.length; i++) {
      const form = {
        id: result[i].form_id,
        name: result[i].form_name,
        date: result[i].date_created,
      };
      allInfoArr.push(form);
    }
    return (
      <div style={{padding: 20}}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{width: '100%', maxWidth: 700, marginTop: 10}}>
            <Button
              style={{display: 'flex'}}
              className="button icon-left"
              variant="contained"
              onClick={() => this.props.history.push(`/formManager/builder`)}>
                Add Form
            </Button>
            <div style={{paddingTop: 10}}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell style={textSize} align="right">Date Created</TableCell>
                      <TableCell style={textSize} align="right">Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allInfoArr.map((row) => (
                      <TableRow
                        key={row.id}
                        onClick={() => this.props.history.push('/formManager/viewer/' + row.id)}
                        style={{cursor: 'pointer', backgroundColor: selected === row.id ? 'rgba(211,211,211, 0.7)': '#ffffff'}}
                        onMouseEnter={() => this.setState({selected: row.id})}
                        onMouseLeave={() => this.setState({selected: null})}
                      >
                        <TableCell style={textSize} align="left">{row.name}</TableCell>
                        <TableCell style={textSize} align="right">{row.date}</TableCell>
                        <TableCell style={textSize} align="right">
                          <Button
                            variant='contained'
                            onClick={
                              (e) => {
                                e.stopPropagation();
                                this.setState({formToTrash: row.id, showWarning: true});
                              }
                            }><DeleteIcon fontSize='large'/></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
        <Dialog
          open={showWarning}
          onClose={() => {
            this.setState({showWarning: false});
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle style={{fontSize: 10}} id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
          <DialogContent>
            <DialogContentText style={{fontSize: 15, textAlign: 'left'}} id="alert-dialog-description">
              Are you sure you want to delete this form? Deleting forms in existence will cause serious bugs.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              this.setState({showWarning: false});
            }}
            color='#0068af'
            variant='contained'
            style={{fontSize: 12}}
            >
              Cancel
            </Button>
            <Button onClick={() => {
              this.setState({showWarning: false});
              this.trashForm();
            }} color='#0068af'
            autoFocus
            variant='contained'
            style={{fontSize: 12}}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default FormManager;
