import React from 'react';
import 'react-form-builder2/dist/app.css';
import FormEditor from './FormEditor.js';
import FormsList from './FormsList.js';


class FormManager extends React.Component {
  constructor() {
    super();
    this.state = {
      comp: 'forms',
    };
    this.changeState = this.changeState.bind(this);
  }


  changeState() {
    this.setState({comp: this.state.comp === 'editor' ? 'forms' : 'editor'});
  }

  render() {
    return (
      <React.Fragment>
        <div>
          {this.state.comp === 'forms' ? <FormsList newFunc={this.changeState}/> : null}
          {this.state.comp === 'editor' ? <FormEditor backFunc={this.changeState}/> : null}
        </div>
      </React.Fragment>

    );
  }
}


export default FormManager;
