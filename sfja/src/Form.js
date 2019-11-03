import React from 'react';


// eslint-disable-next-line require-jsdoc
class Form extends React.Component {
  // eslint-disable-next-line require-jsdoc

  render() {
  	let key = this.props.match.params.key;

    return (
      <div>
      key (testing purposes): {key}
      <br></br>
      component would show here if key is verified
      </div>
    );
  }
}

export default Form;
