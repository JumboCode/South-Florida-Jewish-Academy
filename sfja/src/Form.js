import React from 'react';


// eslint-disable-next-line require-jsdoc
class Form extends React.Component {
  // eslint-disable-next-line require-jsdoc

  /*constructor(props) {
  	super(props);
  }*/


  render() {
  	let studentID = this.props.match.params.studentID;
    let formNum = this.props.match.params.formNum;
  	console.log("Hello");
  	console.log(this);
    console.log(formNum);

    return (
      <div>
        form! - ID: {studentID}, {formNum}
      </div>
    );
  }
}

export default Form;
