import React from 'react';
import PropTypes from 'prop-types';

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
export default function ProfileHeader({basicInfo}) {
  return (
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
        <div style={childLeft}/>
      </div>
    </div>
  );
}

ProfileHeader.propTypes = {
  basicInfo: PropTypes.object,
};
