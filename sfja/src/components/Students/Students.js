import React from 'react';
import MagnifyingGlass from './MagnifyingGlass';
import PropTypes from 'prop-types';
import {
  studentPageStyle,
  filterStyle,
  studentInfoStyle,
  searchBarStyle,
  InputStyle,
  MagnifyingGlassStyle,
} from './Styles';
import Header from '../Header';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

// eslint-disable-next-line require-jsdoc
class Students extends React.Component {
  static propTypes = {
    students: PropTypes.any,
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
    const {updateCurrView} = this.props;
    if (!students) {
      return (
        <div>
          <Header currTab='students'/>
          Loading...
        </div>
      );
    }
    return (
      <div>
        <Header currTab='students' />
        <div style={studentPageStyle}>
          <div style={filterStyle}>
            <p onClick={() => updateCurrView('student')}> Filters </p>
          </div>
          <div style={studentInfoStyle}>
            <div style={searchBarStyle}>
              <input
                style={InputStyle}
                placeholder="Search for Student"
              />
              <MagnifyingGlass style={MagnifyingGlassStyle} />
            </div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell align="right">Last Name</TableCell>
                    <TableCell align="right">DOB</TableCell>
                    <TableCell align="right">Completed Forms</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.student_id}>
                      <TableCell component="th" scope="row">
                        {student.first_name}
                      </TableCell>
                      <TableCell align="right">{student.last_name}</TableCell>
                      <TableCell align="right">{student.DOB}</TableCell>
                      <TableCell align="right">{student.forms_completed}
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

export default Students;
