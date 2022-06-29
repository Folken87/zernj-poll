import React from 'react';
import socket from '../../context/socket';
import Message from './Message';
import Voting from './Voting';

export default class RoomChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMessage: "",
            messages: [],
            votings: [],
            onLoadVotings: [],
            roomUsers: []
        }
        this.inputRef = React.createRef();
        this.chatBoxRef = React.createRef();
    }
    componentDidMount() {
        socket.on("loadRoomUsers", data => {
            console.log(data);
            this.setState({
                roomUsers: data.users
            })
        })
        socket.emit("getRoomUsers", {
            roomId: this.props.roomId
        })
        socket.on("newMessage", data => {
            // console.log("newMessage");
            // console.log(this.props);
            if (parseInt(data.result[0].room) !== parseInt(this.props.roomId)) return false;
            this.state.messages.push(data.result[0])
            this.setState({
                messages: this.state.messages
            }, () => this.scrollChatToBottom())
        })
        socket.on("loadVoting", data => {
            let voted = data.voted;
            let rows = data.rows;
            let voting = {
                id: -1,
                voted: voted,
                name: "",
                answers: [],
                sum: 0
            }
            // this.state.answers = [];
            rows.forEach(el => {
                voting.id = parseInt(el.votingId);
                voting.name = el.nameVote;
                voting.answers.push({
                    id: parseInt(el.id),
                    text: el.answerValue,
                    count: parseInt(el.count)
                })
                voting.sum += parseInt(el.count);
            });

            let oldVoting = this.state.votings.findIndex(el => el.id === voting.id);
            if (oldVoting !== -1) this.state.votings.splice(oldVoting, 1);


            this.state.votings.push(voting);
            let olvIndex = this.state.onLoadVotings.indexOf(voting.id);
            if (olvIndex !== -1) this.state.onLoadVotings.splice(olvIndex, 1);
            this.setState({
                onLoadVotings: this.state.onLoadVotings,
                votings: this.state.votings
            }, () => this.scrollChatToBottom())
            // this.setState({
            //     name: this.state.name,
            //     voted: voted,
            //     answers: this.state.answers
            // })
        });
        socket.on("loadMessages", data => {
            this.setState({
                messages: data.result,
                votings: []
            }, () => this.scrollChatToBottom())
        })
        socket.emit("getMessages", this.props.roomId);
    }
    getVoting(votingId, userId) {
        this.state.onLoadVotings.push(votingId);
        this.setState({
            onLoadVotings: this.state.onLoadVotings
        })
        socket.emit("getVoting", {
            id: votingId,
            userId: userId
        })
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
                    {
                        this.state.roomUsers.map((el, i) => {
                            return (
                                <span key={i+123} className="badge bg-secondary">{el}</span>
                            )
                        })
                    }
                    <button type="button" className="btn btn-primary" onClick={() => this.props.switchModal("createvoting" + " " + this.props.roomId)}>Создать голосование</button>
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
                                    if (this.state.onLoadVotings.includes(parseInt(el.textMessage))) return null;
                                    let voting = this.state.votings.find((el2) => el2.id === parseInt(el.textMessage));
                                    if (voting) {
                                        return <Voting
                                            voted={voting.voted}
                                            myMsg={this.props.userId === el.owner}
                                            userId={this.props.userId}
                                            votingId={voting.id}
                                            key={index}
                                            name={voting.name}
                                            answers={voting.answers}
                                            sum={voting.sum}
                                        />
                                    } else {
                                        return this.getVoting(parseInt(el.textMessage), parseInt(this.props.userId))
                                    }
                                    break;
                                // return <Voting
                                //     voted={}
                                //     myMsg={this.props.userId === el.owner}
                                //     userId={this.props.userId}
                                //     votingId={parseInt(el.textMessage)}
                                //     key={index}
                                //     name={el.name ? el.name : ""}
                                // />
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