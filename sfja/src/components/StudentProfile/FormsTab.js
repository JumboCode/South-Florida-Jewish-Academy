import React from 'react';
import Forms from './Forms';
import {withCookies} from 'react-cookie';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
}));

class FormsTab extends React.Component {
    static propTypes = {
      forms: PropTypes.object,
      studentId: PropTypes.string,
      history: PropTypes.object,
    };

    constructor(props) {
      super(props);
      this.state = {
        selectedChips: [],
        allChips: [],
      }
    }

    render() {
      return(
          <Forms {...this.props} forms={this.props.forms} studentId={this.props.studentId}/>
      );
    }
}

export default withCookies(withStyles(useStyles)(FormsTab));
