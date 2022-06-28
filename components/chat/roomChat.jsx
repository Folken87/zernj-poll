import React from 'react';
import Message from './Message';

export default class RoomChat extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
           <React.Fragment>
                <div className='d-flex flex-row roomChatHeader'>
                    {this.props.name}
                </div>
                <div className="d-flex flex-row roomChatBody">
                    {this.props.messages && this.props.messages.map((el)=>{
                        return <Message />
                    })}
                </div>
                <div className='d-flex flex-row roomChatInput'></div>
           </React.Fragment>
        )
    }
}