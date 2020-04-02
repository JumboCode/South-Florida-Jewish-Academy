import React from 'react';
import ProfileEdit from './ProfileEdit'

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
const textSize = {
  fontSize: '13px'
  
};

const navStyle = {
  label: {
    fontSize:'30px'
  }
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
    const { classes, children, className, ...other } = this.props;
    // eslint-disable-next-line react/prop-types
    if (!forms || !basicInfo) {
      return (
        <div>
          Loading...
        </div>
      );
    }
    const id = this.props.match.params.id;
    
    // const classes = useStyles();
    return (
      <div>
                {/* id={id} */}
        <img
        style={imageStyle}
        src="https://i1.wp.com/acaweb.org/wp-content/uploads/2018/12/profile-placeholder.png"
        ></img>
        <div>{basicInfo['first_name']} {basicInfo['last_name']}</div>
    
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
        <Table size = 'large'>
          <TableHead>
            <TableRow >
              <TableCell style={textSize} >Form Name</TableCell>
              <TableCell  style={textSize} >Status</TableCell>
              <TableCell style={textSize} >Last Updated(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms.map(form => (
              <TableRow  key={form['_id']}>
                {/* <TableCell style={textSize} component="th" scope="row">
                  {form['form_num']}
                </TableCell> */}
                <TableCell style={textSize}>{form['form_name']}</TableCell>
                <TableCell style={textSize}>{form['completed']=== true ? 'Y' : 'N'}</TableCell>
                <TableCell style={textSize}>{form['last_updated']=== null ? 'N/A': form['last_updated']}</TableCell>
                {/* <TableCell style={textSize}>{form['required'] === true ? 'Y' : 'N'}</TableCell> */}
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
