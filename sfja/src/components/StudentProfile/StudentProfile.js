/* eslint-disable max-len */
import React from 'react';
import ProfileEdit from './ProfileEdit';
import ReceiptIcon from '@material-ui/icons/Receipt';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import EditIcon from '@material-ui/icons/Edit';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Forms from './Forms';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MuiAlert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import {instanceOf, PropTypes} from 'prop-types';
import {withCookies, Cookies} from 'react-cookie';
import apiUrl from '../../utils/Env';
import ProfileHeader from './ProfileHeader';
import ResendForms from './ResendForms';
import DocumentUpload from './DocumentUpload';
import AdminZone from './AdminZone';
import {CircularProgress} from '@material-ui/core';


// eslint-disable-next-line require-jsdoc
class StudentProfile extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
    match: instanceOf(PropTypes.any),
  };

  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      forms: null,
      basicInfo: null,
      currTab: 0,
      value: 0,
      authorized: false,
    };
  }

  // eslint-disable-next-line require-jsdoc
  updateStudentProfile() {
    const {cookies} = this.props;
    const body = {
      id: this.props.match.params.id,
    };

    fetch(apiUrl() + '/studentProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
      body: JSON.stringify(body),
    }).then((res) => res.json())
        .then((data) => {
          this.setState({
            forms: data.forms,
            basicInfo: data.basic_info,
            blankForms: data.blank_forms,
            parents: data.parents,
            authorized: data.authorized,
          });
        }).catch((error) => {
          console.log(error);
        });
  }

  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    this.updateStudentProfile();
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {forms, basicInfo, currTab, blankForms, parents, authorized} = this.state;
    // const {classes, children, className, ...other} = this.props;
    // eslint-disable-next-line react/prop-types
    if (!forms || !basicInfo) {
      return (
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 10}}>
          <CircularProgress/>
        </div>
      );
    }
    // const classes = useStyles();
    return (
      <div>
        {basicInfo.archived ?
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
            <MuiAlert
              elevation={6}
              variant="filled"
              severity='error'
              style={{fontSize: 15, maxWidth: 1000, width: '100%'}}>
              This student is archived. Please ask the administrator to unarchive from the students page to make changes.
            </MuiAlert>
          </div> :
           null}
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <ProfileHeader basicInfo={basicInfo}/>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{maxWidth: 1000, width: '100%'}}>
            <Paper elevation={2}>
              <Tabs
                TabIndicatorProps={{style: {background: '#0068af'}}}
                variant='fullWidth'
                value={this.state.value}
                onChange={(event, newValue) => {
                  this.setState({currTab: newValue, value: newValue});
                }}
              >
                <Tab icon={<ReceiptIcon />} label="Forms" />
                <Tab icon={<InsertDriveFileIcon />} label="Documents" />
                <Tab icon={<EditIcon />} label="Edit Student Info" />
                <Tab icon={<MailOutlineIcon/>} label="Resend Forms" />
              </Tabs>
              <div>
                {currTab === 0 && <Forms forms={forms} studentId={basicInfo['_id']}/>}
                {currTab === 1 && <DocumentUpload studentId={basicInfo['_id']}/>}
                {currTab === 2 && <ProfileEdit basicInfo={basicInfo}/>}
                {currTab === 3 &&
                <ResendForms
                  studentForms={forms}
                  blankForms={blankForms}
                  studentId={basicInfo['_id']}
                  parents={parents}
                  updateStudentProfile={this.updateStudentProfile.bind(this)}
                  archived={basicInfo.archived}
                />}
              </div>
            </Paper>
          </div>
        </div>
        {authorized ?
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
            <AdminZone studentId={basicInfo['_id']}/>
          </div> : null}
      </div>
    );
  }
}

// export default withStyles(useStyles)(StudentProfile);
export default withCookies(StudentProfile);
