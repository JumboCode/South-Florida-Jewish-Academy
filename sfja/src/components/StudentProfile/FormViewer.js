import React from 'react';
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from "../../utils/Env";
import ProfileHeader from "./ProfileHeader";

// eslint-disable-next-line require-jsdoc
class FormViewer extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      formData: [],
      blankFormData: [],
      basicInfo: null,
      parentProfile: null,
      formInfo: null,
    };
  }
  componentDidMount() {
    const {cookies} = this.props;
    const body = {
      student_id: this.props.match.params.studentId,
      form_id: this.props.match.params.formId
    };

    fetch(apiUrl() + '/studentProfileForm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
      body: JSON.stringify(body),
    }).then((res) => res.json())
        .then((data) => {
          this.setState({
            formData: data.form_data,
            blankFormData: data.blank_form_data,
            basicInfo: data.basic_info,
            parentProfile: data.parent_profile,
            formInfo: data.form_info,
          });
        }).catch((error) => {
          console.log(error);
        });
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {basicInfo} = this.state;
    return (
      <div>
        {/* eslint-disable-next-line max-len */}
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          {basicInfo && <ProfileHeader basicInfo={basicInfo}/>}
        </div>
      </div>
    );
  }
}

export default withCookies(FormViewer);
