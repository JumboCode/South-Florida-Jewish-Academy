import React from 'react';
import apiUrl from '../../utils/Env';
import {withAuth0} from '../../utils/Auth0Wrapper';
import ChangeGrades from './ChangeGrades';
import AuthMessage from './AuthMessage';
import CircularProgress from '@material-ui/core/CircularProgress';
import DataExports from './DataExports';
import Audit from './Audit';
import DeleteArchived from './DeleteArchived';
import ClearLogins from './ClearLogins';

// eslint-disable-next-line require-jsdoc
class Administration extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      authorizing: true,
      authorized: false,
      numArchived: 0,
      cacheSize: 0,
    };
  }

  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const {token} = this.props;
    fetch(apiUrl() + '/checkRoleAdmin', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }).then((response) => (response.json()))
        .then((data) => {
          this.setState({
            authorized: data.isAuthorized,
            authorizing: false,
            numArchived: data.numArchived,
            cacheSize: data.cacheSize,
          });
        });
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    const {authorized, authorizing, numArchived, cacheSize} = this.state;
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
                flexWrap: 'wrap',
                margin: 20,
              }}>
              <div
                style={{
                  display: 'flex',
                  margin: 20,
                  flexDirection: 'column',
                }}>
                <DataExports/>
                <div
                  style={{
                    display: 'flex',
                    marginTop: 20,
                  }}>
                  <ChangeGrades/>
                </div>
                <div
                  style={{
                    display: 'flex',
                    marginTop: 20,
                  }}>
                  <DeleteArchived numArchived={numArchived}/>
                </div>
                <div
                  style={{
                    display: 'flex',
                    marginTop: 20,
                  }}>
                  <ClearLogins cacheSize={cacheSize}/>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  margin: 20,
                }}>
                <Audit/>
              </div>
            </div> :
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 20}}>
              <AuthMessage
                message='You are not authorized to view this page.'
              />
            </div>
          }
        </div>}
      </div>
    );
  }
}
export default withAuth0(Administration);
