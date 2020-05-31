/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import {
  parentPageStyle,
} from './Styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import IconButton from '@material-ui/core/IconButton';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import {withStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';

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
class Parents extends React.Component {
    static propTypes = {
      parents: PropTypes.any,
      students: PropTypes.any,
      classes: PropTypes.any,
      tableCollapse: PropTypes.any,
      sortBy: PropTypes.any,
      open: PropTypes.any,
      order: PropTypes.any,
      query: PropTypes.any,
      columnToQuery: PropTypes.any,
    };

    // eslint-disable-next-line require-jsdoc
    constructor(props) {
      super(props);
      const {parents} = this.props;
      const tableCollapse = {};
      parents.forEach((parent) => tableCollapse[parent['id']] = false);
      this.state = {
        parents: parents,
        students: [],
        originalParents: [],
        sortBy: '',
        open: false,
        tableCollapse: tableCollapse,
        order: 'incr',
        query: '',
        columnToQuery: 'first_name',
        selected: null,
      };
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
      const {parents, order} = this.state;
      const newData = this.stableSort(
          parents,
          this.getComparator(order, whatToSortOn),
      );
      this.setState({
        sortBy: whatToSortOn,
        parents: newData,
        order: order === 'desc' ? 'asc' : 'desc',
      });
    }

    // eslint-disable-next-line require-jsdoc
    render() {
      const {parents, sortBy, order, selected} = this.state;
      // eslint-disable-next-line react/prop-types
      const {classes, className, history, currId} = this.props;
      const tableStyle = clsx(classes.text, className);
      // eslint-disable-next-line react/jsx-key
      return (
        <div>
          <div style={parentPageStyle}>
            <div style={{width: '100%', maxWidth: 1000}}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell align="center" className={tableStyle}>
                        <TableSortLabel
                          onClick={(e) => this.sort('first_name')}
                          active={sortBy === 'first_name'}
                          direction={order === 'asc' ? 'desc' : 'asc'}
                        />
                                            First Name
                      </TableCell>
                      <TableCell align="center" className={tableStyle}>
                        <TableSortLabel
                          onClick={(e) => this.sort('last_name')}
                          active={sortBy === 'last_name'}
                          direction={order === 'asc' ? 'desc' : 'asc'}
                        />
                                            Last Name
                      </TableCell>
                      <TableCell align="center" className={tableStyle}>
                        <TableSortLabel
                          onClick={(e) => this.sort('email')}
                          active={sortBy === 'email'}
                          direction={order === 'asc' ? 'desc' : 'asc'}
                        />
                                            Email
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parents.map((parent) => (
                      <React.Fragment key={parent['id']}>
                        <TableRow key={parent['id']}>
                          <TableCell>
                            <IconButton aria-label="expand row" size="small"
                              onClick={() => {
                                const nTableCollapse=this.state.tableCollapse;
                                nTableCollapse[parent['id']] =
                                              !nTableCollapse[parent['id']];
                                this.setState({tableCollapse: nTableCollapse});
                              }}>
                              {this.state.tableCollapse[parent['id']] ?
                              <KeyboardArrowUpIcon />:<KeyboardArrowDownIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell align="center" component="th"
                            scope="row" className={tableStyle}>
                            {parent['first_name']} </TableCell>
                          <TableCell align="center" className={tableStyle}>
                            {parent['last_name']} </TableCell>
                          <TableCell align="center" className={tableStyle}>
                            {parent['email']} </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell key = {parent['id']}
                            style = {{paddingBottom: 0, paddingTop: 0}}
                            colSpan = {6}>
                            <Collapse
                              in={this.state.tableCollapse[parent['id']]}
                              timeout="auto" unmountOnExit>
                              <Box margin={1}>
                                <Typography variant="h6"
                                  gutterBottom component="div">
                                    Children
                                  <Table>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell align="center"
                                          className={tableStyle}>
                                          First Name</TableCell>
                                        <TableCell align="center"
                                          className={tableStyle}>
                                          Last Name</TableCell>
                                        <TableCell align="center"
                                          className={tableStyle}>
                                          Grades</TableCell>
                                        <TableCell align="center"
                                          className={tableStyle}>
                                          DOB</TableCell>
                                        <TableCell align="center"
                                          className={tableStyle}>
                                          Completed Forms</TableCell>
                                        <TableCell align="center"
                                          className={tableStyle}>
                                          Archived?</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {parent['children'].map((student) =>
                                        <TableRow
                                          key={student.id}
                                          onMouseEnter={() => this.setState({selected: parent['id'] + student.id})}
                                          onMouseLeave={() => this.setState({selected: null})}
                                          style={{cursor: 'pointer', backgroundColor: selected === parent['id'] + student.id ? 'rgba(211,211,211, 0.7)': '#ffffff'}}
                                          onClick={() => {
                                            if (currId !== student.id) {
                                              // eslint-disable-next-line react/prop-types
                                              history.push('/students/' + student.id);
                                            }
                                          }}
                                        >
                                          <TableCell align="center"
                                            className={tableStyle}>
                                            {student.first_name}</TableCell>
                                          <TableCell align="center"
                                            className={tableStyle}>
                                            {student.last_name}</TableCell>
                                          <TableCell align="center"
                                            className={tableStyle}>
                                            {student.grade}</TableCell>
                                          <TableCell align="center"
                                            className={tableStyle}>
                                            {student.DOB}</TableCell>
                                          <TableCell align="center"
                                            className={tableStyle}>
                                            {student.forms_completed}
                                          </TableCell>
                                          <TableCell align="center"
                                            className={tableStyle}>
                                            {student.archived ? 'Y' : 'N'}
                                          </TableCell>
                                        </TableRow>)}
                                    </TableBody>
                                  </Table>
                                </Typography>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
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

export default withStyles(useStyles)(Parents);
