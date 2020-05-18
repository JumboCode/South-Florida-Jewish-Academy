import React from 'react';
import apiUrl from '../../utils/Env';
import Paper from '@material-ui/core/Paper';
import {CircularProgress} from '@material-ui/core';
import UnauthorizedCard from './UnauthorizedCard';

// eslint-disable-next-line require-jsdoc
class ParentDash extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      loading: true,
      authorized: false,
    };
  }

  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    fetch(apiUrl() + '/getParentInfo', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      // eslint-disable-next-line react/prop-types
      body: JSON.stringify({curr_link: this.props.match.params.parentKey}),
    }).then((response) => response.status === 200 ? response : null)
        .then((res) => res.json())
        .then((data) => {
          this.setState({
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            authorized: true,
          });
        }).catch((error) => {
          console.log(error);
        }).finally(() => {
          this.setState({
            loading: false,
          });
        });
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {firstName, lastName, email, loading, authorized} = this.state;

    if (loading) {
      return (
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
          <CircularProgress/>
        </div>
      );
    }

    if (!authorized) {
      return (<UnauthorizedCard/>);
    }

    return (
      // eslint-disable-next-line max-len
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
        <Paper elevation={2} style={{padding: 20, minWidth: 650}} >
          <div style={{paddingBottom: 10, fontSize: 20}}>
            Welcome to your SFJA form portal!
            <br/>
            <br/>
            Your information
          </div>
          <div style={{paddingBottom: 10, fontSize: 15}}>
            Name: {firstName} {lastName}
            <br/>
            Email: {email}
          </div>
          <div style={{paddingBottom: 10, fontSize: 15}}>
            Please click on a student tab above to get started.
          </div>
        </Paper>
      </div>
    );
  }
}

export default ParentDash;
