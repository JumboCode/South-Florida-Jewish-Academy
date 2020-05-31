/* eslint-disable max-len */
import React from 'react';
import Forms from './Forms';
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
    };

    // eslint-disable-next-line require-jsdoc
    constructor(props) {
      super(props);
      // eslint-disable-next-line react/prop-types
      const {tags} = props;
      this.state = {
        tags: this.makeTags(tags),
      };
    }

    // eslint-disable-next-line require-jsdoc
    makeTags(tags) {
      return tags.sort().map((tag) => ({
        year: tag,
        clicked: false,
      }));
    }
    // eslint-disable-next-line require-jsdoc
    onChipClick(clickedTag) {
      const {tags} = this.state;
      this.setState({
        tags: tags.map((tag) => (clickedTag === tag.year ? {year: tag.year, clicked: !tag.clicked} : tag)),
      });
    }

    // eslint-disable-next-line require-jsdoc
    render() {
      const {tags} = this.state;
      const {forms, studentId} = this.props;
      const noneClicked = tags.every((tag) => !tag.clicked);
      return (
        <div>
          <div style={chipDivStyle}>
            {tags.map((tag) => (
              <Chip
                key={tag.year}
                label={tag.year}
                onClick={() => {
                  this.onChipClick(tag.year);
                }}
                color="primary"
                style={chipStyle}
                variant={tag.clicked ? 'default' : 'outlined'}
              />
            ))}
          </div>
          <Forms
            {...this.props}
            forms={forms.filter((form) => ( noneClicked || tags[tags.map((tag) => (tag.year)).indexOf(form.form_year)].clicked))}
            studentId={studentId}/>
        </div>
      );
    }
}

export default FormsTab;
