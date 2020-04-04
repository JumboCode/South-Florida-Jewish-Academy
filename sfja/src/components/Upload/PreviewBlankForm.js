import React from 'react';
import {Redirect} from 'react-router-dom'

import FormManager from '../FormManager/FormManager';
import { get } from '../FormManager/FormBuilder/stores/requests';
import fetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

class PreviewBlankForm extends React.Component {
    constructor(props){
        super(props);
    }
    updateName(){
        let id = this.props.parentData.id
        let name = "data goes here"
        fetch('http://localhost:5000/updateFormName/' + id +'/' + name, {
            method: 'POST',
            mode: "no-cors"
          })
        .then((res) => res.text())
        .then (res => console.log(res));
    }
    render(){
        return(
            <div>
            <button> Back</button>
            <TextField defaultValue={this.props.parentData.name}></TextField>
            <br />
            <button onClick={this.updateName()}>Change Name </button>
            <div> [Form data goes here]</div>
            </div>
        );
    }
}
export default PreviewBlankForm;