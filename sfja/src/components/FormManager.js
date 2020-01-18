import React from 'react';
import 'react-form-builder2/dist/app.css';
import FormEditor from './FormEditor.js';
import FormsList from './FormsList.js';

// eslint-disable-next-line require-jsdoc
class FormManager extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor() {
    super();
    this.state = {
      comp: 'forms',
    };
    this.changeState = this.changeState.bind(this);
  }

  // eslint-disable-next-line require-jsdoc
  changeState() {
    this.setState({comp: this.state.comp === 'editor' ? 'forms' : 'editor'});
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <React.Fragment>
        <div>
          {/* eslint-disable-next-line max-len */}
          {this.state.comp === 'forms' ? <FormsList newFunc={this.changeState}/> : null}
          {/* eslint-disable-next-line max-len */}
          {this.state.comp === 'editor' ? <FormEditor backFunc={this.changeState}/> : null}
        </div>
      </React.Fragment>

    );
  }
}


export default FormManager;
