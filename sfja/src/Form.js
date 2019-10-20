import React from 'react';


// eslint-disable-next-line require-jsdoc
class Form extends React.Component {
  // eslint-disable-next-line require-jsdoc

  /*constructor(props) {
  	super(props);
  }*/


  render() {
  	let userID = this.props.match.params.userID;
  	console.log("Hello");
  	console.log(userID);

    return (
      <div>
        form! - ID:{userID}
      </div>
    );
  }
}

export default Form;
