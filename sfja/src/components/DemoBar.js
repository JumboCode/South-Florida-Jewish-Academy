import React from 'react';
import {ReactFormGenerator, ElementStore} from 'react-form-builder2';

export default class DemoBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      previewVisible: false,
    };

    const update = this._onChange.bind(this);
    ElementStore.subscribe((state) => update(state.data));
  }

  showPreview() {
    this.setState({
      previewVisible: true,
    });
  }

  closePreview() {
    this.setState({
      previewVisible: false,
    });
  }

  _onChange(data) {
    this.setState({
      data,
    });
  }

  render() {
    let modalClass = 'modal';
    if (this.state.previewVisible) {
      modalClass += ' show';
    }

    return (
      <div className="clearfix" style={{margin: '10px', width: '70%'}}>
        <h4 className="pull-left">Preview</h4>
        <button className="btn btn-primary pull-right" style={{marginRight: '10px'}} onClick={this.showPreview.bind(this)}>Preview Form</button>
        <button className="btn btn-default pull-right" style={{marginRight: '10px'}} onClick={this.props.backFunc}>Back</button>
        { this.state.previewVisible &&
          <div className={modalClass}>
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
                  variables={this.props.variables}
                  data={this.state.data} />

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
