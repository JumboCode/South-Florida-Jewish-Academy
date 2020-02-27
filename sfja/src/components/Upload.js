import React from 'react';
import Header from './Header';
import FormManager from './FormManager/FormManager';
import { get } from './FormManager/FormBuilder/stores/requests';
import fetch from 'isomorphic-fetch';


// eslint-disable-next-line require-jsdoc
class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createForm: false,
      currentForm: false,
      formsList:
        fetch('http://localhost:5000/forms', {
          method: 'GET',
          mode: 'no-cors',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            OPTIONS: '',
          }
        })//.then(response => response.json())
    };
  }
  componentDidMount(){
    ;
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {createForm} = this.state;
    const {currentForm} = this.state;
    const formsList = this.state.formsList;
    return (
      <div>
        <Header currTab='upload'/>
        {createForm ? <FormManager/>: 
          <div>
            <button onClick= {() => this.setState({createForm: true})}> Add Form </button>
            <div> 
              {formsList.map(form => <ul>{form}</ul>)}
            </div>
          </div>
        }

      </div>
    );
  }
}

export default Upload;
