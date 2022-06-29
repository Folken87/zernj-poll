import React from 'react';
import socket from '../../context/socket';
import Message from './Message';

export default class RoomChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMessage: "",
            messages: [
                // {
                //     id: 0,
                //     info: "",
                //     text: "ssssssssssssss"
                // },
                // {
                //     id: 0,
                //     info: "",
                //     text: "ssssssssssssss"
                // },
                // {
                //     id: 0,
                //     info: "",
                //     text: "ssssssssssssss"
                // },
                // {
                //     id: 0,
                //     info: "",
                //     text: "ssssssssssssss"
                // },
                // {
                //     id: 1,
                //     info: "",
                //     text: "ssssssssssssss"
                // },
            ]
        }
        this.inputRef = React.createRef();
        this.chatBoxRef = React.createRef();
    }
    componentDidMount() {
        socket.on("newMessage", data => {
            console.log(data);
            if (data.result[0].room !== this.props.roomId) return false;

            console.log(this.props.roomId);
            this.state.messages.push(data.result[0])
            this.setState({
                messages: this.state.messages
            }, () => this.scrollChatToBottom())
        })
        socket.on("loadMessages", data => {
            this.setState({
                messages: data.result.reverse()
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
        let date = new Date(str);
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
                </div>
                <div className="d-flex flex-row roomChatBody" ref={this.chatBoxRef}>
                    {this.state.messages
                        && this.state.messages.map((el, index) => {
                            return <Message
                                myMsg={this.props.userId === el.owner}
                                key={index}
                                info={this.getFormattedDate(el.sendDate)}
                                text={el.textMessage}
                                name={el.name ? el.name : ""}
                            />
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