/* eslint-disable max-len,require-jsdoc,react/prop-types */
import React from 'react';
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
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from '../../utils/Env';
import {CircularProgress, TextField, Button} from '@material-ui/core';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import Filters from './Filters';
import ArchiveIcon from '@material-ui/icons/Archive';
import ConfirmationDialog from '../../utils/ConfirmationDialog';
import SnackBarMessage from '../../utils/SnackBarMessage';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import {withAuth0} from '../../utils/Auth0Wrapper';

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


class Students extends React.Component {
    static propTypes = {
      students: PropTypes.any,
      classes: PropTypes.any,
      cookies: instanceOf(Cookies).isRequired,
      sortBy: PropTypes.any,
      order: PropTypes.any,
      query: PropTypes.any,
      columnToQuery: PropTypes.any,
    };

    constructor(props) {
      super(props);
      const {cookies} = this.props;
      const cache = cookies.get('studentsCache');
      this.state = {
        students: null,
        originalStudents: null,
        sortBy: cache ? cache.sortBy : 'first_name',
        order: cache ? cache.order : 'desc',
        query: cache ? cache.query : '',
        columnToQuery: cache ? cache.columnToQuery : 'first_name',
        toArchiveOrUnarchive: {
          student_id: '',
          first_name: '',
          last_name: '',
        },
        authorized: false,
        showArchiveConfirmation: false,
        showUnArchiveConfirmation: false,
        openSuccessMessage: false,
        openFailureMessage: false,
        selected: null,
        filters: {
          grades: {},
          completed: {
            complete: false,
            incomplete: false,
          },
          archived: {
            archived: false,
            unarchived: true,
          },
        },
      };
      this.saveCache = this.saveCache.bind(this);
    }

    saveCache() {
      const {sortBy, order, query, columnToQuery, filters} = this.state;
      const {cookies} = this.props;
      const newCache = {
        sortBy: sortBy,
        order: order,
        query: query,
        columnToQuery: columnToQuery,
        filters: filters,
      };
      cookies.set('studentsCache', newCache);
    }

    componentWillUnmount() {
      this.saveCache();
      window.removeEventListener('beforeunload', this.saveCache);
    }

