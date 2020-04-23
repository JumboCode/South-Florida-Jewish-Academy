import React from 'react';
import {TextField} from '@material-ui/core';
import ParentInfo from './ParentInfo';
import {Button} from '@material-ui/core';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import PropTypes from 'prop-types';

const textSize = {
  style: {fontSize: 15},
  autoComplete: 'new-password',
  form: {
    autoComplete: 'off',
  },
};

const textWidth = {
  padding: 10,
  marginBottom: 10,
};

// eslint-disable-next-line require-jsdoc
function blankStateExceptSubmitTime(submitTime) {
  return {
    submitTime: submitTime,
    firstNameStudent: '',
    middleNameStudent: '',
    lastNameStudent: '',
    dob: new Date().toLocaleDateString(),
    gradeStudent: '',
    viewParents: [0],
    parents: [{
      num: 0,
      firstName: '',
      email: '',
      lastName: '',
    },
    {
      num: 1,
      firstName: '',
      email: '',
      lastName: '',
    },
    {
      num: 2,
      firstName: '',
      email: '',
      lastName: '',
    },
    {
      num: 3,
      firstName: '',
      email: '',
      lastName: '',
    }],
  };
}

// eslint-disable-next-line require-jsdoc
class Input extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = blankStateExceptSubmitTime(this.props.submitTime);
  }

  // eslint-disable-next-line require-jsdoc
  addParentData(num, first, email, last) {
    const {parents} = this.state;
    parents[num] = {
      num: num,
      firstName: first,
      email: email,
      lastName: last,
    };

    this.setState({
      parents: parents,
    });
  }

  // eslint-disable-next-line require-jsdoc
  addViewParents() {
    const {viewParents} = this.state;
    if (viewParents.length >= 4) {
      return;
    }
    viewParents.push(viewParents.length);
    this.setState({
      viewParents: viewParents,
    });
  }

  // pops last element from 'view' list
  // clears all data in said element
  // eslint-disable-next-line require-jsdoc
  removeViewParents() {
    const {viewParents} = this.state;
    if (viewParents.length === 1) {
      return;
    }
    viewParents.pop();

    // clear data
    const oldParents = this.state.parents;
    oldParents[viewParents.length].firstName = '';
    oldParents[viewParents.length].firstNameError = false;
    oldParents[viewParents.length].lastName = '';
    oldParents[viewParents.length].lastNameError = false;
    oldParents[viewParents.length].email = '';
    oldParents[viewParents.length].emailError = false;

    this.setState({
      viewParents: viewParents,
      parents: oldParents,
    });
  }

  // eslint-disable-next-line require-jsdoc
  componentDidUpdate(prevProps, prevState, snapshot) {
    // eslint-disable-next-line react/prop-types
    const {updateInputData} = this.props;
    updateInputData(this.state);

    if (prevProps.submitTime !== this.props.submitTime) {
      this.setState(blankStateExceptSubmitTime(this.props.submitTime));
      return true;
    } else {
      return false;
    }
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    // eslint-disable-next-line max-len
    const {parents, viewParents, firstNameStudent, middleNameStudent, lastNameStudent, dob, gradeStudent} = this.state;
    return (
      <div>
        <div style={{padding: 10}}>
          Enter the student&#39;s information:
        </div>
        <div>
          {/* eslint-disable-next-line max-len */}
          <TextField error={firstNameStudent === ''} onChange={(ev) => this.setState({firstNameStudent: ev.target.value})} value={firstNameStudent} style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="First Name" required={true}/>
          {/* eslint-disable-next-line max-len */}
          <TextField error={false} onChange={(ev) => this.setState({middleNameStudent: ev.target.value})} value={middleNameStudent} style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Middle Name" required={false}/>
          {/* eslint-disable-next-line max-len */}
          <TextField error={lastNameStudent === ''} onChange={(ev) => this.setState({lastNameStudent: ev.target.value})} value={lastNameStudent} style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Last Name" required={true}/>
        </div>
        <div>
          {/* eslint-disable-next-line max-len */}
          <TextField error={gradeStudent === ''} onChange={(ev) => this.setState({gradeStudent: ev.target.value})} value={gradeStudent} style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Grade" required={true}/>
          <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <KeyboardDatePicker
              error={dob === null}
              required={true}
              inputProps={textSize}
              style={{marginLeft: 10, width: 175}}
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Birthday"
              value={dob}
              onChange={(ev) => {
                this.setState({dob: ev ? ev.toLocaleDateString() : null});
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
        {parents.filter((x) => viewParents.includes(x.num)).map((x) =>
          <div key={x.num}>
            <ParentInfo
              num={x.num}
              firstName={x.firstName}
              email={x.email}
              lastName={x.lastName}
              addParentData={this.addParentData.bind(this)}/>
          </div>)}
        <div style={{margin: 10}}>
          {/* eslint-disable-next-line max-len */}
          <Button style={{marginRight: 10}} variant='outlined' onClick={()=> this.addViewParents()} disabled={viewParents.length === 4}>add Parent</Button>
          {/* eslint-disable-next-line max-len */}
          <Button variant='outlined' onClick={()=> this.removeViewParents()} disabled={viewParents.length === 1} >remove Parent</Button>
        </div>
      </div>
    );
  }
}

Input.propTypes = {
  submitTime: PropTypes.any,
};

export default Input;
