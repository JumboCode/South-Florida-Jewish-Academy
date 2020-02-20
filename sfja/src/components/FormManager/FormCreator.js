import React from 'react';
import Demobar from './DemoBar';
import FormBuilder from './FormBuilder/index';

import './css/bootstrap.min.css';
import './css/font-awesome.min.css';
require('./scss/application.scss');

class FormCreator extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            currFormBuilt: null
        }
    }


    updateCurrFormBuilt(newForm){
        this.setState({currFormBuilt: newForm})
    }


    render(){

        return(
            <div>
                <div>
                    Build form:
                    <button onClick={() => alert('submit!')}>submit</button>
                </div>
                <Demobar updateCurrFormBuilt={this.updateCurrFormBuilt.bind(this)}/>
                <FormBuilder.ReactFormBuilder/>
            </div>

        )

    }
}

export default FormCreator;