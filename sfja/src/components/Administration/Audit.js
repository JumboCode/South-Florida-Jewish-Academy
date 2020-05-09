/* eslint-disable indent,max-len */
import React from 'react';
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
import apiUrl from '../../utils/Env';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import {CircularProgress} from '@material-ui/core';

// eslint-disable-next-line require-jsdoc
class Audit extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      order: 'asc',
      sortBy: 'id',
      rowsPerPage: 10,
      pageNum: 0,
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
        }).then(() => {
          this.sortBy('time');
        }).catch(console.log);
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {data, order, sortBy, rowsPerPage, pageNum} = this.state;
    let count = 0;
    return (
      <div style={{width: 700}}>
        <Paper elevation={2} style={{width: 700, padding: 20}}>
          <div style={{paddingBottom: 10, fontSize: 30}}>
            Audit logs
          </div>
          {data ? <div>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{fontSize: 14}}>
                      <TableSortLabel onClick={(e) => this.sortBy('id')}
                                      active={sortBy === 'id'}
                                      direction={order}/>ID</TableCell>
                    {/* eslint-disable-next-line max-len */}
                    <TableCell style={{fontSize: 14}} align="right" onClick={(e) => this.sortBy('email')}>
                      <TableSortLabel onClick={(e) => this.sortBy('email')}
                                      active={sortBy === 'email'}
                                      direction={order}/>Email</TableCell>
                    <TableCell style={{fontSize: 14}} align="right">
                      <TableSortLabel onClick={(e) => this.sortBy('time')}
                                      active={sortBy === 'time'}
                                      direction={order}/>Time</TableCell>
                    <TableCell style={{fontSize: 14}} align="right">
                      <TableSortLabel onClick={(e) => this.sortBy('action')}
                                      active={sortBy === 'action'}
                                      direction={order}/>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* eslint-disable-next-line max-len */}
                  {data.slice(pageNum * rowsPerPage, pageNum * rowsPerPage + rowsPerPage)
                    .map((d) => {
                      count = count + 1;
                      return (
                        <TableRow key={count}>
                          <TableCell component="th" scope="row" style={{fontSize: 14}}>
                            {d.id}
                          </TableCell>
                          <TableCell align="right" style={{fontSize: 14}}>{d.email}</TableCell>
                          <TableCell align="right" style={{fontSize: 14}}>{d.time}</TableCell>
                          <TableCell align="right" style={{fontSize: 14}}>{d.action}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      count={data.length}
                      rowsPerPage={rowsPerPage}
                      page={pageNum}
                      onChangePage={(event, newPage) => {
                        this.setState({
                          pageNum: newPage,
                        });
                      }}
                      onChangeRowsPerPage={(event) => {
                        this.setState({
                          rowsPerPage: parseInt(event.target.value, 10),
                          pageNum: 0,
                        });
                      }}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </div> : <CircularProgress/>}
        </Paper>
      </div>
    );
  }
}

export default withCookies(Audit);
