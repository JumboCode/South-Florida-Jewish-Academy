import React from 'react';
import FormManager from './FormManager/FormManager';
import { get } from './FormManager/FormBuilder/stores/requests';
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



// eslint-disable-next-line require-jsdoc

class Upload extends React.Component {
  
  static propTypes = {
    formsList: PropTypes.any, 
  };
  constructor(props) {
    super(props);
    this.state = {
      createForm: false,
      currentForm: false,
      formsList: null,
      somethingDeleted: false
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

  trashForm(currentForm){
    fetch('http://localhost:5000/deleteBlankForm/' + currentForm , {
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
    const {createForm, currentForm, formsList} = this.state;
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
    let result = Object.values(formsList);
  
    /* Data is structured as an array of form arrays, each containing
     [id, name, date created] */

    /* form id array */ 
    var formIdArr = [];   
    for (var i = 0; i < result.length; i++){
      formIdArr.push(result[i].form_id);
    }

    /* Type of form */
    var formNameArr = [];
    for (var i = 0; i < result.length; i++){
      formNameArr.push(result[i].form_name);
    }

    /* Last updated */
    var formDateArr = [];
    for (var i = 0; i < result.length; i++){
      formDateArr.push(result[i].date_created);
    }


    /* Push details to main array*/
    var allInfoArr = [];
    for (var i = 0; i < result.length; i++){
      let oneArr = []
      oneArr.push(formIdArr[i]);
      oneArr.push(formNameArr[i]);
      oneArr.push(formDateArr[i]);
      allInfoArr.push(oneArr);
    }
    return (
      <div>
        {createForm ? <FormManager/>: 
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
                                <TableCell component="th" scope="row">{row[1]} </TableCell>
                                <TableCell align="right">{row[2]}</TableCell>
                                <TableCell align="right"> <button onClick={() => this.trashForm(row[0])}>Delete</button></TableCell>
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
