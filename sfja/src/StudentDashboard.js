import React from 'react';

// eslint-disable-next-line require-jsdoc
class StudentDashboard extends React.Component {
  // eslint-disable-next-line require-jsdoc


    componentDidMount() {
    fetch('http://www.mocky.io/v2/5dd1c979320000600006fb0b')
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }

  render() {

    return (
      <div>
      //FormA Data (testing purposes): {res}
      <br></br>
      <button onClick={this.componentDidMount}> GET DATA </button>
      </div>
    );
  }
}


export default StudentDashboard;
