/* eslint-disable max-len */
import React from 'react';
import ProfileEdit from '../Students/ProfileEdit';
import TextField from '@material-ui/core/TextField';
import ReceiptIcon from '@material-ui/icons/Receipt';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import EditIcon from '@material-ui/icons/Edit';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Forms from './Forms';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import {instanceOf, PropTypes} from 'prop-types';
import {withCookies, Cookies} from 'react-cookie';
import apiUrl from '../../utils/Env';
import ResendForms from './ResendForms';

const imageStyle = {
  width: 60,
  height: 60,
};
const parent = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: '40px',
  padding: 20,
};

const childRight= {
  display: 'flex',
};

const childLeft= {
  display: 'flex',
  marginLeft: 'auto',
};

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
    };
  }

  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
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
    })
        .then((res) => res.json())
        .then((data) => {
          this.setState({
            forms: data.forms,
            basicInfo: data.basic_info,
            blankForms: data.blank_forms,
          });
        }).catch((error) => {
          console.log(error);
        });
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {forms, basicInfo, currTab, blankForms} = this.state;
    // const {classes, children, className, ...other} = this.props;
    // eslint-disable-next-line react/prop-types
    if (!forms || !basicInfo) {
      return (
        <div>
          Loading...
        </div>
      );
    }
    // const classes = useStyles();
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{maxWidth: 1000, width: '100%'}}>
            <div style= {parent}>
              <div style={childRight}>
                <img alt="student_image"
                  style={imageStyle}
                  src="https://i1.wp.com/acaweb.org/wp-content/uploads/2018/12/profile-placeholder.png"
                />
                <div style={{marginLeft: 10, fontSize: 20}}>
                  <div>{basicInfo['first_name']} {basicInfo['last_name']}</div>
                  <div> ID: {basicInfo['_id']}</div>
                  {/* <div> <div style={line}> </div></div>*/}
                </div>
              </div>
              <div style={childLeft}>
                <TextField id="outlined-basic"
                  label="Search for Forms"
                  style ={{width: 250}}
                  variant="outlined" />
              </div>
            </div>
          </div>
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
                {currTab === 0 && <Forms forms={forms}/>}
                {currTab === 1 && <div>documents</div>}
                {currTab === 2 && <ProfileEdit basicInfo={basicInfo}/>}
                {currTab === 3 && <ResendForms studentForms={forms} blankForms={blankForms} studentId={basicInfo['_id']}/>}
              </div>
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

// export default withStyles(useStyles)(StudentProfile);
export default withCookies(StudentProfile);
