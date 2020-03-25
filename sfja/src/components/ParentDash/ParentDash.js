import React from 'react';
import PropTypes from 'prop-types';

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
            body: JSON.stringify({parent_id: 19}),
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

      return (
        <h1>HELLO</h1>
        // <div>
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
