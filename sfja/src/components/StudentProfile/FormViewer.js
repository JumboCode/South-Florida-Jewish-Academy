import React from 'react';
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';

// eslint-disable-next-line require-jsdoc
class FormViewer extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div>
        hello world
      </div>
    );
  }
}

export default withCookies(FormViewer);
