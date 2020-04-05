import React from 'react';
import MagnifyingGlass from './MagnifyingGlass';
import {NavLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  studentPageStyle,
  filterStyle,
  studentInfoStyle,
  searchBarStyle,
  InputStyle,
  MagnifyingGlassStyle,
} from './Styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {withStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';


const useStyles = {
  text: {
    'fontSize': '1em',
    'color': 'black',
    '&:visited': {
      fontSize: '1em',
      color: 'purple',
    },
  },
};

// eslint-disable-next-line require-jsdoc
class Students extends React.Component {
  static propTypes = {
    students: PropTypes.any,
    classes: PropTypes.any,
  };
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      students: null,
    };
  }
  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    fetch('http://127.0.0.1:5000/students')
        .then((res) => res.json())
        .then((data) => {
          this.setState({students: data.students});
          console.log(data);
        })
        .catch(console.log);
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    const {students} = this.state;

    // eslint-disable-next-line react/prop-types
    const {updateCurrView, classes, className} = this.props;
    // console.log(classes);
    const tableStyle = clsx(classes.text, className);
    if (!students) {
      return (
        <div>
          Loading...
        </div>
      );
    }
    return (
      <div>
        <div style={studentPageStyle}>
          <div style={filterStyle}>
            <p onClick={() => updateCurrView('student')}> Filters </p>
          </div>
          <div style={studentInfoStyle}>
            <div style={searchBarStyle}>
              <input
                style={InputStyle}
                placeholder="Search for StudentProfile"
              />
              <MagnifyingGlass style={MagnifyingGlassStyle} />
            </div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className= {tableStyle}>First Name</TableCell>
                    <TableCell align="left" className= {tableStyle}>Last Name
                    </TableCell>
                    <TableCell align="left" className= {tableStyle}>DOB
                    </TableCell>
                    <TableCell align="left" className= {tableStyle}>
                      Completed Forms
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.student_id}>
                      <TableCell component="th" scope="row"
                        className={tableStyle}>
                        <NavLink to={'/profile/' + student.student_id}>
                          <Typography align="left" className={tableStyle}>
                            {student.first_name}</Typography>
                        </NavLink>
                      </TableCell>
                      <TableCell align="left" className= {tableStyle}>
                        {student.last_name}</TableCell>
                      <TableCell align="left" className= {tableStyle}>
                        {student.DOB}</TableCell>
                      <TableCell align="left" className= {tableStyle}>
                        {student.forms_completed}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>

    );
  }
}

export default withStyles(useStyles)(Students);
// export default Students;
