/* eslint-disable max-len */
import React from 'react';
import ProfileEdit from '../Students/ProfileEdit';
import TextField from '@material-ui/core/TextField';
import ReceiptIcon from '@material-ui/icons/Receipt';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import EditIcon from '@material-ui/icons/Edit';
import Forms from './Forms';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

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
    // eslint-disable-next-line react/prop-types
    const id = this.props.match.params.id;

    fetch('http://127.0.0.1:5000/studentProfile?id=' + id)
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
              </Tabs>
              <div>
                {currTab === 0 && <Forms forms={forms}/>}
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
export default StudentProfile;