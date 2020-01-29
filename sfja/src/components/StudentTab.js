    import React from 'react'
import Students from './Students/Students'
import Student from './Students/Student'

class StudentTab extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            currView: 'students',
            currID: 0
        }
    };

    updateCurrID = (newID) => {
        this.setState({
            currID: newID
        })

    }

    updateCurrView = (newView) => {
        this.setState({
            currView: newView
        });
    };

    render(){
        const {currView, currID} = this.state;

        if (currView === 'students')
            return(
                <Students 
                    updateCurrView={this.updateCurrView.bind(this)} 
                    updateCurrID={this.updateCurrID.bind(this)}
                />);      

        if (currView === 'student')
            return(<Student currID updateCurrView={this.updateCurrView.bind(this)}/>);     

    }


}

export default StudentTab;