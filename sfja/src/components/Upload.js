import React from 'react';
import Header from './Header';
import FormManager from './FormManager/FormManager';
import { get } from './FormManager/FormBuilder/stores/requests';
import fetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';


// eslint-disable-next-line require-jsdoc
class Upload extends React.Component {
  static propTypes = {
    formsList: PropTypes.any,
  };
  constructor(props) {
    super(props);
    this.state = {
      createForm: false,
      currentForm: false,
      formsList: null
    };
  }
  componentDidMount(){
    fetch('http://localhost:5000/forms')
    .then(response => response.json())
    .then((data) => {
      this.setState({ formsList: data.forms});
      console.log(data);
    })
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {createForm, currentForm, formsList} = this.state;

    if (formsList === null){
      return(
        <div>
          <Header currTab='upload'/>
          loading...
        </div>
      )
    }
    console.log(formsList);
    let result = Object.values(formsList);
    console.log(result); 
    console.log(typeof result);
    
    return (
      <div>
        <Header currTab='upload'/>
        {createForm ? <FormManager/>: 
          <div>
            <button onClick= {() => this.setState({createForm: true})}> Add Form </button>
            <div> 
              {/* {result.map(form => <ul>{form}</ul>)} */}
              {result}
            </div>
          </div>
        }

      </div>
    );
  }
}

export default Upload;
