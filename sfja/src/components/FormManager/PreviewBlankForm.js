import React from 'react';
import ReactFormGenerator from './BlankFormBuilder/FormBuilder/form';
import fetch from 'isomorphic-fetch';
import TextField from '@material-ui/core/TextField';
import PropTypes, {instanceOf} from 'prop-types';
import {Button} from '@material-ui/core';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from '../../utils/Env';

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
      };
      fetch(apiUrl() + '/updateFormName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('token')}`,
        },
        body: JSON.stringify(body),
      });
    }

    // eslint-disable-next-line require-jsdoc
    render() {
      const {setViewForm} = this.props;
      return (
        <div style={{padding: 20}}>
          <Button
            onClick={() => setViewForm(false)}
            variant='contained'
          >
            Back
          </Button>
          <br/>
          <div>
            <TextField onChange={(e) => {
              this.setState({value: e.target.value});
            }} id="name-field" 
              defaultValue={this.props.parentData.name}
              style={{paddingRight: 20}}
              >
            </TextField>
            <Button 
              onClick={() => this.updateName()}
              variant='contained'>
                Change Name
            </Button>
          </div>
          <br />
          <div> 
            {/* <ReactFormGenerator></ReactFormGenerator> */}
          </div>
        </div>
      );
    }
}
export default withCookies(PreviewBlankForm);
