import React from 'react';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from '../../utils/Env';
import {instanceOf} from 'prop-types';
import ChangeGrades from './ChangeGrades';
import AuthMessage from './AuthMessage';
import CircularProgress from '@material-ui/core/CircularProgress';
import DataExports from './DataExports';
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
      <div>
        {authorizing ? <div
          style={{
            display: 'flex',
            margin: 40,
            justifyContent: 'space-evenly',
          }}>
          <CircularProgress/>
        </div>: <div>
          {authorized ?
            <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              margin: 40,
            }}>
              <div
                style={{
                  display: 'flex',
                  margin: 40,
                  flexDirection: 'column',
                }}>
                <DataExports/>
                <div
                  style={{
                    display: 'flex',
                    marginTop: 40,
                  }}>
                  <ChangeGrades/>
                  </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  margin: 40,
                }}>
                <Audit/>
              </div>
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
