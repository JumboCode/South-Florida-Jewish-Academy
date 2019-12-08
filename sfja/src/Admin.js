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
    // justifyContent: 'center',
    width:'100%',
    border: '1px solid #000000',
    flexWrap: 'wrap',
    flexDirection: 'row', 
    flex: '0 1 auto'
    // flex: 'auto'
}

const filterStyle ={
	backgroundColor:'rgb(' + 0 + ',' + 105 + ',' + 176 + ')',
	// width:'25%',
    // height:'1200px',
    display: 'flex',
    justifyContent: 'flex-start',
    // flexWrap: 'wrap',
    // flex: '200px',
    // float:'left',
    // flex: '1',
	overflow: 'hidden',
	borderRadius:'10px',
	marginLeft:'3%'
}

const allCardsStyle ={
    // float:'right',
    display: 'flex',
    justifyContent: 'flex-end',
    // flex: '4',
    // width:'65%',
    // flexWrap: 'wrap',
    // flex: '200px',
	marginRight:'2%',
	overflow: 'hidden',
	borderRadius:'10px',
	marginBottom:'45px'
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
