import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line require-jsdoc
class ParentDash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            student_ids: [],
        };
    }

    componentDidMount() {
        fetch('http://127.0.0.1:5000/getStudentsOfParent', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({parent_id: 19}),
        }).then((res) => res.json())
          .then((data) => {
            this.setState({student_ids: data.student_ids});
            console.log(data);
          })
          .catch(console.log);
    }


    // eslint-disable-next-line require-jsdoc
    render() {

      return (
        <h1>HELLO STUDENT</h1>

      );

    

    }
}

ParentDash.propTypes = {
  match: PropTypes.any,
};

export default ParentDash;
