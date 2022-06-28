import React from 'react';
import Message from './Message';

export default class RoomChat extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            messages:[
                {
                    info: "",
                    text: "ssssssssssssss"
                },
                {
                    info: "",
                    text: "ssssssssssssss"
                },
                {
                    info: "",
                    text: "ssssssssssssss"
                },
                {
                    info: "",
                    text: "ssssssssssssss"
                },
                {
                    info: "",
                    text: "ssssssssssssss"
                },
            ]
        }
    }
    render(){
        return(
           <React.Fragment>
                <div className='d-flex flex-row roomChatHeader'>
                    {this.props.name}
                </div>
                <div className="d-flex flex-row roomChatBody">
                    {this.state.messages && this.state.messages.map((el, index)=>{
                        return <Message key={index} info={el.info} text={el.text} />
                    })}
                </div>
                <div className='d-flex flex-row roomChatInput'></div>
           </React.Fragment>
        )
    }
}