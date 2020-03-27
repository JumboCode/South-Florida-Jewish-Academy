import React from 'react';
import {List, ListItem, ListItemIcon, Checkbox} from '@material-ui/core';
import PropTypes from 'prop-types';

// eslint-disable-next-line require-jsdoc
class FormSelector extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      submitTime: this.props.submitTime,
      forms: [],
    };
  }

  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    fetch('http://127.0.0.1:5000/getAllForms').then((res) => res.json()).then((result) => {
      const newForms = [];
      result.forms.map((currForm) => {
        newForms.push(
            {
              id: currForm.id,
              name: currForm.name,
              checked: false,
            },
        );
      });
      this.setState({
        forms: newForms,
      });
    });
  }

  // eslint-disable-next-line require-jsdoc
  formFlipper(formID) {
    const oldForms = this.state.forms;
    // eslint-disable-next-line max-len
    const newForms = oldForms.map((currForm) => (currForm.id === formID ? {id: currForm.id, name: currForm.name, checked: !currForm.checked} : currForm));
    this.setState({
      forms: newForms,
    });
  }

  // eslint-disable-next-line require-jsdoc
  selectAll(theBool) {
    const oldForms = this.state.forms;
    // eslint-disable-next-line max-len
    const newForms = oldForms.map((currForm) => ({id: currForm.id, name: currForm.name, checked: theBool}));
    this.setState({
      forms: newForms,
    });
  }

  // eslint-disable-next-line require-jsdoc
  componentDidUpdate(prevProps, prevState, snapshot) {
    // eslint-disable-next-line react/prop-types
    const {updateFormData} = this.props;
    const {forms} = this.state;
    updateFormData(this.state);
    if (prevProps.submitTime !== this.props.submitTime) {
      this.setState({
        submitTime: this.props.submitTime,
        // eslint-disable-next-line max-len
        forms: forms.map((currForm) => ({id: currForm.id, name: currForm.name, checked: false})),
      });
    }
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {forms} = this.state;
    return (
      <div style={{paddingTop: 10}}>
        <div style={{paddingLeft: 10}}>
          Select Forms:
          <div style={{width: 500}}>
            <List>
              {/* eslint-disable-next-line max-len */}
              <ListItem key={'select_all'} role={undefined} dense button onClick={() => {
                this.selectAll(!forms.every((currForm) => currForm.checked));
              }}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={forms.every((currForm) => currForm.checked)}
                    tabIndex={-1}
                    disableRipple
                    // inputProps={{'aria-labelledby': labelId}}
                  />
                </ListItemIcon>
                Select All
              </ListItem>
              {forms.map((value) => {
                const labelId = `checkbox-list-label-${value}`;
                return (
                  // eslint-disable-next-line max-len
                  <ListItem key={value.id} role={undefined} dense button onClick={() => {
                    this.formFlipper(value.id);
                  }}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={value.checked}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{'aria-labelledby': labelId}}
                      />
                    </ListItemIcon>
                    {value.name}
                  </ListItem>
                );
              })}
            </List>
          </div>
        </div>
      </div>
    );
  }
}

FormSelector.propTypes = {
  submitTime: PropTypes.any,
};

export default FormSelector;
