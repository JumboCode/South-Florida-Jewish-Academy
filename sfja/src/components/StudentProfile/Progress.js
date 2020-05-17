import React, {Component} from 'react';
import './Progress.css';
/* eslint react/prop-types: 0 */

// eslint-disable-next-line require-jsdoc
class Progress extends Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {};
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div className="ProgressBar">
        <div
          className="Progress"
          style={{width: this.props.progress + '%'}}
        />
      </div>
    );
  }
}

export default Progress;
