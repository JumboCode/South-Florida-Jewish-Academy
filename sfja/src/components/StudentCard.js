import React from 'react';


// eslint-disable-next-line require-jsdoc
class StudentCard extends React.Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div className="card" key={this.props.email}>
        <p>{this.props.name}</p>
        <p>{this.props.email}</p>
        <p>{this.props.id}</p>
      </div>
    );
  }
}

export default StudentCard;
