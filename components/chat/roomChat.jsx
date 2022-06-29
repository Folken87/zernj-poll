import React from 'react';
import socket from '../../context/socket';
import Message from './Message';
import Voting from './Voting';

export default class RoomChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMessage: "",
            messages: [
            ]
        }
        this.inputRef = React.createRef();
        this.chatBoxRef = React.createRef();
    }
    componentDidMount() {
        socket.on("newMessage", data => {
            if (data.result[0].room !== this.props.roomId) return false;

            this.state.messages.push(data.result[0])
            this.setState({
                messages: this.state.messages
            }, () => this.scrollChatToBottom())
        })
        socket.on("loadMessages", data => {
            this.setState({
                messages: data.result
            }, () => this.scrollChatToBottom())
        })
        socket.emit("getMessages", this.props.roomId);
    }
    scrollChatToBottom() {
        this.chatBoxRef.current.scrollTop = this.chatBoxRef.current.scrollHeight;
    }
    sendMessage() {
        if (this.state.currentMessage.length == 0) return false;
        // console.log(this.state.currentMessage);
        socket.emit("sendMsg", {
            userId: this.props.userId,
            roomId: this.props.roomId,
            message: this.state.currentMessage
        })
        this.inputRef.current.value = "";
        return false;
    }
    changeCurrentMessage(value) {
        this.setState({
            currentMessage: value
        })
    }
    handleKeypress(e) {
        //it triggers by pressing the enter key
        if (e.keyCode === 13) {
            this.sendMessage();
        }
    };
    getFormattedDate(str) {
        return new Date(str).toLocaleTimeString("ru-RU");
        return date.getDate() +
            "/" + (date.getMonth() + 1) +
            "/" + date.getFullYear() +
            " " + date.getHours() +
            ":" + date.getMinutes() +
            ":" + date.getSeconds()
    }
    render() {
        return (
            <React.Fragment>
                <div className='d-flex flex-row roomChatHeader'>
                    {this.props.name}
                    <button type="button" class="btn btn-primary" onClick={() => this.props.switchModal("createvoting" + " " + this.props.roomId)}>Создать голосование</button>
                </div>
                <div className="d-flex flex-row roomChatBody" ref={this.chatBoxRef}>
                    {this.state.messages
                        && this.state.messages.map((el, index) => {
                            // console.log(el);
                            switch (el.type) {
                                case 0:
                                    return <Message
                                        myMsg={this.props.userId === el.owner}
                                        key={index}
                                        info={this.getFormattedDate(el.sendDate)}
                                        text={el.textMessage}
                                        name={el.name ? el.name : ""}
                                    />
                                case 1:
                                    return <Voting 
                                    myMsg={this.props.userId === el.owner}
                                    userId={this.props.userId}
                                    key={index}
                                    name={el.name ? el.name : ""} 
                                    votingId={parseInt(el.textMessage)}
                                    />
                            }

                        })}
                </div>
                <div className='d-flex flex-row roomChatInput'>
                    <div className="input-group mb-0">
                        <input
                            type="text"
                            ref={this.inputRef}
                            className="form-control"
                            placeholder="Введите текст..."
                            onChange={(e) => this.changeCurrentMessage(e.target.value)}
                            onKeyUp={(e) => this.handleKeypress(e)}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}