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

function createData(id, time, action, email) {
    return { id, time, action, email };
};

//hello
class Audit extends React.Component{
    static propTypes = {
        users: PropTypes.any,
        data: PropTypes.any,
    };

    constructor(props) {
        super(props);
        this.state = {
            users:null,
            data:null,
        };
    }


    componentDidMount() {
        fetch('http://127.0.0.1:5000/users')
            .then((res) => res.json())
            .then((data) => {
                this.setState({users: data.users});
                this.setState({data: 
                    data.users.reduce(
                        function (acc, x) { 
                            x.actions.forEach(
                                (action) => acc.push(createData(x.user_id, action[0], action[1], x.email))); 
                                return acc;
                            }, [])});

                        // (acc, x) => x.actions.forEach(
                        //     action => acc.push(createData(x.user_id, action, x.email))), new Array(0))});
                console.log(data);
            })
            .catch(console.log);

    }  

    render(){
        const {users, data} = this.state;
        console.log(data);
        if (!users || !data) {
            return(
                <div>
                   <Header currTab='admin'/>
                   oops
                </div>
            );
        }
        
        return(
            <div>
                <Header currTab='admin'/>
            
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="right">Email</TableCell>
                        <TableCell align="right">Time</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map(d => (
                        <TableRow key={d.id}>
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
                U r in audit

            </div>

        );
        
    }
}

export default Audit;