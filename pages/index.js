import React, { useEffect } from 'react';
import socket from '../context/socket';
import 'bootstrap/dist/css/bootstrap.css';
import { Provider, useAtom } from 'jotai';

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
} from '../store/store';

import Auth from '../components/Auth/Auth';
import Chat from '../components/chat/Chat';
import CreateRoom from '../components/chat/CreateRoom';
import CreateVoting from '../components/chat/CreateVoting';
import HistoryRoom from '../components/chat/HistoryRoom';





export default function Main() {
    const [user, setUser] = useAtom(userAtom);
    const [modal, setModal] = useAtom(modalAtom);
    const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom);
    const [currentMessage, setCurrentMessage] = useAtom(currentMessageAtom);
    const [messages, setMessages] = useAtom(messagesAtom);
    const [votings, setVotings] = useAtom(votingsAtom);
    const [onLoadVotings, setOnLoadVotings] = useAtom(onLoadVotingsAtom);
    const [roomUsers, setRoomUsers] = useAtom(roomUsersAtom);
    const [rooms, setRooms] = useAtom(roomsAtom);

    function scrollChatToBottom() {
        let obj = document.getElementsByClassName("roomChatBody")[0];
        obj.scrollTop = obj.scrollHeight;
    }
    useEffect(() => {
        socket.off("loadRoomUsers");
        socket.off("loadVoting");
        socket.off("loadMessages");
        socket.off("loadAuth");
        socket.off("loadRooms");
        socket.on("loadRooms", data => {
            setRooms(data.rooms);
        })
        socket.on("loadRoomUsers", data => {
            setRoomUsers(data.users);
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

            let oldVoting = votings.findIndex(el => el.id === voting.id);
            if (oldVoting !== -1) votings.splice(oldVoting, 1);

            votings.push(voting);
            let olvIndex = onLoadVotings.indexOf(voting.id);
            if (olvIndex !== -1) onLoadVotings.splice(olvIndex, 1);
            setOnLoadVotings(onLoadVotings);
            setVotings(votings);
            try {
                scrollChatToBottom();
            } catch (error) {

            }
        });
        socket.on("loadMessages", data => {
            messages.splice(0, messages.length - 1);
            messages.push(...data.result);
            setMessages(messages.reverse());
            // setVotings([]);
            try {
                scrollChatToBottom();
            } catch (error) {

            }
        })
        socket.on("loadAuth", data => {
            if (data.result.length == 0) return false;
            let acc = data.result[0];
            setUser({
                id: parseInt(acc.id),
                name: acc.name,
                auth: true,
                role: parseInt(acc.role)
            })
        })
    }, []);//compDidMount
    let modalComp = null;
    let ss = modal.split(" ");
    let str = "";
    if (ss.length > 1) str = ss[0];
    else str = modal;
    switch (str) {
        case "createroom":
            modalComp = <CreateRoom />;
            break;
        case "createvoting":
            modalComp = <CreateVoting />;
            break;
        case "historyroom":
            modalComp = <HistoryRoom />
            break;
    }
    return (
        <div className='d-flex w-100 h-100 justify-content-center align-items-center position-absolute'>
            {!user.auth && <Auth />}
            {user.auth &&
                <>
                    <Chat />
                    {modalComp}
                </>
            }
        </div>
    )
}

