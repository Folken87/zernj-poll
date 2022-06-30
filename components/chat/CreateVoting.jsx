import React, { useState } from 'react';
import socket from '../../context/socket';
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

export default function CreateVoting() {
    const [user, setUser] = useAtom(userAtom);
    const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom);
    const [modal, setModal] = useAtom(modalAtom);
    const [answers, setAnswers] = useState([
        {
            text: ""
        },
        {
            text: ""
        }
    ]);
    const [votingName, setVotingName] = useState("");

    function addNewAnswer() {
        answers.push({
            text: ""
        })
        setAnswers(answers)
    }
    function updateAnswerText(e, index) {
        answers[index].text = e.target.value;
        setAnswers(answers)
    }
    function createNewVoting() {
        if (votingsAtom.length == 0) return false;
        if (answers.findIndex(el => el.text.length == 0) !== -1) return false;
        socket.emit("createVoting", {
            roomId: currentRoom,
            userId: user.id,
            name: votingName,
            answers: answers
        })
        setModal("")
    }
    return (
        <div className='modalGlobal'>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Создание голосования</h5>
                </div>
                <div className="modal-body">
                    <div className="input-group mb-3">
                        <span className="input-group-text"
                            id="inputGroup-sizing-default">Название</span>
                        <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" onChange={(e) => setVotingName(e.target.value)} />
                    </div>
                    {
                        answers.map((el, index) => {
                            return (
                                <input key={index} type="text" className="form-control mb-1" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" onChange={(e) => updateAnswerText(e, index)} />
                            )
                        })
                    }
                    <button type="button" className="btn btn-success btn-sm bold mt-1 mb-1" onClick={() => addNewAnswer()}>+</button>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setModal("")}>Отмена</button>
                    <button type="button" className="btn btn-primary" onClick={() => createNewVoting()}>Создать</button>
                </div>
            </div>
        </div>
    )
}