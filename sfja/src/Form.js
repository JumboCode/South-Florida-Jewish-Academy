import React from 'react';


// eslint-disable-next-line require-jsdoc
class Form extends React.Component {
  // eslint-disable-next-line require-jsdoc
  postKey = () => {
    const key = this.props.match.params.key;
    const body = {
      key: key
    };
    fetch('http://127.0.0.1:5000/checkKey', {method:'POST', body:JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }})
    .then(response => response.status) 
    
    return true
  }; 


  render() {
  	let key = this.props.match.params.key;

    return (
      <div>
      key (testing purposes): {key}
      <br></br>
      <button onClick={this.postKey}> CHECK </button>
      </div>
    );
  }
}

export default Form;
