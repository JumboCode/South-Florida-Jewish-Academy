import React from 'react';
import AllCards from './components/AllCards';

// eslint-disable-next-line require-jsdoc
class Admin extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      name: 'Janny',
      students: [],
    };
  }
  componentDidMount() {
    fetch('http://127.0.0.1:5000/students')
        .then((res) => res.json())
        .then((data) => {
          this.setState({students: data.students});
          console.log(data);
        })
        .catch(console.log);
  }

  render() {
    return (
      <div>
                SFJA ADMIN
        <h1>{this.state.name}</h1>
        <AllCards info ={this.state.students}></AllCards>
      </div>);
  }
}




export default Admin;
