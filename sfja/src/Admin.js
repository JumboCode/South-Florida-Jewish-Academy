import React from 'react';
import Info from './components/info';

// eslint-disable-next-line require-jsdoc
class Admin extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      name: 'Janny',
      info: [],
    };
  }
  componentDidMount() {
    fetch('http://jsonplaceholder.typicode.com/users')
        .then((res) => res.json())
        .then((data) => {
          this.setState({info: data});
          console.log(data);
        })
        .catch(console.log);
  }

  render() {
    return (
      <div>
                SFJA ADMIN
        <h1>{this.state.name}</h1>
        <Info info ={this.state.info}></Info>
      </div>);
  }
}


export default Admin;
