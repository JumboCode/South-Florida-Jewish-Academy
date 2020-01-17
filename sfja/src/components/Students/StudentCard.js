import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TrashBin from "./TrashBin";

const cardStyle = {
    backgroundColor: "#1f76b3",
    width: "100%",
    fontFamily: "Futura",
    color: "white",
    marginTop: "40px"
};

const cardContentStyle = {
    display: "flex",
    paddingBottom: "10px"
};

const studentProfileStyle = {
    flex: "20%",
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    paddingTop: "20px"
};

const imageStyle = {
    width: "100px",
    height: "auto"
};

const nameStyle = {
    paddingTop: "15px"
};

const formInfoStyle = {
    flex: "75%",
    display: "flex",
    justifyContent: "center"
};

const incompleteStyle = {
    textAlign: "center",
    padding: "10px"
};

const formsStyle = {
    display: "flex",
    flexWrap: "wrap",
    borderRadius: "5px",
    backgroundColor: "#80b1d4"
};

const formStyle = {
    display: "flex",
    flex: "50%",
    maxWidth: "50%",
    padding: "5px"
};

const percentStyle = {
    marginLeft: "10px",
    color: "#01497a"
};

const formNameStyle = {
    flex: "100%",
    textAlign: "center",
    color: "white"
};

const trashBinStyle = {
    flex: "5%",
    position: "relative"
};

const trashBinIconStyle = {
    position: "absolute",
    bottom: "0px",
    right: "0px"
};

class StudentCard extends React.Component {
    render() {
        // const classes = useStyles();
        const bull = <span>•</span>;
        console.log(this.props, "props");
        const forms = this.props.forms;
        return (
            <Card style={cardStyle}>
                <CardContent style={cardContentStyle}>
                    <div style={studentProfileStyle}>
                        <img
                            style={imageStyle}
                            src="https://i1.wp.com/acaweb.org/wp-content/uploads/2018/12/profile-placeholder.png"
                        ></img>
                        <div style={nameStyle}> {this.props.name} </div>
                    </div>
                    <div style={formInfoStyle}>
                        <div style={{ width: "95%" }}>
                            <div style={incompleteStyle}>Incomplete Forms:</div>
                            <div style={formsStyle}>
                                {Object.keys(forms).map(key => (
                                    <div style={formStyle}>
                                        <div style={percentStyle}> 50% </div>
                                        <div style={formNameStyle}>
                                            {key} Form
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div style={trashBinStyle}>
                        <TrashBin style={trashBinIconStyle}></TrashBin>
                    </div>
                </CardContent>
            </Card>
        );
    }
}

export default StudentCard;
