import React from 'react';
import Forms from './Forms';
import {withCookies} from 'react-cookie';
import apiUrl from '../../utils/Env';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';

const chipDivStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: 'wrap',
}

const chipStyle = {
  marginLeft: 5,
}

class FormsTab extends React.Component {
    static propTypes = {
      forms: PropTypes.object,
      studentId: PropTypes.string,
      history: PropTypes.object,
    };

    constructor(props) {
      super(props);
      this.state = {
        selectedTags: [],
        allTags: [],
        forms: this.props.forms,
      }
    }

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

    onChipClick(tag) {
      this.setState(prevState => ({
        selectedTags: [...prevState.selectedTags, tag],
      }));
    }
    onChipDelete(tag) {
      var selected = [...this.state.selectedTags];
      var index = selected.indexOf(tag)
      if (index !== -1) {
        selected.splice(index, 1);
        this.setState({selectedTags: selected});
      }
    }

    render() {
      const {selectedTags, allTags, forms} = this.state;

      return(
        <div>
          <div style={chipDivStyle}>
            {selectedTags.sort().map((tag) => {
              return(
                <Chip label={tag} onDelete={() => {this.onChipDelete(tag)}} color="primary" style={chipStyle}/>
              );
            })}
            {allTags.sort().map((tag) => {
              if (!selectedTags.includes(tag)) {
                return(
                  <Chip label={tag} onClick={() => {this.onChipClick(tag)}} variant="outline" color="primary" style={chipStyle}/>
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
