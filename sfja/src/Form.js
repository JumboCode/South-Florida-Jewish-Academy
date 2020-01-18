import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line require-jsdoc
class Form extends React.Component {
  // eslint-disable-next-line require-jsdoc
<<<<<<< HEAD
  postKey = (key) => {
=======
  constructor(props) {
    super(props)
    this.state = {
      

    };


  }
  postKey = () => {
    const key = this.props.match.params.key;
>>>>>>> 5c8d5c23001b5b902e019154ef891dae5c3198c8
    const body = {
      key: key,
    };
<<<<<<< HEAD
    fetch('http://127.0.0.1:5000/checkKey', {method: 'POST', body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      }})
        .then((response) => response.status);

    return true;
  };
=======
    fetch('http://127.0.0.1:5000/checkKey', {method:'POST', body:JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }})
    .then(response => response.status) 
    
    return true
  }; 
  

>>>>>>> 5c8d5c23001b5b902e019154ef891dae5c3198c8


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
