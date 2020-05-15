/* eslint-disable react/prop-types */
import React from 'react';
import {Button} from '@material-ui/core';
import PropTypes from 'prop-types';
import {ReactFormBuilder} from 'react-form-builder2';
import './css/bootstrap.min.css';
import './css/font-awesome.min.css';
import DemoBar from './DemoBar';
import fetch from 'isomorphic-fetch';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from '../../../utils/Env';
require('./scss/application.scss');

// eslint-disable-next-line require-jsdoc
class BlankFormBuilder extends React.Component {
  // eslint-disable-next-line require-jsdoc
  static propTypes = {
    setCreateForm: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      currentFormID: this.props.match.params.id,
      blankFormData: null,
      retrieved: false,
    };
  }
    // eslint-disable-next-line require-jsdoc
    componentDidMount() {
      const {cookies} = this.props;
      const {currentFormID} = this.state;
      const body = {
        form_id: currentFormID,
      };
      if (currentFormID){
        fetch(apiUrl() + '/getBlankForm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.get('token')}`,
          },
          body: JSON.stringify(body),
        }).then((response) => (response.json()))
            .then((data) => {
              this.setState({
                blankFormData: data.data,
                retrieved: true,
              });
            });
      } else {
        this.setState({retrieved: true});
      }
    }


  // eslint-disable-next-line require-jsdoc
  render() {
    
    const { setCreateForm} = this.props;
    const {blankFormData, retrieved} = this.state;
    console.log("BLANKFORM ", blankFormData);
    if (!retrieved){
      return(<div/>);
    }
    return (
      // eslint-disable-next-line max-len
      <div style={{display: 'flex', justifyContent: 'center', marginLeft: '10%'}}>
        <div style={{width: '100%', maxWidth: 1000}}>
          <div className="fm-container" >
            <React.Fragment>
              <Button
                variant='contained'
                onClick={() => this.props.history.goBack()}
                style={{marginTop: 30}}
              >
                back
              </Button>
              {/* demobar is the bit on the top with name and buttons */}
              {/* eslint-disable-next-line max-len */}
              <DemoBar setCreateForm={setCreateForm} {...this.props}/>
              {/* conditional render items for if already filled data */}
              <ReactFormBuilder data={blankFormData}/>
            </React.Fragment>
          </div>
        </div>
      </div>
    );
  }
}


export default withCookies(BlankFormBuilder);
