import React from 'react';
import AllCards from './components/AllCards';

const nameStyle = {
	fontFamily: 'Futura',
	fontWeight: 'bold',
	fontSize: '40px'
};

const smallTextStyle = {
	fontFamily: 'Futura'
};

const studentPageStyle ={
    display: 'flex',
    maxWidth:'100%',
    paddingLeft: '15px',
    paddingRight: '15px'
}

const filterStyle ={
	backgroundColor:'#086fb3',
    flex: '0 1 300px',
	borderRadius:'5px',
    margin: '15px',
    height: 'fit-content'
}

const allCardsStyle ={ 
    backgroundColor: '#cde6ff',
    paddingTop: '1px',
    paddingBottom:'40px',
    flex: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    margin: '15px',
    borderRadius:'5px',
}

// eslint-disable-next-line require-jsdoc
class Admin extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      name: 'Janny',
      students: [],
    };
  }
  componentDidMount() {
    fetch('http://127.0.0.1:5000/students')
        .then((res) => res.json())
        .then((data) => {
          this.setState({students: data.students});
          console.log(data);
        })
        .catch(console.log);
  }

  render() {
    return (
      <div>
        <div>Admissions Page</div>
          <br/>
          <h1>{this.state.name}</h1>
        <div style={studentPageStyle}>
            <div style={filterStyle}>
                <p> hello </p>
            </div>
            <div style={allCardsStyle}>
                <AllCards info ={this.state.students}></AllCards>
            </div>
        </div>
      </div>);
  }
}




export default Admin;
