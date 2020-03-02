import React from 'react';
import {TextField} from '@material-ui/core';
import ParentInfo from './ParentInfo';
import {Button} from '@material-ui/core';

const textSize = {style: {fontSize: 15}};
const textWidth = {
  padding: 10,
};

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  render() {
    const {parents, viewParents} = this.state;
    console.log(parents);
    return (
      <div>
        <div style={{paddingLeft: 10}}>
          Student Info:
        </div>
        <div>
          <TextField style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="First Name" required={true}/>
          <TextField style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Middle Name" required={true}/>
          <TextField style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Last Name" required={true}/>
        </div>
        <div>
          <TextField style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Grade" required={true}/>
          <TextField style={textWidth} inputProps={textSize} variant='outlined' id="standard-basic" label="Age" required={true}/>
        </div>
        {parents.filter((x) => viewParents.includes(x.num)).map((x) =>
          <div key={x}>
            <ParentInfo
              num={x.num}
              firstName={x.firstName}
              email={x.email}
              lastName={x.lastName}
              addParentData={this.addParentData.bind(this)}/>
          </div>)}
        <div style={{paddingLeft: 10}}>
          <Button onClick={()=> this.addViewParents()} disabled={viewParents.length === 4}>add Parent</Button>
          <Button onClick={()=> this.removeViewParents()} disabled={viewParents.length === 1} >remove Parent</Button>
        </div>
      </div>
    );
  }
}

export default Input;
