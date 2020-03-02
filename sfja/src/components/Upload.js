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
      formsList: null
    };
  }
  componentDidMount(){
    fetch('http://localhost:5000/forms')
    .then(response => response.json())
    .then((response) => {
      this.setState({ formsList: response});
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
/*     var res = Object.keys(formsList[0]).map(function(name){
      var obj = {};
      obj[name] = formsList[name];
      return obj;
    });  */
    //console.log(res[0]);
/*     var res = (Object.values(formsList));
    res = res[0];
    console.log(res); */
    return (
      <div>
        <Header currTab='upload'/>
        {createForm ? <FormManager/>: 
          <div>
            <button onClick= {() => this.setState({createForm: true})}> Add Form </button>
            <div> 
              {res.map(form => <ul>{form}</ul>)}
            </div>
          </div>
        }

      </div>
    );
  }
}

export default Upload;
