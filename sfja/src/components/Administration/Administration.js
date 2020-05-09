import React from 'react';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from '../../utils/Env';
import {instanceOf} from 'prop-types';
import ChangeGrades from './ChangeGrades';
import AuthMessage from './AuthMessage';
import CircularProgress from '@material-ui/core/CircularProgress';
import Audit from './Audit';

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
    }).then((response) => (response.json()))
        .then((data) => {
          this.setState({
            authorized: data.isAuthorized,
            authorizing: false,
          });
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
          alignItems: 'center'}}
      >
        {authorizing ? <CircularProgress style={{marginTop: 40}}/> : <div>
          {authorized ?
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: 40,
              }}>
              <ChangeGrades/>
              <Audit/>
            </div> :
            <AuthMessage
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 20}}
              message='You are not authorized to view this page.'
            />
          }
        </div>}
      </div>
    );
  }
}
export default withCookies(Administration);
