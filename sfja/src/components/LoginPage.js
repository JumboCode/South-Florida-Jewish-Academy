import React from 'react';
import NavBar from "./NavBar";

class LoginPage extends React.Component{

    render() {
        const {authenticate} = this.props;
        return(
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
                    <NavBar authenticate={authenticate.bind(this)}/>
                </div>
            </div>
        )
    }
}

export default LoginPage;