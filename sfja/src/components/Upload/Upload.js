import React from 'react';
import FormManager from '../FormManager/FormManager';
import PreviewBlankForm from './PreviewBlankForm'
import { get } from '../FormManager/FormBuilder/stores/requests';
import fetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import TextField from '@material-ui/core/TextField';



// eslint-disable-next-line require-jsdoc

class Upload extends React.Component {
  
  static propTypes = {
    formsList: PropTypes.any, 
  };
  constructor(props) {
    super(props);
    this.state = {
      createForm: false,
      currentForm: null,
      formsList: null,
      somethingDeleted: false,
      viewForm: false
    };
  }
  componentDidMount(){
    this.fetchData();
  }
  fetchData(){
    fetch('http://localhost:5000/getBlankFormDetails')
    .then((res) => res.json())
    .then((data) => {
      this.setState({ formsList: data.forms});
    })
  }

  trashForm(formid){
    fetch('http://localhost:5000/deleteBlankForm/' + formid, {
      method: 'POST',
      mode: "no-cors"
    })
    .then((res) => res.text())
    .then (res => console.log(res));
    setTimeout ( () => {
      this.setState(() => ({somethingDeleted: true}));
    }, 300);
    this.fetchData();
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {createForm, currentForm, viewForm, formsList} = this.state;
    /*const useStyles = makeStyles({
      table: {
        minWidth: 650,
      },
    });
    const classes = useStyles(); */

    if (formsList === null){
      return(
        <div>
          loading...
        </div>
      )
    }
    if (viewForm === true){
      let form = this.state.currentForm;
      return(
        <div>
            <TextField defaultValue={form.name}></TextField>
            <br />
            <button>Change Name</button>
            <div> [Form data goes here]</div>
        </div>
      )
    }
    
    let result = Object.values(formsList);
    var allInfoArr = [];
    for (var i = 0; i < result.length; i++){
      let form = {
        id: result[i].form_id,
        name: result[i].form_name,
        date: result[i].date_created
      };
      allInfoArr.push(form);
    }
    return (
      <div>
        {createForm ? <FormManager/>: 
         viewForm ? <PreviewBlankForm parentData = {this.state}/>: 
          <div>
            <button onClick= {() => this.setState({createForm: true})}> Add Form </button>
            <div> 
              <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Date Created</TableCell>
                        <TableCell align="right">Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                          {allInfoArr.map(row => (
                              <TableRow key={row}>
                                <TableCell component="th" scope="row" onClick={()=>this.setState({currentForm: row, viewForm: true})}>{row.name} </TableCell>
                                <TableCell align="right">{row.date}</TableCell>
                                <TableCell align="right"> <button onClick={() => this.trashForm(row.id)}>Delete</button></TableCell>
                              </TableRow>
                            ))}
                    </TableBody>
                  </Table>
              </TableContainer>
            </div>
          </div>
        }

      </div>
    );
  }
}

export default Upload;
