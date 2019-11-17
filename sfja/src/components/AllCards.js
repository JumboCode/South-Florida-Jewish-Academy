import React from 'react';
import StudentCard from './StudentCard';


class AllCards extends React.Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    const myValues = this.props.info;
    return (
      <div>
        {myValues.map(data => (
          <StudentCard key={data.basic_info.email} name={data.basic_info.first_name + " " + data.basic_info.middle_name.substring(0,1) + ". " + data.basic_info.last_name} email={data.basic_info.email} id={data.id}></StudentCard>
          // <TestCard key={data.basic_info.email} name={data.basic_info.first_name + " " + data.basic_info.middle_name.substring(0,1) + ". " + data.basic_info.last_name} email={data.basic_info.email} id={data.id}></TestCard>

        ))}
        

      </div>
    );
  }
}

export default AllCards;