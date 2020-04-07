import React from 'react';
import fetch from 'isomorphic-fetch';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import {Button} from '@material-ui/core';

// eslint-disable-next-line require-jsdoc
class PreviewBlankForm extends React.Component {
    static propTypes = {
      formsList: PropTypes.any,
      parentData: PropTypes.any,
      setViewForm: PropTypes.func,
    };
    // eslint-disable-next-line require-jsdoc
    constructor(props) {
      super(props);
      this.state = {
        newName: '',
      };
    }
    // eslint-disable-next-line require-jsdoc
    updateName() {
      const id = this.props.parentData.id;
      const name = this.state.value;

      fetch('http://localhost:5000/updateFormName/' + id +'/' + name, {
        method: 'POST',
        mode: 'no-cors',
      })
          .then((res) => res.text())
          .then((res) => console.log(res));
    }

    // eslint-disable-next-line require-jsdoc
    render() {
      const {setViewForm} = this.props;
      return (
        <div>
          <Button
            onClick={() => setViewForm(false)}
            variant='contained'
          >
            Back
          </Button>
          <br/>
          <TextField onChange={(e) => {
            this.setState({value: e.target.newName});
          }} id="name-field" defaultValue={this.props.parentData.name}>
          </TextField>
          <br />
          <button onClick={() => this.updateName()}>Change Name</button>
          <div> [Form data goes here]</div>
        </div>
      );
    }
}
export default PreviewBlankForm;