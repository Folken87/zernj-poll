import React, { useEffect, useRef, useState } from 'react';
import socket from '../../context/socket';
import Message from './Message';
import Voting from './Voting';
import { useAtom } from 'jotai';

import {
    userAtom,
    modalAtom,
    currentMessageAtom,
    messagesAtom,
    votingsAtom,
    onLoadVotingsAtom,
    roomUsersAtom,
    currentRoomAtom,
    roomsAtom
} from '../../store/store';

export default function RoomChat(props) {
    const [user, setUser] = useAtom(userAtom);
    const [modal, setModal] = useAtom(modalAtom);
    const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom);
    const [currentMessage, setCurrentMessage] = useAtom(currentMessageAtom);
    const [messages, setMessages] = useAtom(messagesAtom);
    const [votings, setVotings] = useAtom(votingsAtom);
    const [onLoadVotings, setOnLoadVotings] = useAtom(onLoadVotingsAtom);
    const [roomUsers, setRoomUsers] = useAtom(roomUsersAtom);

    const [curMsg, setCurMsg] = useState("");

    useEffect(() => {
        socket.emit("getRoomUsers", {
            roomId: currentRoom
        })
        socket.emit("getMessages", currentRoom);
    }, []);

    function getVoting(votingId, userId) {
        onLoadVotings.push(votingId);
        setOnLoadVotings(onLoadVotings);
        socket.emit("getVoting", {
            id: votingId,
            userId: userId
        })
    }

    function sendMessage() {

        if (curMsg.length == 0) return false;
        socket.emit("sendMsg", {
            userId: user.id,
            name: user.name,
            roomId: currentRoom,
            message: curMsg
        })
        setCurMsg("".toString());
        document.getElementsByClassName("chatInputSelector")[0].value = "";
        return false;
    }
    function handleKeypress(e) {
        //it triggers by pressing the enter key
        if (e.keyCode === 13) {
            sendMessage();
        }
    };
    function getFormattedDate(str) {
        return new Date(str).toLocaleTimeString("ru-RU");
    }
    return (
        <React.Fragment>
            <div className='d-flex flex-row roomChatHeader'>
                {props.name}
                {
                    roomUsers.map((el, i) => {
                        return (
                            <span key={i + 123} className="badge bg-secondary">{el}</span>
                        )
                    })
                }
                {user.role == 1 && (
                    <button type="button" className="btn btn-primary" onClick={() => setModal("createvoting" + " " + currentRoom)}>Создать голосование</button>
                )}
                {user.role == 1 && (
                    <button type="button" className="btn btn-primary" onClick={() => setModal("historyroom")}>История посещений</button>
                )}
            </div>
            <div className='d-flex flex-row'>
                <div id="roomChatBody" className="d-flex flex-column flex-column-reverse roomChatBody" key={messages.length}>
                    {messages.map((el, index) => {
                        switch (el.type) {
                            case 0:
                                return <Message
                                    myMsg={user.id === parseInt(el.owner)}
                                    key={index + 200}
                                    info={getFormattedDate(el.sendDate)}
                                    text={el.textMessage}
                                    name={el.name ? el.name : ""}
                                />
                            case 1:
                                if (onLoadVotings.includes(parseInt(el.textMessage))) return null;
                                let voting = votings.find((el2) => el2.id === parseInt(el.textMessage));
                                if (voting) {
                                    return <Voting
                                        voted={voting.voted}
                                        myMsg={user.id === parseInt(el.owner)}
                                        userId={user.id}
                                        votingId={voting.id}
                                        key={index + 200}
                                        name={voting.name}
                                        answers={voting.answers}
                                        sum={voting.sum}
                                    />
                                } else {
                                    return getVoting(parseInt(el.textMessage), parseInt(user.id))
                                }
                        }

                    })}
                </div>
            </div>
            <div className='d-flex flex-row roomChatInput'>
                <div className="input-group mb-0">
                    <input
                        type="text"
                        className="form-control chatInputSelector"
                        placeholder="Введите текст..."
                        onChange={(e) => setCurMsg(e.target.value)}
                        onKeyUp={(e) => handleKeypress(e)}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}