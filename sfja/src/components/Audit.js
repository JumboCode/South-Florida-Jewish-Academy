import React from 'react';

//hello
class Audit extends React.Component{

    componentDidMount() {
        fetch('http://127.0.0.1:5000/users')
            .then((res) => res.json())
            .then((data) => {
              this.setState({users: data.users});
              console.log(data);
            })
            .catch(console.log);
      }

    render(){
        return(
            <div>U r in audit</div>
        )
    }
}

export default Audit;