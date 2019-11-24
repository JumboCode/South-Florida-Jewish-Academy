import React from 'react';
import StudentCard from './StudentCard';

const allCardsStyle = {
  backgroundColor: 'rgb(' + 136 + ',' + 181 + ',' + 215 + ')',
  paddingTop: '1px',
  paddingBottom:'40px'
};

class AllCards extends React.Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    const myValues = this.props.info;
    return (
      <div style={allCardsStyle}>
        {myValues.map(data => (
          <StudentCard key={data.basic_info.email} name={data.basic_info.first_name + " " + data.basic_info.middle_name.substring(0,1) + ". " + data.basic_info.last_name} email={data.basic_info.email} id={data.id}></StudentCard>
          // <TestCard key={data.basic_info.email} name={data.basic_info.first_name + " " + data.basic_info.middle_name.substring(0,1) + ". " + data.basic_info.last_name} email={data.basic_info.email} id={data.id}></TestCard>

        ))}
        

      </div>
    );
  }
}

export default AllCards;