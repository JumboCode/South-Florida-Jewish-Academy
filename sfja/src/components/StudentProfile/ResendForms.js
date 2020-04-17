import React from 'react';
import Proptypes, {instanceOf} from 'prop-types';
import apiUrl from '../../utils/Env';
import {Cookies, withCookies} from 'react-cookie';

// eslint-disable-next-line require-jsdoc
class ResendForms extends React.Component {
  static propTypes = {
    studentId: Proptypes.string,
    cookies: instanceOf(Cookies).isRequired,
  };

  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      studentId: props.studentId,
      allBlankForms: [],
      studentBlankForms: [],
      currBlankForms: [],
    };
  }


  // maybe do one call later? Depends. Don't know what we would rather yet.
  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    const {studentId} = this.state;
    const {cookies} = this.props;
    const body = {
      id: studentId,
    };

    fetch(apiUrl() + '/studentProfileBlankForms', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
    }).then((response) => response.json())
        .then((data) => {
          this.setState({
            studentBlankForms: data.forms.map((currForm) => ({
              id: currForm.blankFormId,
              name: currForm.blankFormName,
            })),
          });
        }).then(() => {
          fetch(apiUrl() + '/getAllForms', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${cookies.get('token')}`,
            },
          }).then((res) => res.json())
              .then((result) => {
                const {studentBlankForms} = this.state;
                const allBlankForms = result.forms.map((currForm) => (
                  {
                    id: currForm.id,
                    name: currForm.name,
                  }
                ));
                // eslint-disable-next-line max-len
                const studentBlankFormsIds = studentBlankForms.map((currForm) => currForm.id);
                const currBlankForms = allBlankForms.map((currForm) => (
                  {
                    id: currForm.id,
                    name: currForm.name,
                    checked: studentBlankFormsIds.includes(currForm.id),
                  }
                ));
                this.setState({
                  allBlankForms: allBlankForms,
                  currBlankForms: currBlankForms,
                });
              });
        });
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div>
          Resend forms
      </div>
    );
  }
}

export default withCookies(ResendForms);

