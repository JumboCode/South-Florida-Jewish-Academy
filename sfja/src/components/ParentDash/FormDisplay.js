import React from 'react';
import PropTypes from 'prop-types';
import { Select, InputLabel, MenuItem} from '@material-ui/core';
import ReactFormGenerator from '../FormManager/FormBuilder/form';

// eslint-disable-next-line require-jsdoc
class FormDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blank_form_data : "{}",
            form_data : "{}"
        }
    }

    componentDidMount() {
      fetch('http://127.0.0.1:5000/getForm', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({form_id: this.props.form_id}),
        }).then((res) => res.json())
          .then((data) => {
            this.setState({blank_form_data: data.blank_form_data,
                           form_data: data.form_data})
            console.log(data);
          })
          .catch(console.log);
    }


    // eslint-disable-next-line require-jsdoc
    render() {
      const {form_data} = this.state;
      const {blank_form_data} = this.state;

      return (
        <ReactFormGenerator
        form_action=""
        form_method="POST"
        task_id={12} // Used to submit a hidden variable with the id to the form from the database.
        answer_data={form_data} // Answer data, only used if loading a pre-existing form with values.
        data={blank_form_data} // Question data
        />
      );
    }
}

FormDisplay.propTypes = {
  match: PropTypes.any,
};

export default FormDisplay;
