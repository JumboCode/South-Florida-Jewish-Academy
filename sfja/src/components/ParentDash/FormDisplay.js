import React from 'react';
import PropTypes from 'prop-types';
import ReactFormGenerator from '../FormManager/FormBuilder/form';

// eslint-disable-next-line require-jsdoc
class FormDisplay extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      currForm: this.props.formId,
      blankFormData: '{}',
      formData: '{}',
    };
  }
  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    this.refreshFormData();
  }

  refreshFormData(){
    fetch('http://127.0.0.1:5000/getForm', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      // eslint-disable-next-line react/prop-types
      body: JSON.stringify({form_id: this.state.currForm}),
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
    const {currForm, formData, blankFormData} = this.state;
    this.refreshFormData();

    return (
      <div>
        <ReactFormGenerator
          form_action=""
          form_method="POST"
          task_id={12}
          answer_data={JSON.parse(formData)}
          data={JSON.parse(blankFormData)} // Question data
        />
      </div>
    );
  }
}

FormDisplay.propTypes = {
  match: PropTypes.any,
};

export default FormDisplay;
