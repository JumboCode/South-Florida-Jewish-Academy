import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line require-jsdoc
class StudentDash extends React.Component {
    constructor(props) {
        super(props);
    }



    // eslint-disable-next-line require-jsdoc
    render() {
      const student_id = this.props.match.params.student_id;
      return (
        <h1>HELLO STUDENT {student_id}</h1>

      );

    

    }
}

StudentDash.propTypes = {
  match: PropTypes.any,
};

export default StudentDash;
