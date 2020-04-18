import React from 'react';
import store from './FormBuilder/stores/store';
import {post} from './FormBuilder/stores/requests';
import {instanceOf} from 'prop-types';
import {Button, TextField} from '@material-ui/core';
import {Cookies, withCookies} from 'react-cookie';
import PropTypes from 'prop-types';
import apiUrl from '../../../utils/Env';

// eslint-disable-next-line require-jsdoc
class Demobar extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
    setOpenSuccessSnackBar: PropTypes.any,
  };

  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      formName: '',
      showSuccess: false,
    };

    const update = this._onChange.bind(this);
    this._onSubmit = this._onSubmit.bind(this);

    // eslint-disable-next-line arrow-parens
    store.subscribe(state => (update(state.data)));
  }

  // eslint-disable-next-line require-jsdoc
  _onChange(data) {
    this.setState({
      data,
    });
  }

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line require-jsdoc
  _onSubmit(data, formName) {
    const {cookies, setOpenSuccessSnackBar} = this.props;
    post(apiUrl() + '/newform', data, cookies.get('token'), formName);
    this.setState({formName: '', data: []});
    setOpenSuccessSnackBar(true);
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {formName, data} = this.state;
    return (
      <div className="clearfix" style={{margin: '10px', width: '70%'}}>
        {/* eslint-disable-next-line max-len */}
        <TextField error={formName === ''} onChange={(ev) => this.setState({formName: ev.target.value})} value={formName} variant='outlined' id="standard-basic" label="Form Name" required={true}/>
        <Button className="btn btn-primary pull-right"
          style={{marginRight: '10px', marginTop: 10}}
          variant='contained'
          onClick={() => this._onSubmit(this.state.data, formName)}
          disabled={formName === '' || data.length === 0}
        >
          Add Form
        </Button>
      </div>
    );
  }
}

export default withCookies(Demobar);
