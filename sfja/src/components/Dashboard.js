import React from 'react';
import Header from './Header';


class Dashboard extends React.Component{


    render(){


        return(

            <div>
                <Header currTab='dashboard'/>
                dashboard
            </div>
        )
    }
}

export default Dashboard;