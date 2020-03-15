import React from 'react';
import {TextField} from '@material-ui/core';
import ParentInfo from './ParentInfo';
import {Button} from '@material-ui/core';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const textSize = {style: {fontSize: 15}};
const textWidth = {
  padding: 10,
  marginTop: 10,
};

// eslint-disable-next-line require-jsdoc
class Input extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      firstNameStudent: '',
      middleNameStudent: '',
      lastNameStudent: '',
      dob: new Date(),
      gradeStudent: '',
      viewParents: [0],
      parents: [{
        num: 0,
        firstName: null,
        email: null,
        lastName: null,
      },
      {
        num: 1,
        firstName: null,
        email: null,
        lastName: null,
      },
      {
        num: 2,
        firstName: null,
        email: null,
        lastName: null,
      },
      {
        num: 3,
        firstName: null,
        email: null,
        lastName: null,
      }],
    };
  }

  // eslint-disable-next-line require-jsdoc
  addParentData(num, first, email, last) {
    console.log(num, first, email, last);
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

  // eslint-disable-next-line require-jsdoc
  removeViewParents() {
    const {viewParents} = this.state;
    if (viewParents.length == 1) {
      return;
    }
    viewParents.pop();
    this.setState({
      viewParents: viewParents,
    });
  }

  // eslint-disable-next-line require-jsdoc
  componentDidUpdate(prevProps, prevState, snapshot) {
    // eslint-disable-next-line react/prop-types
    const {updateInputData} = this.props;
    updateInputData(this.state);
    console.log('here');
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    // eslint-disable-next-line max-len
    const {parents, viewParents, firstNameStudent, middleNameStudent, lastNameStudent, dob, gradeStudent} = this.state;
    return (
      <div>
        <div style={{paddingLeft: 10}}>
          Student Info:
        </div>
        <div>
          {/* eslint-disable-next-line max-len */}
          <TextField onChange={(ev) => this.setState({firstNameStudent: ev.target.value})} value={firstNameStudent} style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="First Name" required={true}/>
          {/* eslint-disable-next-line max-len */}
          <TextField onChange={(ev) => this.setState({middleNameStudent: ev.target.value})} value={middleNameStudent} style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Middle Name" required={true}/>
          {/* eslint-disable-next-line max-len */}
          <TextField onChange={(ev) => this.setState({lastNameStudent: ev.target.value})} value={lastNameStudent} style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Last Name" required={true}/>
        </div>
        <div>
          {/* eslint-disable-next-line max-len */}
          <TextField onChange={(ev) => this.setState({gradeStudent: ev.target.value})} value={gradeStudent} style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Grade" required={true}/>
          <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <KeyboardDatePicker
              inputProps={textSize}
              style={{marginLeft: 10, width: 175}}
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date picker inline"
              value={dob}
              onChange={(ev) => {
                this.setState({dob: ev});
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
        <div style={{paddingLeft: 10}}>
          {/* eslint-disable-next-line max-len */}
          <Button onClick={()=> this.addViewParents()} disabled={viewParents.length === 4}>add Parent</Button>
          {/* eslint-disable-next-line max-len */}
          <Button onClick={()=> this.removeViewParents()} disabled={viewParents.length === 1} >remove Parent</Button>
        </div>
      </div>
    );
  }
}

export default Input;
