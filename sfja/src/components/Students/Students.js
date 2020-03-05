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
import Header from '../Header';
import GetToken from '../GetToken'


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
        token: null,
    };
  }
  // eslint-disable-next-line require-jsdoc
  componentDidMount() {

    const {token} = this.state;
    fetch('http://127.0.0.1:5000/students', {
    method: 'GET',
      mode: 'no-cors',
    headers: {
      Authorization: 'Bearer ' + token
    }}).then((res) => res.json())
        .then((data) => {
          this.setState({students: data.students});
          console.log(data);
        })
        .catch(console.log);
  }

  updateToken(newToken){
    console.log('newToken:', newToken);
    this.setState({token: newToken})
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {students, token} = this.state;
    // eslint-disable-next-line react/prop-types
    const {updateCurrView, updateCurrID} = this.props;
    console.log(updateCurrView);
    // updateCurrView('student')
    if (!token){
        return(
          <div>
            <Header currTab='students'/>
            <GetToken updateToken={this.updateToken.bind(this)}/>
          </div>

        );
    }
    if (!students) {
        return (
            <div>
                {token}
                <Header currTab='students'/>
                Loading...
            </div>
        );
      }

    return (
      <div>
        <Header currTab='students' />
        <div style={studentPageStyle}>
          <div style={filterStyle}>
            <p onClick={() => updateCurrView('student')}> Filters </p>
          </div>
            <div>{token}</div>
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