    componentDidMount() {
      const {cookies, token} = this.props;
      const {sortBy, query, order} = this.state; // from constructor
      fetch(apiUrl() + '/students', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
          .then((res) => res.json())
          .then((data) => {
            const cache = cookies.get('studentsCache');
            if (cache) {
              // combine old + new filters
              const newFilters = this.makeFilters(data.students);
              const oldFiltersGrades = cache.filters.grades;
              const newGrades = {};
              Object.keys(newFilters.grades).forEach((grade) => {
                if (Object.keys(oldFiltersGrades).includes(grade)) {
                  newGrades[grade] = oldFiltersGrades[grade];
                } else {
                  newGrades[grade] = newFilters.grades[grade];
                }
              });
              newFilters.grades = newGrades;
              newFilters.archived = cache.filters.archived;
              newFilters.completed = cache.filters.completed;
              this.setState({
                students: data.students,
                originalStudents: data.students,
                sortBy: cache.sortBy,
                order: cache.order,
                query: cache.query,
                columnToQuery: cache.columnToQuery,
                filters: newFilters,
                authorized: data.authorized,
              });
              return ({sortBy: cache.sortBy, query: cache.query, order: cache.order});
            } else {
              this.setState({
                students: data.students,
                originalStudents: data.students,
                filters: this.makeFilters(data.students),
                authorized: data.authorized,
              });
              return ({sortBy: sortBy, query: query, order: order});
            }
          }).then(({sortBy, query, order}) => {
            if (sortBy && order) {
              this.sort(sortBy, order);
            }
            if (query) {
              this.updateStudents(query);
            }
          }).catch(console.log);
      window.addEventListener('beforeunload', this.saveCache);
    }

    everyTrue(filter) {
      const {filters} = this.state;
      return Object.keys(filters[filter]).every((key) => !filters[filter][key]);
    }

    makeFilters(students) {
      const filters = {};
      const grades = {};
      students.forEach((student) => {
        if (!Object.keys(grades).includes('grade_' + student.grade)) {
          grades['grade_' + student.grade] = false;
        }
      });
      filters.grades = grades;
      const showCompleted = {
        complete: false,
        incomplete: false,
      };
      const showArchived = {
        unarchived: true,
        archived: false,
      };
      filters.completed = showCompleted;
      filters.archived = showArchived;
      return filters;
    }

    refreshFilters(students, oldFilters) {
      const filters = {};
      const grades = {};
      students.forEach((student) => {
        if (!Object.keys(grades).includes('grade_' + student.grade)) {
          grades['grade_' + student.grade] = oldFilters.grades['grade_' + student.grade];
        }
      });
      filters.grades = grades;
      filters.completed = oldFilters.completed;
      filters.archived = oldFilters.archived;
      return filters;
    }

    descendingComparator(a, b, orderBy) {
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    }

    getComparator(order, orderBy) {
      return order === 'desc' ?
            (a, b) => this.descendingComparator(a, b, orderBy) :
            (a, b) => -this.descendingComparator(a, b, orderBy);
    }

    stableSort(array, comparator) {
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
      return stabilizedThis.map((el) => el[0]);
    }

    sort(sortBy, order) {
      const {students} = this.state;
      const newData = this.stableSort(
          students,
          this.getComparator(order, sortBy),
      );
      this.setState({
        sortBy: sortBy,
        students: newData,
        order: order,
      });
    }

    updateStudents(query) {
      const {originalStudents} = this.state;
      if (originalStudents === null) {
        console.log('null');
      }
      query = new RegExp(query, 'ig');
      const filtered = originalStudents.filter((currStudent) =>
        (currStudent.first_name.search(query) !== -1 ||
            currStudent.last_name.search(query) !== -1));
      this.setState({
        students: filtered,
      });
    }

    updateFilter(filterToUpdate, optionToUpdate, set) {
      const {filters} = this.state;
      filters[filterToUpdate][optionToUpdate] = set;
      this.setState({
        filters: filters,
      });
    }

    flipArchival(studentId, students) {
      return students.map((s) => (s.student_id !== studentId ? s : {
        student_id: s.student_id,
        first_name: s.first_name,
        middle_name: s.middle_name,
        last_name: s.last_name,
        DOB: s.DOB,
        grade: s.grade,
        forms_completed: s.forms_completed,
        completion_rate: s.completion_rate,
        archived: !s.archived,
      }));
    }

    archivalStudentChanger(studentId, action) {
      const {token} = this.props;
      const {students, originalStudents, filters} = this.state;
      const body = {
        id: studentId,
      };

      fetch(apiUrl() + '/' + action + 'Student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }).then((x) => {
        if (x.status === 200) {
          const newOriginalData = this.flipArchival(studentId, originalStudents);
          const newStudents = this.flipArchival(studentId, students);
          this.setState({
            openSuccessMessage: true,
            originalStudents: newOriginalData,
            students: newStudents,
            filters: this.refreshFilters(students, filters),
          });
        }
      }).catch((error) => {
        this.setState({
          openFailureMessage: true,
        });
      });
    }

