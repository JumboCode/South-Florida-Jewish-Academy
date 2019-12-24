import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line require-jsdoc
class Form extends React.Component {
  // eslint-disable-next-line require-jsdoc
  postKey = (key) => {
    const body = {
      key: key,
    };
    fetch('http://127.0.0.1:5000/checkKey', {method: 'POST', body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      }})
        .then((response) => response.status);

    return true;
  };


  // eslint-disable-next-line require-jsdoc
  render() {
    const key = this.props.match.params.key;

    return (
      <div>
      key (testing purposes): {key}
        <br/>
        <button onClick={this.postKey(key)}> CHECK </button>
      </div>
    );
  }
}

Form.propTypes = {
  match: PropTypes.any,
};

export default Form;
