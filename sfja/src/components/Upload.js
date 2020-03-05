import React from 'react';
import Header from './Header';
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
      formsList: null
    };
  }
  componentDidMount(){
    fetch('http://localhost:5000/forms')
    .then((res) => res.json())
    .then((data) => {
      this.setState({ formsList: data.forms});
      console.log(data);
    })
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
          <Header currTab='upload'/>
          loading...
        </div>
      )
    }
    let result = Object.values(formsList);
    var formNumArr = [];
    for (var i = 0; i < result.length; i++){
      formNumArr.push(result[i].form_num);
    }
    var formIdArr = [];
    for (var i = 0; i < result.length; i++){
      formNumArr.push(result[i].form_id);
    }
    
    return (
      <div>
        <Header currTab='upload'/>
        {createForm ? <FormManager/>: 
          <div>
            <button onClick= {() => this.setState({createForm: true})}> Add Form </button>
            <div> 
              {/* {result.map(form => <ul>{form}</ul>)} */}
              {formNumArr}
              <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Id</TableCell>
                        <TableCell align="right">Form id</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                          {formNumArr.map(row => (
                              <TableRow key={row}>
                                <TableCell component="th" scope="row">{row} </TableCell>
                                <TableCell align="right">{row}</TableCell>
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
