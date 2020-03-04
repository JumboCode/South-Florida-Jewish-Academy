import React from 'react';
import {List, ListItem, ListItemIcon, Checkbox, ListItemSecondaryAction, ListItemText, Button} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';

const textSize = {style: {fontSize: 15}};

class FormSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forms: [],
    };
  }


  componentDidMount() {
    fetch('http://127.0.0.1:5000/getAllForms').then((res) => res.json()).then((result) => {
      const newForms = [];
      console.log(result)
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

  formFlipper(formID){
    const oldForms = this.state.forms;
    const newForms = oldForms.map((currForm) => (currForm.id === formID ? {id: currForm.id, name: currForm.name, checked: !currForm.checked} : currForm));
    this.setState({
      forms: newForms,
    });
  }

  selectAll(theBool) {

    const oldForms = this.state.forms;
    const newForms = oldForms.map((currForm) => ({id: currForm.id, name: currForm.name, checked: theBool}));
    this.setState({
      forms: newForms,
    });

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {updateFormData} = this.props;
    updateFormData(this.state);
  }

  render() {
    const {forms} = this.state;
    return (
      <div style={{paddingTop: 30}}>
        <div style={{paddingLeft: 10}}>
          Select Forms:
          <div style={{width: 500}}>
            <List>
              <ListItem key={'select_all'} role={undefined} dense button onClick={() => {this.selectAll(!forms.every((currForm) => currForm.checked))}}>
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
                  <ListItem key={value.id} role={undefined} dense button onClick={() => {this.formFlipper(value.id)}}>
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

export default FormSelector;
