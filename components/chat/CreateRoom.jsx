import React, { useState } from 'react';
import socket from '../../context/socket';
import { useAtom } from 'jotai';

import {
    userAtom,
    modalAtom,
} from '../../store/store';

export default function CreateRoom() {
    const [user, setUser] = useAtom(userAtom);
    const [roomName, setRoomName] = useState("");
    const [modal, setModal] = useAtom(modalAtom);
    function createNewRoom() {
        socket.emit("createRoom", {
            userId: user.id,
            roomName: roomName
        });
        setModal("");
    }
    return (
        <div className='modalGlobal'>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Создание новой комнаты</h5>
                </div>
                <div className="modal-body">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-default">Название комнаты</span>
                        <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" onChange={(e) => setRoomName(e.target.value)} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setModal("")}>Отмена</button>
                    <button type="button" className="btn btn-primary" onClick={() => createNewRoom()}>Создать</button>
                </div>
            </div>
        </div>
    )
}