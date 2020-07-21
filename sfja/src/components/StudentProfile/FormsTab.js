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
      const {tags, years} = props;
      this.state = {
        tags: this.makeChips(tags),
        years: this.makeChips(years),
      };
    }

    // eslint-disable-next-line require-jsdoc
    makeChips(chips) {
      return chips.sort().map((chip) => ({
        name: chip,
        clicked: false,
      }));
    }
    // eslint-disable-next-line require-jsdoc
    onChipClick(clickedChip) {
      const {tags, years} = this.state;
      this.setState({
        tags: tags.map((tag) => (clickedChip === tag.name ? {name: tag.name, clicked: !tag.clicked} : tag)),
        years: years.map((year) => (clickedChip === year.name ? {name: year.name, clicked: !year.clicked} : year)),
      });
    }

    // eslint-disable-next-line require-jsdoc
    render() {
      const {tags, years} = this.state;
      const {forms, studentId} = this.props;
      const noneTagsClicked = tags.every((tag) => !tag.clicked);
      const noneYearsClicked = years.every((year) => !year.clicked);
      return (
        <div>
          <div style={chipDivStyle}>
            {years.map((year) => (
              <Chip
                key={year.name}
                label={year.name}
                onClick={() => {
                  this.onChipClick(year.name);
                }}
                color="primary"
                style={chipStyle}
                variant={year.clicked ? 'default' : 'outlined'}
              />
            ))}
            {tags.map((tag) => (
              <Chip
                key={tag.name}
                label={tag.name}
                onClick={() => {
                  this.onChipClick(tag.name);
                }}
                color="primary"
                style={chipStyle}
                variant={tag.clicked ? 'default' : 'outlined'}
              />
            ))}
          </div>
          <Forms
            {...this.props}
            forms={forms.filter((form) => ( noneYearsClicked || years[years.map((year) => (year.name)).indexOf(form.form_year)].clicked))
                .filter((form) => ( noneTagsClicked || tags[tags.map((tag) => (tag.name)).indexOf(form.form_tag)].clicked))}
            studentId={studentId}/>
        </div>
      );
    }
}

export default FormsTab;
