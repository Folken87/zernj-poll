import React from 'react';

import io from 'socket.io-client'

export default class Main extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this.socket = io();
    }

    render(){
        return(
            <div>11111</div>
        )
    }
}