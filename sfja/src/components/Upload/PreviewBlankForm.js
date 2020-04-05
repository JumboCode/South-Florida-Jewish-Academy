import React from 'react';

import {withRouter} from 'react-router-dom';

import FormManager from '../FormManager/FormManager';
import { get } from '../FormManager/FormBuilder/stores/requests';
import fetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

class PreviewBlankForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            newName: ''
        }
    }
    updateName(){
        console.log("about to fetch");
        let id = this.props.parentData.id;
        let name = this.state.value;
        
        fetch('http://localhost:5000/updateFormName/' + id +'/' + name, {
            method: 'POST',
            mode: "no-cors"
          })
        .then((res) => res.text())
        .then (res => console.log(res));
    }
    goBack(){
        this.props.history.goBack();
    }
    render(){
        return(
            <div>
            <button onClick={() => this.goBack()}> Back</button>
            <TextField onChange={(e) => {this.setState({value: e.target.newName})}} id="name-field" defaultValue={this.props.parentData.name}></TextField>
            <br />
            <button onClick={() => this.updateName()}>Change Name</button>
            <div> [Form data goes here]</div>
            </div>
        );
    }
}
export default withRouter(PreviewBlankForm);