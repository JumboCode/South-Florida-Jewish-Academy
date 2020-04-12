import React from 'react';
import fetch from 'isomorphic-fetch';
import TextField from '@material-ui/core/TextField';
import PropTypes, {instanceOf} from 'prop-types';
import {Button} from '@material-ui/core';
import {Cookies, withCookies} from 'react-cookie';

// eslint-disable-next-line require-jsdoc
class PreviewBlankForm extends React.Component {
    static propTypes = {
      formsList: PropTypes.any,
      parentData: PropTypes.any,
      setViewForm: PropTypes.func,
      cookies: instanceOf(Cookies).isRequired,
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
      const {cookies} = this.props;

      const body = {
        form_id: id,
        form_name: name,
        token: cookies.get('token'),
      };
      fetch('http://127.0.0.1:5000/updateFormName', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      });
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
            this.setState({value: e.target.value});
          }} id="name-field" defaultValue={this.props.parentData.name}>
          </TextField>
          <br />
          <button onClick={() => this.updateName()}>Change Name</button>
          <div> [Form data goes here]</div>
        </div>
      );
    }
}
export default withCookies(PreviewBlankForm);
