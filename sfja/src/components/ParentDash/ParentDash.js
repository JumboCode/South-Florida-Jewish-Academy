import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Button } from '@material-ui/core';

// eslint-disable-next-line require-jsdoc
class ParentDash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            student_ids: [],
        };
    }

    componentDidMount() {
        fetch('http://127.0.0.1:5000/getStudentsOfParent', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({curr_link: "p1link"}),
        }).then((res) => res.json())
          .then((data) => {
            this.setState({student_ids: data.student_ids});
            console.log(data);
          })
          .catch(console.log);
    }
    // eslint-disable-next-line require-jsdoc
    postKey = (key) => {
      const body = {
        key: key,
      };
      fetch('http://127.0.0.1:5000/checkKey', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => response.status);

      return true;
    };

    // eslint-disable-next-line require-jsdoc
    render() {
      const key = this.props.match.params.key;
      const {student_ids} = this.state;

      return (
        <React.Fragment>
        <h1>PARENT PAGE</h1>
        <List>
            {student_ids.map((value) => {
              return (
                <ListItem key={value}>
                  <Button variant="contained" color="primary">{value}</Button> 
                </ListItem>
              );
            })}
        </List>
        </React.Fragment>
        //<div>
        //         key (testing purposes): {key}
        //   <br />
        //   <button onClick={this.postKey(key)}> CHECK </button>
        // </div>
      );

    

    }
}

ParentDash.propTypes = {
  match: PropTypes.any,
};

export default ParentDash;
