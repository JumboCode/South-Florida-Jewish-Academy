import React from 'react';
import StudentCard from './StudentCard';
import PropTypes from 'prop-types';
/* eslint camelcase: 0 */

// eslint-disable-next-line require-jsdoc
class AllCards extends React.Component {
  static propTypes = {
    info: PropTypes.any,
  };
  // eslint-disable-next-line require-jsdoc
  render() {
    // eslint-disable-next-line react/prop-types
    const {info, updateCurrID, updateCurrView} = this.props;
    return (
      <>
        {/* eslint-disable-next-line max-len */}
        {info.map(({first_name, middle_name, last_name, student_id, form_ids}) => {
          const name = `${first_name} ${middle_name.substring(
              0,
              1,
          )}. ${last_name}`;
          return (
            <StudentCard
              // onClick={() => {updateCurrID(id);updateCurrView('student')}}
              updateCurrID={updateCurrID}
              updateCurrView={updateCurrView}
              key={student_id}
              name={name}
              // email={email}
              id={student_id}
              // forms={form_ids}
            ></StudentCard>
          );
        })}
      </>
    );
  }
}

export default AllCards;
