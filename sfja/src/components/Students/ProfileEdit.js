import React from 'react';

// eslint-disable-next-line require-jsdoc
class ProfileEdit extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    // eslint-disable-next-line react/prop-types
    const {basicInfo} = this.props;
    console.log(basicInfo);
    this.state = {
      // eslint-disable-next-line react/prop-types
      oldFirstName: basicInfo.first_name,
      // eslint-disable-next-line react/prop-types
      newFirstName: basicInfo.first_name,
    };
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {newFirstName, oldFirstName} = this.state;
    return (
      <div>
                Edit info:
        <div>
          {/* eslint-disable-next-line max-len */}
          <input type="text" name="name" value={newFirstName} onChange={(theChange) => this.setState({newFirstName: theChange.target.value})}/>
          {newFirstName !== oldFirstName ? <div>changed</div> : <div/>}
        </div>
      </div>
    );
  }
}

export default ProfileEdit;
