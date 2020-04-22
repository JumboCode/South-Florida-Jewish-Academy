/* eslint-disable max-len */

import React from 'react';
import {ReactFormGenerator, ElementStore} from 'react-form-builder2';
import {Button, TextField} from '@material-ui/core';
import apiUrl from '../../../utils/Env';
import {Cookies, withCookies} from 'react-cookie';

function post(url, data, token, formName) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: data,
      formName: formName,
    }),
    // eslint-disable-next-line arrow-parens
  }).then(response => response);
}

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      previewVisible: false,
      shortPreviewVisible: false,
      roPreviewVisible: false,
      formName: '',
    };

    const update = this._onChange.bind(this);
    ElementStore.subscribe((state) => update(state.data));
  }

  showPreview() {
    this.setState({
      previewVisible: true,
    });
  }

  showRoPreview() {
    this.setState({
      roPreviewVisible: true,
    });
  }

  closePreview() {
    this.setState({
      previewVisible: false,
      shortPreviewVisible: false,
      roPreviewVisible: false,
    });
  }

  _onChange(data) {
    this.setState({
      data,
    });
  }

  _onSubmit(data, formName) {
    const {cookies, setOpenSuccessSnackBar} = this.props;
    console.log(data)
    post(apiUrl() + '/newform', data, cookies.get('token'), formName);
    this.setState({formName: '', data: []});
    setOpenSuccessSnackBar(true);
  }

  render() {
    const {formName} = this.state;
    let modalClass = 'modal';
    if (this.state.previewVisible) {
      modalClass += ' show';
    }

    let roModalClass = 'modal ro-modal';
    if (this.state.roPreviewVisible) {
      roModalClass += ' show';
    }

    return (
      <div className="clearfix" style={{margin: '10px', width: '70%'}}>
        <TextField error={formName === ''} onChange={(ev) => this.setState({formName: ev.target.value})} value={formName} variant='outlined' id="standard-basic" label="Form Name" required={true}/>
        <Button className="btn btn-primary pull-right"
                style={{marginRight: '10px', marginTop: 10}}
                variant='contained'
                onClick={() => this._onSubmit(this.state.data, formName)}
                disabled={formName === '' || this.state.data.length === 0}
        >
          Add Form
        </Button>
        <Button variant='contained' className="btn btn-primary pull-right" style={{marginRight: '10px', marginTop: 10}} onClick={this.showPreview.bind(this)}>Preview Form</Button>
        <Button variant='contained' className="btn btn-default pull-right" style={{marginRight: '10px', marginTop: 10}} onClick={this.showRoPreview.bind(this)}>Read Only Form</Button>

        { this.state.previewVisible &&
        <div className={modalClass}>
          <div className="modal-dialog">
            <div className="modal-content">
              <ReactFormGenerator
                download_path=""
                // back_action="/"
                // back_name="Back"
                answer_data={{}}
                // action_name="Save"
                // form_action="/"
                // form_method="POST"
                onSubmit={() => {}}
                variables={this.props.variables}
                data={this.state.data} />

              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.closePreview.bind(this)}>Close</button>
              </div>
            </div>
          </div>
        </div>
        }

        { this.state.roPreviewVisible &&
        <div className={roModalClass}>
          <div className="modal-dialog">
            <div className="modal-content">
              <ReactFormGenerator
                download_path=""
                back_action="/"
                back_name="Back"
                answer_data={{}}
                action_name="Save"
                form_action="/"
                form_method="POST"
                read_only={true}
                variables={this.props.variables}
                hide_actions={true} data={this.state.data} />

              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.closePreview.bind(this)}>Close</button>
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    );
  }
}

export default withCookies(Demo);
