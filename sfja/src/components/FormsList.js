import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

class FormsList extends React.Component{
    render(){
        return(
            <React.Fragment>
            <button className="btn btn-primary pull-right" onClick={this.props.newFunc}>New Form</button>
            <ul>
                <li>FORM 1</li>
                <li>FORM 2</li>
                <li>FORM 3</li>
            </ul>
            </React.Fragment>
        );
    }
}


export default FormsList