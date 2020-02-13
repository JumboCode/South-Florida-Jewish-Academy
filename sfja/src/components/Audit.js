import React from 'react';
import PropTypes from 'prop-types';

//hello
class Audit extends React.Component{
    static propTypes = {
        users: PropTypes.any,
    };

    constructor(props) {
        super(props);
        this.state = {
            users:null,
        };
    }

    componentDidMount() {
        fetch('http://127.0.0.1:5000/users')
            .then((res) => res.json())
            .then((data) => {
                this.setState({users: data.users});
                console.log(data);
            })
            .catch(console.log);
    }

    render(){
        const {users} = this.state;
        if (!users) {
            return(
                <div>
                   U r in audit
                </div>
            );
        }
    }
}

export default Audit;