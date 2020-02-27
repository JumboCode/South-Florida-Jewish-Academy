import React from 'react';
import Header from '../Header';
import ProfileEdit from './ProfileEdit'

// eslint-disable-next-line require-jsdoc
class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forms: null,
      basicInfo: null,
      currTab: "forms",
    };
  }
  
  componentDidMount() {
    const id = this.props.match.params.id;

    fetch('http://127.0.0.1:5000/studentProfile?id=' + id)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          forms: data.forms,
          basicInfo: data.basic_info
      });
        console.log(data);
      })
      .catch(console.log);
    }
  render() {
    const {forms, basicInfo, currTab} = this.state;
    // eslint-disable-next-line react/prop-types
    if (!forms || !basicInfo) {
      return (
        <div>
          <Header/>
          Loading...
        </div>
      );
    }
    const id = this.props.match.params.id;
    return (
      <div>
        <Header currTab='students'/>
                id={id}
        <div>{basicInfo.first_name} {basicInfo.last_name}</div>
        <div>
          <span onClick={() => this.setState({currTab: "forms"})}>Forms</span>
          <span onClick={() => this.setState({currTab: "documents"})}>Documents</span>
          <span onClick={() => this.setState({currTab: "profileEdit"})}>Edit Student Info</span>

        </div>
        {currTab === "forms" && <div>forms</div>}
        {currTab === "documents" && <div>documents</div>}
        {currTab === "profileEdit" && <ProfileEdit basicInfo={basicInfo}/>}
        
        
      </div>
    );
  }
}

export default Student;
