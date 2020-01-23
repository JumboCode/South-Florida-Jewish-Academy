import React from 'react';
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
// } from 'react-router-dom';
import NavBar from './components/NavBar';

// npm install --save react-router-dom

// eslint-disable-next-line require-jsdoc
function App() {
  // need some function to request id from backend for each student
  return (
    <div className="App">
      <h1>
                South Florida Jewish Academy
      </h1>
      <h6>
                Kindergarten to Grade 12, give your child
        <br/>the best Education
      </h6>
      <br/>
      <div className="center_rect">
        <img src="assets/CircleLogo.png"></img>
        <p>Administration Login </p>
        <hr>
        </hr>
        <NavBar/>
      </div>
    </div>
  );
}


export default App;
