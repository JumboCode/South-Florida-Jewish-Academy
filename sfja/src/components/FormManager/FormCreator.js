import React from 'react';
import Demobar from './DemoBar';
import FormBuilder from './FormBuilder/index';

import './css/bootstrap.min.css';
import './css/font-awesome.min.css';
require('./scss/application.scss');

// eslint-disable-next-line require-jsdoc
class FormCreator extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);

    this.state = {
      currFormBuilt: null,
    };
  }

  // eslint-disable-next-line require-jsdoc
  updateCurrFormBuilt(newForm) {
    this.setState({currFormBuilt: newForm});
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div>
        <div>
                    Build form:
          <button onClick={() => alert('submit!')}>submit</button>
        </div>
        <Demobar updateCurrFormBuilt={this.updateCurrFormBuilt.bind(this)}/>
        <FormBuilder.ReactFormBuilder/>
      </div>

    );
  }
}

export default FormCreator;
