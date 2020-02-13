import React from 'react';
import Students from './Students/Students';
import Student from './Students/Student';

// eslint-disable-next-line require-jsdoc
class StudentTab extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      currView: 'students',
      currID: 0,
    };
  };

    updateCurrID = (newID) => {
      // eslint-disable-next-line no-invalid-this
      this.setState({
        currID: newID,
      });
    };

    updateCurrView = (newView) => {
      // eslint-disable-next-line no-invalid-this
      this.setState({
        currView: newView,
      });
    };

    // eslint-disable-next-line require-jsdoc
    render() {
      const {currView} = this.state;

      if (currView === 'students') {
        return (
          <Students
            updateCurrView={this.updateCurrView.bind(this)}
            updateCurrID={this.updateCurrID.bind(this)}
          />);
      }

      if (currView === 'student') {
        // eslint-disable-next-line max-len
        return (<Student currID updateCurrView={this.updateCurrView.bind(this)}/>);
      }
    }
}

export default StudentTab;
