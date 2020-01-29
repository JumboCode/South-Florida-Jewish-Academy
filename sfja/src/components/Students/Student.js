import React from 'react'

class Student extends React.Component{

    render(){
        const {updateCurrView} = this.props;
        return(
            <div>
                <div
                    onClick={() => updateCurrView('students')}
                >Back</div>
            </div>
        )
    }

}

export default Student;