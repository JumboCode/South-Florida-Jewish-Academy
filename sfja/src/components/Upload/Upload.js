/* eslint-disable max-len */
import React from 'react';
import FormManager from '../FormManager/FormManager';
import PreviewBlankForm from './PreviewBlankForm';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Button} from '@material-ui/core';

const textSize = {
  fontSize: '13px',
};

// eslint-disable-next-line require-jsdoc
class Upload extends React.Component {
  static propTypes = {
    formsList: PropTypes.any,
  };
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      createForm: false,
      currentForm: null,
      formsList: null,
      somethingDeleted: false,
      viewForm: false,
    };
  }
  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    this.fetchData();
  }
  // eslint-disable-next-line require-jsdoc
  fetchData() {
    fetch('http://localhost:5000/getBlankFormDetails')
        .then((res) => res.json())
        .then((data) => {
          this.setState({formsList: data.forms});
        });
  }

  // eslint-disable-next-line require-jsdoc
  trashForm(formid) {
    fetch('http://localhost:5000/deleteBlankForm/' + formid, {
      method: 'POST',
      mode: 'no-cors',
    })
        .then((res) => res.text())
        .then((res) => console.log(res));
    setTimeout( () => {
      this.setState(() => ({somethingDeleted: true}));
    }, 300);
    this.fetchData();
  }

  // eslint-disable-next-line require-jsdoc
  setCreateFrom(newCreateFrom) {
    this.setState({createForm: newCreateFrom});
  }

  // eslint-disable-next-line require-jsdoc
  setViewForm(newViewForm) {
    this.setState({viewForm: newViewForm});
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {createForm, viewForm, formsList} = this.state;

    if (formsList === null) {
      return (
        <div>
          loading...
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
        {createForm ? <FormManager setCreateForm={this.setCreateFrom.bind(this)} style={{width: '100%', maxWidth: 1000}}/>:
         viewForm ? <PreviewBlankForm parentData={this.state.currentForm} setViewForm={this.setViewForm.bind(this)}/>:
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{width: '100%', maxWidth: 700}}>
              <Button
                onClick= {() => this.setState({createForm: true})}
                variant="contained"
              >
                Add Form
              </Button>
              <div style={{paddingTop: 5}}>
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
                        <TableRow key={row.id}>
                          <TableCell style={textSize} component="th" scope="row"
                            onClick={() => this.setState({currentForm: row, viewForm: true})}>
                            {row.name}
                          </TableCell>
                          <TableCell style={textSize} align="right">{row.date}</TableCell>
                          <TableCell style={textSize} align="right"> <Button onClick={() =>
                            this.trashForm(row.id)}>Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Upload;
