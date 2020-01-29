import React from 'react';

// eslint-disable-next-line require-jsdoc
class StudentDashboard extends React.Component {
  // eslint-disable-next-line require-jsdoc

  constructor() {
    super()
    this.state = {
      form_id: [],
      firstName: 'abcd',
      lastName: '',
      loading: true
    }
  }

  componentDidMount() {
      fetch('http://www.mocky.io/v2/5ddb085d3100000f00605f2b')
        .then(results => results.json()).
        then(results => {
          const {first_name, last_name} = results.student_info
          this.setState({
            firstName: first_name,
            lastName: last_name
          })

          this.setState({
            loading: false
          })

        })
  }

  render() {
    const {firstName, lastName, loading} = this.state;

    if (loading)
      return (
        <div>
          loading
        </div>
        )
    return (
      <div>
      {firstName} {lastName}
      <button onClick={this.componentDidMount}>CLICK ME</button>
      </div>
    );
  }
}


export default StudentDashboard;
