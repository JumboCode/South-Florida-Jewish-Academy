import React from 'react';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from '../../utils/Env';
import {instanceOf} from 'prop-types';
import ChangeGrades from './ChangeGrades';
import AuthMessage from './AuthMessage';

// eslint-disable-next-line require-jsdoc
class Administration extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      authorizing: true,
      authorized: false,
    };
  }

  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    const {cookies} = this.props;
    fetch(apiUrl() + '/checkRoleAdmin', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        this.setState({
          authorized: true,
          authorizing: false,
        });
      }
    });
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    const {authorized, authorizing} = this.state;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 20}}
      >
        {authorized ?
          <div>
            <ChangeGrades/>
          </div> :
          <AuthMessage
            message={authorizing ?
              'Authorizing...' :
              'You are not authorized to view this page.'}
          />
        }
      </div>
    );
  }
}
export default withCookies(Administration);
