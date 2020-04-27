import React from 'react'

class Input extends React.Component {
render(){
    return(
        <form>
        <label>
            Upload File:
            <input type="text" name="name" />
        </label>
        <input type="submit" value="Submit" />
        </form>
    )
}
}
export default Input