import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import {withCookies, Cookies} from 'react-cookie';
import {instanceOf} from 'prop-types';
import apiUrl from '../utils/Env';

// eslint-disable-next-line require-jsdoc
class Audit extends React.Component {
  static propTypes = {
    users: PropTypes.any,
    data: PropTypes.any,
    cookies: instanceOf(Cookies).isRequired,
  };

  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      users: null,
      data: null,
      order: 'asc',
      sortBy: 'id',
    };
  };

  // eslint-disable-next-line require-jsdoc
  descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  // eslint-disable-next-line require-jsdoc
  getComparator(order, orderBy) {
    return order === 'desc' ?
        (a, b) => this.descendingComparator(a, b, orderBy) :
        (a, b) => -this.descendingComparator(a, b, orderBy);
  };

  // eslint-disable-next-line require-jsdoc
  stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  // eslint-disable-next-line require-jsdoc
  sortBy(feature) {
    const {data, order} = this.state;
    // eslint-disable-next-line max-len
    const newData = this.stableSort(data, this.getComparator(order === 'desc' ? 'asc' : 'desc', feature));
    this.setState({
      sortBy: feature,
      data: newData,
      order: order === 'desc' ? 'asc' : 'desc',
    });
  };

  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    const {cookies} = this.props;
    fetch(apiUrl() + '/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
      // eslint-disable-next-line arrow-parens
    })
        .then((res) =>res.json())
        .then((data) => {
          this.setState({users: data.users});
          this.setState({data:
                  data.users.reduce(
                      function(acc, x) {
                        x.actions.forEach(
                            (a) => {
                              // eslint-disable-next-line max-len
                              const id = x.user_id; const time = a[0]; const action = a[1]; const email = x.email;
                              const rec = {id, time, action, email};
                              acc.push(rec);
                            });
                        return acc;
                      }, [])});
        })
        .catch(console.log);
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {users, data, order, sortBy} = this.state;
    let count = 0;
    if (!users || !data) {
      return (
        <div>
                 Loading
        </div>
      );
    }

    return (
      <div>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel onClick={(e) => this.sortBy('id')}
                    active={sortBy === 'id'}
                    direction={order}/>ID</TableCell>
                <TableCell align="right" onClick={(e) => this.sortBy('email')}>
                  <TableSortLabel onClick={(e) => this.sortBy('email')}
                    active={sortBy === 'email'}
                    direction={order}/>Email</TableCell>
                <TableCell align="right">
                  <TableSortLabel onClick={(e) => this.sortBy('time')}
                    active={sortBy === 'time'}
                    direction={order}/>Time</TableCell>
                <TableCell align="right">
                  <TableSortLabel onClick={(e) => this.sortBy('action')}
                    active={sortBy === 'action'}
                    direction={order}/>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((d) => {
                count = count + 1;
                return (
                  <TableRow key={count}>
                    <TableCell component="th" scope="row">
                      {d.id}
                    </TableCell>
                    <TableCell align="right">{d.email}</TableCell>
                    <TableCell align="right">{d.time}</TableCell>
                    <TableCell align="right">{d.action}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default withCookies(Audit);
