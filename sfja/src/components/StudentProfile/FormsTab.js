import React from 'react';
import Forms from './Forms';
import {withCookies} from 'react-cookie';
import apiUrl from '../../utils/Env';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';

const chipDivStyle = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
};

const chipStyle = {
  marginLeft: 5,
};

// eslint-disable-next-line require-jsdoc
class FormsTab extends React.Component {
    static propTypes = {
      forms: PropTypes.object,
      studentId: PropTypes.string,
      history: PropTypes.object,
      cookies: PropTypes.any,
    };

    // eslint-disable-next-line require-jsdoc
    constructor(props) {
      super(props);
      this.state = {
        selectedTags: [],
        allTags: [],
        forms: this.props.forms,
      };
    }

    // eslint-disable-next-line require-jsdoc
    componentDidMount() {
      const {cookies} = this.props;

      fetch(apiUrl() + '/getFormTags', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('token')}`,
        },
      }).then((res) => res.json())
          .then((data) => {
            this.setState({
              allTags: data.tags,
            });
          }).catch((error) => {
            console.log(error);
          });
    }

    // eslint-disable-next-line require-jsdoc
    onChipClick(tag) {
      this.setState((prevState) => ({
        selectedTags: [...prevState.selectedTags, tag],
      }));
    }

    // eslint-disable-next-line require-jsdoc
    onChipDelete(tag) {
      const selected = [...this.state.selectedTags];
      const index = selected.indexOf(tag);
      if (index !== -1) {
        selected.splice(index, 1);
        this.setState({selectedTags: selected});
      }
    }

    // eslint-disable-next-line require-jsdoc
    render() {
      const {selectedTags, allTags, forms} = this.state;

      return (
        <div>
          <div style={chipDivStyle}>
            {// eslint-disable-next-line react/jsx-key
              selectedTags.sort().map((tag) => {
                return (
                  // eslint-disable-next-line react/jsx-key
                  <Chip label={tag} onDelete={() => {
                    this.onChipDelete(tag);
                  }} color="primary" style={chipStyle}/>
                );
              })}
            {allTags.sort().map((tag) => {
              if (!selectedTags.includes(tag)) {
                return (
                  <Chip label={tag} onClick={() => {
                    this.onChipClick(tag);
                  }} variant="outline" color="primary" style={chipStyle}/>
                );
              }
            })}
          </div>
          <Forms {...this.props} forms={forms.filter(function(form) {
            if (selectedTags.length != 0) {
              return selectedTags.includes(form['form_year']);
            }
            return true;
          })} studentId={this.props.studentId}/>
        </div>
      );
    }
}

export default withCookies(FormsTab);
