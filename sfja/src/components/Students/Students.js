import React from 'react';
import AllCards from './AllCards';
import MagnifyingGlass from './MagnifyingGlass';
import PropTypes from 'prop-types';
import {
  studentPageStyle,
  filterStyle,
  studentInfoStyle,
  searchBarStyle,
  InputStyle,
  MagnifyingGlassStyle,
  allCardsStyle,
} from './Styles';

// eslint-disable-next-line require-jsdoc
class Students extends React.Component {
  static propTypes = {
    students: PropTypes.any,
  };
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      students: null,
    };
  }
  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    fetch('http://127.0.0.1:5000/students')
        .then((res) => res.json())
        .then((data) => {
          this.setState({students: data.students});
          console.log(data);
        })
        .catch(console.log);
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    const {students} = this.state;
    // eslint-disable-next-line react/prop-types
    const {updateCurrView, updateCurrID} = this.props;
    // updateCurrView('student')
    if (!students) {
      return (
        <div>
          Loading...
        </div>
      );
    }
    return (
      <div>
        <div style={studentPageStyle}>
          <div style={filterStyle}>
            <p onClick={() => updateCurrView('student')}> Filters </p>
          </div>
          <div style={studentInfoStyle}>
            <div style={searchBarStyle}>
              <input
                style={InputStyle}
                placeholder="Search for Student"
              />
              <MagnifyingGlass style={MagnifyingGlassStyle} />
            </div>
            <div style={allCardsStyle}>
              {/* eslint-disable-next-line max-len */}
              <AllCards info={students} updateCurrID={updateCurrID} updateCurrView={updateCurrView}></AllCards>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default Students;
