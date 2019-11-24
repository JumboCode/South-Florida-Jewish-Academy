import React from 'react';
import AllCards from './components/AllCards';
import Logo from "./logo.jpg";

const logoStyle = {
  marginLeft: '30px',
  marginBottom:'15px',
  marginTop: '15px'
};

const nameStyle = {
	fontFamily: 'Futura',
	fontWeight: 'bold',
	fontSize: '40px'
};

const smallTextStyle = {
	fontFamily: 'Futura'
};

const filterStyle ={
	backgroundColor:'rgb(' + 0 + ',' + 105 + ',' + 176 + ')',
	width:'367px',
	height:'1200px',
	float:'left',
	overflow: 'hidden',
	borderRadius:'10px',
	marginLeft:'40px'
}

const allCardsStyle ={
	float:'right',
	width:'1200px',
	marginRight:'15px',
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
        <img style={logoStyle} src={Logo} alt="website logo"/>
          <div>
			<div style={nameStyle}>South Florida Jewish Academy</div><br/>
			<div>Admissions Page</div>
          </div>
            
        <br/>
                

        <h1>{this.state.name}</h1>
		<div>
			<div style={filterStyle}>
				
			</div>
			<div style={allCardsStyle}>
			<AllCards info ={this.state.students}></AllCards>
			</div>
		</div>
      </div>);
  }
}




export default Admin;
