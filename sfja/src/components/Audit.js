import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
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

//hello
class Audit extends React.Component{
    static propTypes = {
        users: PropTypes.any,
        data: PropTypes.any,
        cookies: instanceOf(Cookies).isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            users:null,
            data:null,
            order:'asc',
            sortBy:'id',
        };
    };

    createData(id, time, action, email) {
        return {id, time, action, email};
    };
    
    descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
      };
      
    getComparator(order, orderBy) {
        return order === 'desc'
          ? (a, b) => this.descendingComparator(a, b, orderBy)
          : (a, b) => -this.descendingComparator(a, b, orderBy);
      };
      
    stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) return order;
          return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };

    sortBy(feature) {
        const {users, data, order} = this.state;
        const newData = this.stableSort(data, this.getComparator(order === "desc" ? "asc" : "desc", feature));
        console.log("new data: ", newData);
        this.setState({
            sortBy: feature,
            data: newData,
            order: order === "desc" ? "asc" : "desc",
        });
    };

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
                console.log(data);
                this.setState({users: data.users});
                this.setState({data: 
                    data.users.reduce(
                        function (acc, x) {
                            x.actions.forEach(
                                (a) => {
                                    console.log(a);
                                    let id = x.user_id, time = a[0], action = a[1], email = x.email;
                                    let rec = {id, time, action, email};
                                    acc.push(rec);
                                }); 
                            return acc;
                            }, [])});
            })
            .catch(console.log);
    }  

    render(){
        const {users, data, order, sortBy} = this.state;
        console.log(data);
        if (!users || !data) {
            return(
                <div>
                   Loading
                </div>
            );
        }
        
        return(
            <div>
            
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel onClick={e => this.sortBy('id')}
                                active={sortBy === 'id'}
                                direction={order}/>ID</TableCell>
                        <TableCell align="right" onClick={e => this.sortBy('email')}>
                            <TableSortLabel onClick={e => this.sortBy('email')}
                                active={sortBy === 'email'}
                                direction={order}/>Email</TableCell>
                        <TableCell align="right">
                            <TableSortLabel onClick={e => this.sortBy('time')}
                                active={sortBy === 'time'}
                                direction={order}/>Time</TableCell>
                        <TableCell align="right">
                            <TableSortLabel onClick={e => this.sortBy('action')}
                                active={sortBy === 'action'}
                                direction={order}/>Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map(d => (
                        <TableRow key={d.email + d.time}>
                        <TableCell component="th" scope="row">
                            {d.id}
                        </TableCell>
                        <TableCell align="right">{d.email}</TableCell>
                        <TableCell align="right">{d.time}</TableCell>
                        <TableCell align="right">{d.action}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </div>

        );
        
    }
}

export default withCookies(Audit);