import React from 'react';

const Info = ({info}) => {
  return (
    <div>
      {info.map((data) => (
        <div className="card" key={data.email}>
          <p>{data.name}</p>
          <p>{data.email}</p>
          <p>{data.company.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Info;
