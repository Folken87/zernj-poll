import React from 'react';
import socket from '../context/socket';

class Chat extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            message: ""
        }
    }
    componentDidMount(){
        socket.on('now', data =>{
            this.setState({
                message: data.message
            })
        })
    }

    render(){
        return(
            <div>{this.state.message}</div>
        )
    }
}

export default Chat;