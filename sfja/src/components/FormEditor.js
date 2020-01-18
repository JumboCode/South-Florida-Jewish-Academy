import React from 'react'
import FormBuilder from 'react-form-builder2';
import DemoBar from './DemoBar';

class FormEditor extends React.Component{
    
    render(){
        return(
            <React.Fragment>
                <DemoBar backFunc={this.props.backFunc}/>
                {/* Font Awesome icons don't appear. */}
                <FormBuilder.ReactFormBuilder/>
            </React.Fragment>
        );
    }
}


export default FormEditor