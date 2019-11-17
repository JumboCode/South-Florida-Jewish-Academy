import React from 'react';

// eslint-disable-next-line require-jsdoc
class StudentDashboard extends React.Component {
  // eslint-disable-next-line require-jsdoc
    componentDidMount() {
        fetch("http://www.mocky.io/v2/5dd1c979320000600006fb0b")
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                items: result.items
              });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
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
