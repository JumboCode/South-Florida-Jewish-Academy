import React from 'react';
import FormManager from '../FormManager/FormManager';
import { get } from '../FormManager/FormBuilder/stores/requests';
import fetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

class PreviewBlankForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            createForm: false,
            currentForm: null,
            formsList: null,
            somethingDeleted: false,
            viewForm: false
          };
    }
    render(){
        return(
            <div>
            <TextField defaultValue={this.props.parentData.name}></TextField>
            <br />
            <button>Change Name</button>
            <div> [Form data goes here]</div>
            </div>
        );
    }
}
export default PreviewBlankForm;