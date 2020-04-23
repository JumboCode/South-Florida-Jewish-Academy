/* eslint-disable max-len,react/prop-types */
import React from 'react';
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from '../../utils/Env';
import ProfileHeader from './ProfileHeader';
import {ReactFormGenerator} from 'react-form-builder2';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ConfirmationDialog from '../../utils/ConfirmationDialog';

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
      blankFormData: null,
      basicInfo: null,
      parentProfile: null,
      formInfo: null,
      openDialog: false,
    };
  }
  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    const {cookies} = this.props;
    const body = {
      student_id: this.props.match.params.studentId,
      form_id: this.props.match.params.formId,
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
  setOpenDialog(newBool) {
    this.setState({openDialog: newBool});
  }
  // eslint-disable-next-line require-jsdoc
  handleSubmit(data) {
    this.setState({
      formData: data,
      openDialog: true,
    });
  }
  // eslint-disable-next-line require-jsdoc
  handleSubmitForm() {
    const {formData} = this.state;
    fetch(apiUrl() + '/submitForm', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      // eslint-disable-next-line react/prop-types
      body: JSON.stringify({
        // eslint-disable-next-line react/prop-types
        form_id: this.props.match.params.formId,
        answer_data: formData,
      }),
    }).then((response) => response);
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    const {basicInfo, blankFormData, formData, formInfo, parentProfile, openDialog} = this.state;
    console.log(formData);
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
              <div style={{backgroundColor: '#0068af', width: '100%', height: 2, marginTop: 10}}/>
              {blankFormData !== null ?
              <ReactFormGenerator
                onSubmit={this.handleSubmit.bind(this)}
                answer_data={formData}
                data={blankFormData}
                action_name={'Override Parent\'s Data'}
              /> : <div/>}
            </Paper>
          </div>
        </div>
        <ConfirmationDialog
          showWarning={openDialog}
          setShowWarning={this.setOpenDialog.bind(this)}
          onConfirm={this.handleSubmitForm.bind(this)}
          message='You are attempting to overwrite form data. Are you sure?'
          confirmMessage='Yes'
          notConfirmMessage='Back'
        />
      </div>
    );
  }
}

export default withCookies(FormViewer);
