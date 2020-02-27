import React from 'react';


class ProfileEdit extends React.Component{
    constructor(props){
        super(props)
        const {basicInfo} = this.props;
        console.log(basicInfo);
        this.state = {
            old_first_name: basicInfo.first_name,
            new_first_name: basicInfo.first_name
        }
    }
    
    render(){
        const {new_first_name, old_first_name} = this.state;
        return(
            <div>
                Edit info:
                <div>
                    <input type="text" name="name" value={new_first_name} onChange={theChange => this.setState({new_first_name: theChange.target.value})}/>
                    {new_first_name !== old_first_name ? <div>changed</div> : <div/>}
                </div>
            </div>
        )
    
    }
}

export default ProfileEdit;
