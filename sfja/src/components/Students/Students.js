import React from 'react';
import {NavLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  studentPageStyle,
  filterStyle,
} from './Styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import {withStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from '../../utils/Env';
import {TextField} from '@material-ui/core';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import Filters from './Filters';

const theme = createMuiTheme({
  palette: {
    primary: {main: '#086fb3'},
  },
});

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

const textSize = {
  style: {
    fontSize: 17,
  },
  autoComplete: 'new-password',
  form: {
    autoComplete: 'off',
  },
};

// eslint-disable-next-line require-jsdoc
class Students extends React.Component {
    static propTypes = {
      students: PropTypes.any,
      classes: PropTypes.any,
      cookies: instanceOf(Cookies).isRequired,
      sortBy: PropTypes.any,
      order: PropTypes.any,
      query: PropTypes.any,
      columnToQuery: PropTypes.any,
      filters: {
        grades: {},
      },
    };

    // eslint-disable-next-line require-jsdoc
    constructor(props) {
      super(props);
      this.state = {
        students: [],
        originalStudents: [],
        sortBy: '',
        order: 'incr',
        query: '',
        columnToQuery: 'first_name',
      };
    }

    // eslint-disable-next-line require-jsdoc
    componentDidMount() {
      const {cookies} = this.props;
      fetch(apiUrl() + '/students', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('token')}`,
        },
      })
          .then((res) => res.json())
          .then((data) => {
            this.setState({
              students: data.students,
              originalStudents: data.students,
              filters: this.makeFilters(data.students),
            });
            console.log(data);
          })
          .catch(console.log);
    }

    // eslint-disable-next-line require-jsdoc
    makeFilters(students) {
      const filters = {};
      const grades = {};
      students.forEach((student) => {
        if (!Object.keys(grades).includes(student.grade)) {
          grades[student.grade] = true;
        }
      });
      filters.grades = grades;
      return filters;
    }

    // eslint-disable-next-line require-jsdoc
    descendingComparator(a, b, orderBy) {
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    }

    // eslint-disable-next-line require-jsdoc
    getComparator(order, orderBy) {
      return order === 'desc' ?
            (a, b) => this.descendingComparator(a, b, orderBy) :
            (a, b) => -this.descendingComparator(a, b, orderBy);
    }

    // eslint-disable-next-line require-jsdoc
    stableSort(array, comparator) {
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
      return stabilizedThis.map((el) => el[0]);
    }

    // eslint-disable-next-line require-jsdoc
    sort(whatToSortOn) {
      const {students, order} = this.state;
      const newData = this.stableSort(
          students,
          this.getComparator(order, whatToSortOn),
      );
      this.setState({
        sortBy: whatToSortOn,
        students: newData,
        order: order === 'desc' ? 'asc' : 'desc',
      });
    }

    // eslint-disable-next-line require-jsdoc
    updateStudents(query) {
      const {originalStudents} = this.state;
      if (originalStudents === null) {
        console.log('null');
      }
      const filtered = originalStudents.filter((currStudent) =>
        (currStudent.first_name.startsWith(query) ||
            currStudent.last_name.startsWith(query)));
      this.setState({
        students: filtered,
      });
    }

    // eslint-disable-next-line require-jsdoc
    updateFilter(filterToUpdate, optionToUpdate, set) {
      const {filters} = this.state;
      filters[filterToUpdate][optionToUpdate] = set;
      this.setState({
        filters: filters,
      });
    }

    // eslint-disable-next-line require-jsdoc
    render() {
      const {students, sortBy, order, filters} = this.state;
      // eslint-disable-next-line react/prop-types
      const {classes, className} = this.props;
      const tableStyle = clsx(classes.text, className);
      return (
        <div>
          <div style={studentPageStyle}>
            <div style={filterStyle}>
              <Filters
                filters={filters}
                updateFilter={this.updateFilter.bind(this)}
              />
            </div>
            <div style={{width: '100%', maxWidth: 1000}}>
              <div style={{paddingTop: 10, paddingBottom: 10}}>
                <MuiThemeProvider theme={theme}>
                  <TextField
                    placeholder='Search by first or last name'
                    label={'Search'}
                    value={this.state.query}
                    inputProps={textSize}
                    fullWidth
                    InputLabelProps={textSize}
                    onChange={(e) => {
                      this.setState({query: e.target.value});
                      this.updateStudents(e.target.value);
                    }}
                  >
                  </TextField>
                </MuiThemeProvider>
              </div>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className={tableStyle}>
                        <TableSortLabel
                          onClick={(e) => this.sort('first_name')}
                          active={sortBy === 'first_name'}
                          direction={order === 'asc' ? 'desc' : 'asc'}
                        />
                                            First Name
                      </TableCell>
                      <TableCell align="left" className={tableStyle}>
                        <TableSortLabel
                          onClick={(e) => this.sort('last_name')}
                          active={sortBy === 'last_name'}
                          direction={order === 'asc' ? 'desc' : 'asc'}
                        />
                                            Last Name
                      </TableCell>
                      <TableCell align="left" className={tableStyle}>
                        <TableSortLabel
                          onClick={(e) => this.sort('grade')}
                          active={sortBy === 'grade'}
                          direction={order === 'asc' ? 'desc' : 'asc'}
                        />
                                            Grade
                      </TableCell>
                      <TableCell align="center" className={tableStyle}>DOB
                      </TableCell>
                      <TableCell align="left" className={tableStyle}>
                        <TableSortLabel
                          onClick={(e) => this.sort('forms_completed')}
                          active={sortBy === 'forms_completed'}
                          direction={order === 'asc' ? 'desc' : 'asc'}
                        />
                                            Completed Forms
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => {
                      // only supporting grade filtering now
                      if (filters.grades[student.grade]) {
                        return (
                          <TableRow key={student.student_id}>
                            <TableCell component="th" scope="row"
                              className={tableStyle}>
                              <NavLink to={'/profile/' + student.student_id}>
                                <Typography
                                  align="center"
                                  className={tableStyle}
                                >
                                  {student.first_name}
                                </Typography>
                              </NavLink>
                            </TableCell>
                            <TableCell align="center" className={tableStyle}>
                              {student.last_name}</TableCell>
                            <TableCell align="center" className={tableStyle}>
                              {student.grade}</TableCell>
                            <TableCell align="center" className={tableStyle}>
                              {student.DOB}</TableCell>
                            <TableCell align="center" className={tableStyle}>
                              {student.forms_completed}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>

      );
    }
}

export default withCookies(withStyles(useStyles)(Students));
