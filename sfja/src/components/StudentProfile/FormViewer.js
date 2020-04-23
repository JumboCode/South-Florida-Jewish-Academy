import React from 'react';
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from "../../utils/Env";
import ProfileHeader from "./ProfileHeader";
import {ReactFormGenerator} from "react-form-builder2";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

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
  handleSubmit(data){
    console.log(data);
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {basicInfo, blankFormData, formData, formInfo, parentProfile} = this.state;
    return (
      <div>
        {/* eslint-disable-next-line max-len */}
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{maxWidth: 1000, width: '100%', padding: 10}}>
            <Button
              style={{display: 'flex'}}
              className="button icon-left"
              variant="contained"
              onClick={() => this.props.history.goBack()}>
              Back
            </Button>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          {basicInfo && <ProfileHeader basicInfo={basicInfo}/>}
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{maxWidth: 1000, width: '100%', padding: 10}}>
            <Paper elevation={2} style={{padding: 10}}>
              {formInfo && parentProfile && <div>
                <div style={{fontSize: 16}}>
                  Form Name: {formInfo.name}
                </div>
                <div style={{fontSize: 13}}>
                  Parent: {parentProfile.first_name} {parentProfile.last_name}
                  <br/>
                  Parent Email: {parentProfile.email}
                  <br/>
                  Last Updated: {formInfo.last_updated === null ? 'Never' : formInfo.last_updated}
                  <br/>
                  Status: {formInfo.completed ? 'Complete' : 'Not Complete'}
                  <br/>
                </div>
              </div>}
              <div style={{backgroundColor: '#0068af', width: '100%', height: 2}}/>
              {blankFormData && formData &&
              <ReactFormGenerator
                onSubmit={this.handleSubmit.bind(this)}
                answer_data={formData}
                data={blankFormData}
                action_name={'Override Parent\'s Data'}
              />}
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

export default withCookies(FormViewer);