    render() {
      const {students, sortBy, order, filters, authorized, showArchiveConfirmation, toArchiveOrUnarchive, openSuccessMessage, openFailureMessage, showUnArchiveConfirmation, selected} = this.state;
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
                studentsLength={students ? students.length : null}
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
              {students === null ?
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 10}}>
                  <CircularProgress/>
                </div> :
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className={tableStyle}>
                          <TableSortLabel
                            onClick={(e) => this.sort('first_name', order === 'desc' ? 'asc' : 'desc')}
                            active={sortBy === 'first_name'}
                            direction={order}
                          />
                          First Name
                        </TableCell>
                        <TableCell align="left" className={tableStyle}>
                          <TableSortLabel
                            onClick={(e) => this.sort('last_name', order === 'desc' ? 'asc' : 'desc')}
                            active={sortBy === 'last_name'}
                            direction={order}
                          />
                          Last Name
                        </TableCell>
                        <TableCell align="left" className={tableStyle}>
                          <TableSortLabel
                            onClick={(e) => this.sort('grade', order === 'desc' ? 'asc' : 'desc')}
                            active={sortBy === 'grade'}
                            direction={order}
                          />
                          Grade
                        </TableCell>
                        <TableCell align="center" className={tableStyle}>
                          DOB
                        </TableCell>
                        <TableCell align="left" className={tableStyle}>
                          <TableSortLabel
                            onClick={(e) => this.sort('completion_rate', order === 'desc' ? 'asc' : 'desc')}
                            active={sortBy === 'completion_rate'}
                            direction={order}
                          />
                          Completed Forms
                        </TableCell>
                        <TableCell align="center" className={tableStyle}
                        >
                          <TableSortLabel
                            onClick={(e) => this.sort('archived', order === 'desc' ? 'asc' : 'desc')}
                            active={sortBy === 'archived'}
                            direction={order}
                          >
                          </TableSortLabel>
                          Archived?
                        </TableCell>
                        {authorized ? (
                          <TableCell align="center" className={tableStyle}>
                            Archive
                          </TableCell>
                        ) : null}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student) => {
                        const showGrades = filters.grades['grade_' + student.grade] || this.everyTrue('grades');
                        const showArchived = (filters.archived.archived && student.archived) || (filters.archived.unarchived && !student.archived) || this.everyTrue('archived');
                        const showComplete = (filters.completed.complete && student.completion_rate === 1) || (filters.completed.incomplete && student.completion_rate !== 1) || this.everyTrue('completed');
                        const opacity = selected === student.student_id ? '0.7' : '0.5';
                        let backgroundColor = '#ffffff';
                        if (selected === student.student_id) {
                          backgroundColor = 'rgba(211,211,211, 0.7)';
                        } else {
                          if (student.completion_rate === 1) {
                            backgroundColor = 'rgba(76, 209, 27, ' + opacity + ')';
                          }
                          if (student.archived) {
                            backgroundColor = 'rgba(219, 103, 103, ' + opacity + ')';
                          }
                        }
                        if (showGrades && showArchived && showComplete) {
                          return (
                            <TableRow
                              key={student.student_id}
                              style={{cursor: 'pointer', backgroundColor: backgroundColor}}
                              onClick={() => this.props.history.push('/students/' + student.student_id)}
                              onMouseEnter={() => this.setState({selected: student.student_id})}
                              onMouseLeave={() => this.setState({selected: null})}
                            >
                              <TableCell align="center" className={tableStyle}>
                                {student.first_name}</TableCell>
                              <TableCell align="center" className={tableStyle}>
                                {student.last_name}</TableCell>
                              <TableCell align="center" className={tableStyle}>
                                {student.grade}</TableCell>
                              <TableCell align="center" className={tableStyle}>
                                {student.DOB}</TableCell>
                              <TableCell align="center" className={tableStyle}>
                                {student.forms_completed}
                              </TableCell>
                              <TableCell align="center" className={tableStyle}>
                                {student.archived ? 'Y' : 'N'}
                              </TableCell>
                              {authorized ? (
                                <TableCell align="center" className={tableStyle}>
                                  {student.archived ? <Button
                                    variant='contained'
                                    style={{cursor: 'pointer'}}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      this.setState({toArchiveOrUnarchive: student, showUnArchiveConfirmation: true});
                                    }}
                                  >
                                    <UnarchiveIcon fontSize='large' />
                                  </Button>:<Button
                                    variant='contained'
                                    style={{cursor: 'pointer'}}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      this.setState({toArchiveOrUnarchive: student, showArchiveConfirmation: true});
                                    }}
                                  >
                                    <ArchiveIcon fontSize='large'/>
                                  </Button>}
                                </TableCell>
                              ) : null}
                            </TableRow>
                          );
                        }
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              }
            </div>
          </div>
          <ConfirmationDialog
            showWarning={showArchiveConfirmation}
            setShowWarning={(newVal) => this.setState({showArchiveConfirmation: newVal})}
            onConfirm={() => this.archivalStudentChanger(toArchiveOrUnarchive.student_id, 'archive')}
            message={'Are you sure you want to archive ' + toArchiveOrUnarchive.first_name + ' ' + toArchiveOrUnarchive.last_name + '?'}
            confirmMessage='archive'
            notConfirmMessage='back'
          />
          <ConfirmationDialog
            showWarning={showUnArchiveConfirmation}
            setShowWarning={(newVal) => this.setState({showUnArchiveConfirmation: newVal})}
            onConfirm={() => this.archivalStudentChanger(toArchiveOrUnarchive.student_id, 'unarchive')}
            message={'Are you sure you want to unarchive ' + toArchiveOrUnarchive.first_name + ' ' + toArchiveOrUnarchive.last_name + '?'}
            confirmMessage='unarchive'
            notConfirmMessage='back'
          />
          <SnackBarMessage
            open={openSuccessMessage}
            closeSnackbar={() => this.setState({openSuccessMessage: false})}
            message={toArchiveOrUnarchive.first_name + ' ' + toArchiveOrUnarchive.last_name + ' action complete.'}
            severity='success'
          />
          <SnackBarMessage
            open={openFailureMessage}
            closeSnackbar={() => this.setState({openFailureMessage: false})}
            message={'There was an error.'}
            severity='error'
          />
        </div>

      );
    }
}

export default withAuth0(withCookies(withStyles(useStyles)(Students)));
