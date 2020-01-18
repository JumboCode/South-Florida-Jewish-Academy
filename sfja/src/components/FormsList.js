import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// eslint-disable-next-line require-jsdoc
class FormsList extends React.Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <React.Fragment>
        <button className="btn btn-primary pull-right"
          // eslint-disable-next-line react/prop-types
          onClick={this.props.newFunc}>New Form</button>
        <ul>
          <li>FORM 1</li>
          <li>FORM 2</li>
          <li>FORM 3</li>
        </ul>
      </React.Fragment>
    );
  }
}


export default FormsList;
