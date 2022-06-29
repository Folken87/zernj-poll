import React from 'react';
import socket from '../../context/socket';

export default class CreateRoom extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }
    createNewRoom() {
        socket.emit("createRoom", {
            userId: this.props.userId,
            roomName: this.inputRef.current.value
        });
        this.props.switchModal("");
    }
    render() {
        return (
            <div className='modalGlobal'>
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Создание новой комнаты</h5>
                    </div>
                    <div class="modal-body">
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="inputGroup-sizing-default">Название комнаты</span>
                            <input ref={this.inputRef} type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={() => this.props.switchModal("")}>Отмена</button>
                        <button type="button" class="btn btn-primary" onClick={() => this.createNewRoom()}>Создать</button>
                    </div>
                </div>
            </div>
        )
    }
}