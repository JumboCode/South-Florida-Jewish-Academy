import React from 'react';
import {NavLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  parentPageStyle,
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
class Parents extends React.Component {
    static propTypes = {
      parents: PropTypes.any,
      classes: PropTypes.any,
      cookies: instanceOf(Cookies).isRequired,
      sortBy: PropTypes.any,
      order: PropTypes.any,
      query: PropTypes.any,
      columnToQuery: PropTypes.any,
    };

    // eslint-disable-next-line require-jsdoc
    constructor(props) {
      super(props);
      this.state = {
        parents: [],
        originalParents: [],
        sortBy: '',
        order: 'incr',
        query: '',
        columnToQuery: 'first_name',
      };
    }

    // eslint-disable-next-line require-jsdoc
    componentDidMount() {
      const {cookies} = this.props;
      fetch(apiUrl() + '/parents', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('token')}`,
        },
      })
          .then((res) => res.json())
          .then((data) => {
            this.setState({parents: data.parents,
              originalParents: data.parents});
            console.log(data);
          })
          .catch(console.log);
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
    updateParents(query) {
      const {originalParents} = this.state;
      if (originalParents === null) {
        console.log('null');
      }
      const filtered = originalParents.filter((currParent) =>
        (currParent.first_name.startsWith(query) ||
            currParent.last_name.startsWith(query)));
      this.setState({
        parents: filtered,
      });
    }

    // eslint-disable-next-line require-jsdoc
    render() {
      const {parents, sortBy, order} = this.state;
      // eslint-disable-next-line react/prop-types
      const {classes, className} = this.props;
      const tableStyle = clsx(classes.text, className);
      return (
        <div>
          <div style={parentPageStyle}>
            <div style={filterStyle}>
              <p> Filters </p>
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
                      this.updateParents(e.target.value);
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
                      <TableRow key={parent.parent_id}>
                        <TableCell component="th" scope="row"
                          className={tableStyle}>
                          <NavLink to={'/profile/' + parent.parent_id}>
                            <Typography align="center" className={tableStyle}>
                              {parent.first_name}</Typography>
                          </NavLink>
                        </TableCell>
                        <TableCell align="center" className={tableStyle}>
                          {parent.last_name}</TableCell>
                        <TableCell align="center" className={tableStyle}>
                          {parent.email}</TableCell>
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

export default withCookies(withStyles(useStyles)(Parents));