/* eslint-disable max-len */
import React from 'react';
import ProfileEdit from '../Students/ProfileEdit';
import ReceiptIcon from '@material-ui/icons/Receipt';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import EditIcon from '@material-ui/icons/Edit';
import Forms from './Forms';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import {instanceOf, PropTypes} from 'prop-types';
import {withCookies, Cookies} from 'react-cookie';
import apiUrl from '../../utils/Env';
import ProfileHeader from './ProfileHeader';

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
          });
        }).catch((error) => {
          console.log(error);
        });
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {forms, basicInfo, currTab} = this.state;
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
              </Tabs>
              <div>
                {currTab === 0 && <Forms forms={forms} studentId={basicInfo['_id']}/>}
                {currTab === 1 && <div>documents</div>}
                {currTab === 2 && <ProfileEdit basicInfo={basicInfo}/>}
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
