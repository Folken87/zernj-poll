import React, { useEffect } from 'react';
import socket from '../../context/socket';
import { useAtom } from 'jotai';

import Room from './Room';
import RoomChat from './roomChat';
import {
    currentRoomAtom,
    roomsAtom,
    filterRoomsAtom,
    userAtom,
    modalAtom,
    messagesAtom,
    votingsAtom
} from '../../store/store';

export default function Chat() {
    const [user, setUser] = useAtom(userAtom);
    const [modal, setModal] = useAtom(modalAtom);
    const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom);
    const [rooms, setRooms] = useAtom(roomsAtom);
    const [filterRooms, setFilterRooms] = useAtom(filterRoomsAtom);
    const [messages, setMessages] = useAtom(messagesAtom);
    const [votings, setVotings] = useAtom(votingsAtom);
    function scrollChatToBottom() {
        console.log("SCROLL SCROLL");
        const obj = document.getElementById("roomChatBody");
        obj.scrollTop = obj.scrollHeight;
        console.log(obj);
        console.log(obj.scroll(0, obj.scrollHeight))
        console.log(obj.scrollHeight)
        // obj.scrollTo(0, obj.scrollHeight)
    }
    // useEffect(() => {
    //     try {
    //         scrollChatToBottom();
    //     } catch (error) {

    //     }
    // }, [messages.length])

    socket.off("newMessage");
    socket.on("newMessage", data => {
        let res = data.result[0];
        let room1 = rooms.findIndex(el => el.id === res.room);
        if (room1 !== -1 && currentRoom === res.id) {
            if (rooms[room1].cntMsg) {
                rooms[room1].cntMsg++;
            } else {
                rooms[room1].cntMsg = 0;
            }
            setRooms(rooms);
        }
        if (parseInt(data.result[0].room) !== parseInt(currentRoom)) return false;

        // messages.push(data.result[0]);
        setMessages([data.result[0], ...messages]);
    })
    // socket.emit("getRooms", []);
    useEffect(() => {
        socket.emit("getRooms", []);
    }, [])
    function selectChat(id) {
        if (currentRoom === -1 && id !== -1) {
            socket.emit("joinRoom", {
                roomId: id,
                userId: user.id,
                name: user.name
            })
            socket.emit("getRoomUsers", {
                roomId: id
            })
            socket.emit("getMessages", id);
        } else if (currentRoom !== -1 && id === -1) {
            socket.emit("leaveRoom", {
                roomId: currentRoom,
                userId: user.id,
                name: user.name
            })
        } else if (currentRoom !== -1 && id !== -1) {
            socket.emit("joinRoom", {
                roomId: id,
                userId: user.id,
                name: user.name
            })
            socket.emit("leaveRoom", {
                roomId: currentRoom,
                userId: user.id,
                name: user.name
            })
        }
        // console.log(id + " " + currentRoom);
        setCurrentRoom(id !== currentRoom ? id : -1);
        // console.log(id + " " + currentRoom);
        setMessages([]);
        setVotings([]);
    }

    let room = currentRoom !== -1 ? rooms.find((el) => el.id == currentRoom) : null;
    return (
        <div className="container d-flex flex-row customChat">
            <div className='d-flex flex-column col-3 pe-2'>
                <div className='d-flex flex-row mb-2'>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">@</span>
                        <input type="text" className="form-control" placeholder="Поиск..." aria-label="Поиск..." aria-describedby="basic-addon1" />
                    </div>
                </div>
                <div className='d-flex flex-row'>
                    <div className='d-flex flex-column col-6'>
                        <button type="button" className={`btn btn-outline-success ${!filterRooms && 'active'}`} onClick={() => setFilterRooms(false)}>Все комнаты</button>
                    </div>
                    <div className='d-flex flex-column col-6'>
                        <button type="button" className={`btn btn-outline-success ${filterRooms && 'active'}`} onClick={() => setFilterRooms(true)}>Мои комнаты</button>
                    </div>
                </div>
                <div className='d-flex flex-row roomList flex-wrap align-content-start'>
                    <React.Fragment>
                        {
                            rooms.filter((el) => filterRooms ? (parseInt(el.owner) === user.id) : true).map((el, i) => {
                                return <Room key={i + 100} img={el.img} name={el.name} onClick={() => selectChat(el.id)} cntMsg={el.cntMsg ? el.cntMsg : 0} />
                            })
                        }
                    </React.Fragment>
                </div>
                <div className="d-flex flex-row justify-content-center">
                    <button type="button" className="btn btn-success" onClick={() => setModal("createroom")}>Создать комнату</button>
                </div>
            </div>
            <div className='d-flex flex-column col-9 roomChat'>
                {currentRoom !== -1
                    &&
                    <RoomChat key={currentRoom} name={room ? room.name : "----"} />
                }
            </div>
        </div>
    )
}