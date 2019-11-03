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
    fetch('http://www.mocky.io/v2/5dbf5516330000f47aa0e593')
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
