import React from 'react';
import Header from '../Header';
import ProfileEdit from './ProfileEdit'
// import FormCard from './FormCard';
import TextField from '@material-ui/core/TextField';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";



const imageStyle = {
  width: '100px',
  height: 'auto',
};
const formStyle ={
  display: 'inline-block',
  // position: 'absolute',
  width: '1400px',
  height: '800px',
  backgroundColor: '#A1C2DC',
}
const parentForm = {
  textAlign: 'center',
}
// eslint-disable-next-line require-jsdoc
class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forms: null,
      basicInfo: null,
      currTab: 0,
      value:0,
    };
  }
  
  componentDidMount() {
    const id = this.props.match.params.id;

    fetch('http://127.0.0.1:5000/studentProfile?id=' + id)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          forms: data.forms,
          basicInfo: data.basic_info
      });
        console.log(data);
      })
      .catch(console.log);
    }

  render() {
    const {forms, basicInfo, currTab} = this.state;
    // eslint-disable-next-line react/prop-types
    if (!forms || !basicInfo) {
      return (
        <div>
          <Header/>
          Loading...
        </div>
      );
    }
    const id = this.props.match.params.id;
    
    return (
      <div>
        <Header currTab='students'/>
                id={id}
        <img
        style={imageStyle}
        src="https://i1.wp.com/acaweb.org/wp-content/uploads/2018/12/profile-placeholder.png"
        ></img>
        <div>{basicInfo.first_name} {basicInfo.last_name}</div>
    
          <TextField style={{width: 500}} id="outlined-basic" label="Search for Forms" variant="outlined" />
        <BottomNavigation
          value={this.state.value}
          onChange={(event, newValue) => {
            this.setState({currTab: newValue,value:newValue})
          }}
          showLabels
         
        >
          <BottomNavigationAction label="Forms"/>
          <BottomNavigationAction label="Documents" />
          <BottomNavigationAction label="Edit Student Info" />
          
          </BottomNavigation>

        {currTab === 0 && <div style = {parentForm}><div style={formStyle}>
          <TableContainer component={Paper}>
        <Table  aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align="right">Form</TableCell>
              <TableCell align="right">Fat&nbsp;(g)</TableCell>
              <TableCell align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell align="right">Protein&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms.map(form => (
              <TableRow key={form.form_id}>
                <TableCell component="th" scope="row">
                  {form.form_num}
                </TableCell>
                <TableCell align="right">{form.last_updated}</TableCell>
                <TableCell align="right">{form.last_viewed}</TableCell>
                <TableCell align="right">{form.percent_completed}</TableCell>
                <TableCell align="right">{form.required === true ? 'Y' : 'N'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
          </div></div>}
        {currTab === 1 && <div>documents</div>}
        {currTab === 2 && <ProfileEdit basicInfo={basicInfo}/>}
      
        
      </div>
    );
  }
}

export default Student;
