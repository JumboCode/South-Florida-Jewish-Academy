import React from 'react';

// eslint-disable-next-line require-jsdoc
class StudentDashboard extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor() {
    super(props);
    this.state = {
      form_id: [],
      firstName: 'abcd',
      lastName: '',
      loading: true,
    };
  }

  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    fetch('http://www.mocky.io/v2/5ddb085d3100000f00605f2b')
        .then((results) => results.json()).
        then((results) => {
          // eslint-disable-next-line max-len
          const {first_name: firstName, last_name: lastName} = results.student_info;
          this.setState({
            firstName: firstName,
            lastName: lastName,
          });

          this.setState({
            loading: false,
          });
        });
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {firstName, lastName, loading} = this.state;

    if (loading) {
      return (
        <div>
          loading
        </div>
      );
    }
    return (
      <div>
        {firstName} {lastName}
        <button onClick={this.componentDidMount}>CLICK ME</button>
      </div>
    );
  }
}


export default StudentDashboard;
