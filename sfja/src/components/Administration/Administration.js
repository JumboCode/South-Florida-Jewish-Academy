import React from 'react';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from '../../utils/Env';
import {instanceOf} from 'prop-types';

// eslint-disable-next-line require-jsdoc
class Administration extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
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
        });
      }
    });
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    const {authorized} = this.state;
    return (
      <div>
        {authorized ? <div>authorized</div> : <div>not authorized</div>}
      </div>
    );
  }
}
export default withCookies(Administration);
