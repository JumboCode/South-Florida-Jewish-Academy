import React from 'react';

// eslint-disable-next-line require-jsdoc
class Student extends React.Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    // eslint-disable-next-line react/prop-types
    const id = this.props.match.params.id;
    return (
      <div>
        id={id}
      </div>
    );
  }
}

export default Student;
