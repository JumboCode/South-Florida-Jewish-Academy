import React from 'react';
import ProfileEdit from './ProfileEdit';

import TextField from '@material-ui/core/TextField';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ReceiptIcon from '@material-ui/icons/Receipt';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import EditIcon from '@material-ui/icons/Edit';


// const useStyles = {
//   text: {
//     fontSize: '50',
//   },
// };

const imageStyle = {
  width: '5.5%',
  height: 'auto',
};

const formStyle = {
  display: 'inline-block',
  alignItems: 'center',
  justifyContent: 'center',
  width: '60%',
  // width: '1200px',
  // height: '800px',
};

const parentForm = {
  textAlign: 'center',
};

const textSize = {
  fontSize: '13px',
};

const parent = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: '40px',
};

const child = {
  order: '1',
};

const parent2={
  flexDirection: 'row',
  paddingLeft: '15px',
  paddingTop: '10px',
};

const line={
  height: '1.5px',
  backgroundColor: '#FE8000',
};

const child2= {
  order: '1',
  paddingLeft: '430px',
};

const bottomNav={
  fontSize: '5em',
};


// eslint-disable-next-line require-jsdoc
class Student extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      forms: null,
      basicInfo: null,
      currTab: 0,
      value: 0,
    };
  }

  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const id = this.props.match.params.id;

    fetch('http://127.0.0.1:5000/studentProfile?id=' + id)
        .then((res) => res.json())
        .then((data) => {
          this.setState({
            forms: data.forms,
            basicInfo: data.basic_info,
          });
          console.log(data);
        })
        .catch(console.log);
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {forms, basicInfo, currTab} = this.state;
    // const {classes, children, className, ...other} = this.props;
    // eslint-disable-next-line react/prop-types
    if (!forms || !basicInfo) {
      return (
        <div>
          Loading...
        </div>
      );
    }
    // const id = this.props.match.params.id;

    // const classes = useStyles();
    return (
      <div>
        {/* id={id} */}
        <div style= {parent}>
          <img alt="student_image"
            style={imageStyle}
            src="https://i1.wp.com/acaweb.org/wp-content/uploads/2018/12/profile-placeholder.png"
          />
          {/* <div style={parent2}> */}
          <div style={parent2}>
            <div style={child}>{basicInfo['first_name']}
              {basicInfo['last_name']}</div>
            <div style={child}> ID: {basicInfo['_id']}</div>
            <div style={child}> <div style={line}> </div></div>
          </div>
          <div style={child2}>
            <TextField id="outlined-basic"
              label="Search for Forms" 
              style ={{width:250}}
              variant="outlined" />
          </div>
        </div>
        {/* </div> */}
        <div style={bottomNav}>
          <BottomNavigation
            value={this.state.value}
            onChange={(event, newValue) => {
              this.setState({currTab: newValue, value: newValue});
            }}
            showLabels

          >
            <BottomNavigationAction label="Forms" icon={<ReceiptIcon />}/>
            {/* eslint-disable-next-line max-len */}
            <BottomNavigationAction label="Documents" icon={<InsertDriveFileIcon />} />
            {/* eslint-disable-next-line max-len */}
            <BottomNavigationAction label="Edit Student Info" icon={<EditIcon />}/>
          </BottomNavigation>
        </div>
        {currTab === 0 && <div style = {parentForm}><div style={formStyle}>
          <TableContainer component={Paper}>
            <Table size = 'large'>
              <TableHead>
                <TableRow >
                  {/* eslint-disable-next-line max-len */}
                  <TableCell style={textSize} align = "left" >Form Name</TableCell>
                  {/* eslint-disable-next-line max-len */}
                  <TableCell style={textSize} align = "center" >Parent Name</TableCell>
                  {/* eslint-disable-next-line max-len */}
                  <TableCell style={textSize} align = "center" >Parent Email</TableCell>
                  {/* eslint-disable-next-line max-len */}
                  <TableCell style={textSize} align = "center" >Status</TableCell>
                  {/* eslint-disable-next-line max-len */}
                  <TableCell style={textSize} align = "right" >Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form['_id']}>
                    {/* eslint-disable-next-line max-len */}
                    <TableCell style={textSize} align = "left" >{form['form_name']}</TableCell>
                    {/* eslint-disable-next-line max-len */}
                    <TableCell style={textSize} align = "center" >{form['p_first_name']} {form['p_last_name']}</TableCell>
                    {/* eslint-disable-next-line max-len */}
                    <TableCell style={textSize} align = "center" >{form['p_email']}</TableCell>
                    {/* eslint-disable-next-line max-len */}
                    <TableCell style={textSize} align = "center">{form['completed']=== true ? <CheckCircleIcon/> : <HighlightOffIcon/>}</TableCell>
                    {/* eslint-disable-next-line max-len */}
                    <TableCell style={textSize} align = "right">{form['last_updated']=== null ? 'N/A': form['last_updated']}</TableCell>
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

// export default withStyles(useStyles)(Student);
export default Student;
