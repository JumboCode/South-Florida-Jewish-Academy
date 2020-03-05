import React from 'react';
import {useAuth0} from '../react-auth0-spa';


function GetToken ({updateToken}) {
    let toke = '';
    useAuth0().getTokenSilently().then(x => {toke = x}).then(x => {
        // alert('toke' + toke)
        updateToken(toke)
    })
    return(<div/>)
    // updateToken(toke)
}

export default GetToken;