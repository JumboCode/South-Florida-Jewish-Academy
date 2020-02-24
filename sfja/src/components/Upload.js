import React from 'react';
import Header from './Header';
import FormManager from './FormManager/FormManager';


// eslint-disable-next-line require-jsdoc
class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createForm: false,
      currentForm: false,
      formsList: [],
    };
  }
//TODO function to load in all forms to formsList

  // eslint-disable-next-line require-jsdoc
  render() {
    const {createForm} = this.state;
    const {currentForm} = this.state;
    return (
      <div>
        <Header currTab='upload'/>
        {createForm ? <FormManager/>: 
          <div>
            <button onClick= {() => this.setState({createForm: true})}> Add Form </button>
            <ul>
              <div> I'm a form </div>
            </ul>
          </div>
        }

      </div>
    );
  }
}

export default Upload;
