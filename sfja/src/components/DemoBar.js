import React from 'react';
import {ReactFormGenerator, ElementStore} from 'react-form-builder2';

// eslint-disable-next-line require-jsdoc
export default class DemoBar extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      previewVisible: false,
    };

    const update = this._onChange.bind(this);
    ElementStore.subscribe((state) => update(state.data));
  }

  // eslint-disable-next-line require-jsdoc
  showPreview() {
    this.setState({
      previewVisible: true,
    });
  }

  // eslint-disable-next-line require-jsdoc
  closePreview() {
    this.setState({
      previewVisible: false,
    });
  }

  // eslint-disable-next-line require-jsdoc
  _onChange(data) {
    this.setState({
      data,
    });
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    let modalClass = 'modal';
    if (this.state.previewVisible) {
      modalClass += ' show';
    }

    return (
      <div className="clearfix" style={{margin: '10px', width: '70%'}}>
        <h4 className="pull-left">Preview</h4>
        <button className="btn btn-primary pull-right" style={{marginRight:
                '10px'}} onClick={this.showPreview.bind(this)}>
            Preview Form</button>

        <button className="btn btn-default pull-right" style={{marginRight:
                // eslint-disable-next-line react/prop-types
                '10px'}} onClick={this.props.backFunc}>Back</button>
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
                  // eslint-disable-next-line react/prop-types
                  variables={this.props.variables}
                  data={this.state.data} />

                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss
                    ="modal" onClick={this.closePreview.bind(this)}>
                    Close</button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
