import React from 'react';
import PropTypes from 'prop-types';
import apiUrl from '../../utils/Env';
// eslint-disable-next-line max-len
import ReactFormGenerator from '../FormManager/BlankFormBuilder/FormBuilder/form';

// eslint-disable-next-line require-jsdoc
class FormDisplay extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      blankFormData: '{}',
      formData: '{}',
    };
  }
  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    fetch(apiUrl() + '/getForm', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      // eslint-disable-next-line react/prop-types
      body: JSON.stringify({form_id: this.props.formId}),
    }).then((res) => res.json())
        .then((data) => {
          this.setState({blankFormData: data.blank_form_data,
            formData: data.form_data});
          console.log(data);
        })
        .catch(console.log);
  }


  // eslint-disable-next-line require-jsdoc
  render() {
    const {formData} = this.state;
    const {blankFormData} = this.state;

    return (
      <ReactFormGenerator
        form_action=""
        form_method="POST"
        task_id={12}
        answer_data={formData}
        data={blankFormData} // Question data
      />
    );
  }
}

FormDisplay.propTypes = {
  match: PropTypes.any,
};

export default FormDisplay;
