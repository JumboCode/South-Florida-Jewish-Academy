import React from 'react'
import Admin from '../../Admin';
import Header from '../Header';

class Student extends React.Component{

    render(){
        const id = this.props.match.params.id;
        console.log(this.props)
        const {updateCurrView} = this.props;
        return(
            <div>
                <Header currTab='students'/>
                <div
                    onClick={() => updateCurrView('students')}
                >Back</div>
                id={id}
            </div>
        )
    }

}

export default Student;