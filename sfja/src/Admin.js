import React from "react";
import AllCards from "./components/AllCards";
import MagnifyingGlass from "./components/MagnifyingGlass";

const nameStyle = {
    fontFamily: "Futura",
    fontWeight: "bold",
    fontSize: "40px"
};

const smallTextStyle = {
    fontFamily: "Futura"
};

const studentPageStyle = {
    display: "flex",
    maxWidth: "100%",
    paddingLeft: "15px",
    paddingRight: "15px",
    fontFamily: "Futura"
};

const filterStyle = {
    backgroundColor: "#086fb3",
    flex: "0 1 300px",
    borderRadius: "5px",
    margin: "15px",
    height: "fit-content",
    textAlign: "center",
    fontSize: "20px",
    color: "white"
};

const searchBarStyle = {
    display: "flex",
    flex: "100%",
    borderRadius: "50px",
    borderStyle: "solid",
    borderColor: "grey",
    alignItems: "center"
};

const InputStyle = {
    flex: 1,
    width: "95%",
    height: "40px",
    paddingLeft: "10px",
    paddingRight: "10px",
    fontSize: "15px",
    borderRadius: "50px",
    border: 0,
    outline: "none"
};

const MagnifyingGlassStyle = {
    flex: "30px",
    maxWidth: "30px",
    textAlign: "center",
    paddingRight: "10px"
};
const allCardsStyle = {
    backgroundColor: "#cde6ff",
    padding: "40px",
    paddingTop: "0px",
    flex: "100%",
    display: "flex",
    flexWrap: "wrap",
    borderRadius: "5px",
    marginTop: "25px"
};

const studentInfoStyle = {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    padding: "15px"
};

// eslint-disable-next-line require-jsdoc
class Admin extends React.Component {
    // eslint-disable-next-line require-jsdoc
    constructor(props) {
        super(props);
        this.state = {
            name: "Janny",
            students: []
        };
    }
    componentDidMount() {
        fetch("http://127.0.0.1:5000/students")
            .then(res => res.json())
            .then(data => {
                this.setState({ students: data.students });
                console.log(data);
            })
            .catch(console.log);
    }

    render() {
        return (
            <div>
                <div>Admissions Page</div>
                <br />
                <h1>{this.state.name}</h1>
                <div style={studentPageStyle}>
                    <div style={filterStyle}>
                        <p> Filters </p>
                    </div>
                    <div style={studentInfoStyle}>
                        <div style={searchBarStyle}>
                            <input
                                style={InputStyle}
                                placeholder="Search for Student"
                            />
                            <MagnifyingGlass style={MagnifyingGlassStyle} />
                        </div>
                        <div style={allCardsStyle}>
                            <AllCards info={this.state.students}></AllCards>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Admin;
