import React from 'react';
import socket from '../../context/socket';

import Room from './Room';
import RoomChat from './roomChat';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRoom: -1,
            rooms: []
        }
    }
    componentDidMount() {
        socket.on("newMessage", data => {
            console.log(data);
            let res = data.result[0];
            let room = this.state.rooms.findIndex(el => el.id === res.room);
            if (room === -1) return false;
            if (this.state.currentRoom === res.id) return false;
            if (this.state.rooms[room].cntMsg) {
                this.state.rooms[room].cntMsg++;
            } else {
                this.state.rooms[room].cntMsg = 0;
            }
            this.setState({
                rooms: this.state.rooms
            })
        })
        socket.on("loadRooms", data => {
            this.setState({
                rooms: data.rooms
            })
        })
        socket.emit("getRooms", []);
    }
    selectChat(id) {
        this.setState({
            currentRoom: id !== this.state.currentRoom ? id : -1
        });
    }

    render() {
        let room = this.state.currentRoom !== -1 ? this.state.rooms.find((el) => el.id == this.state.currentRoom) : null;
        return (
            <div className="container d-flex flex-row customChat">
                <div className='d-flex flex-column col-3 pe-2'>
                    <div className='d-flex flex-row mb-2'>
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon1">@</span>
                            <input type="text" className="form-control" placeholder="Поиск..." aria-label="Поиск..." aria-describedby="basic-addon1" />
                        </div>
                    </div>
                    <div className='d-flex flex-row roomList flex-wrap align-content-start'>
                        <React.Fragment>
                            {
                                this.state.rooms.map((el, i) => {
                                    return <Room key={i + 100} img={el.img} name={el.name} onClick={() => this.selectChat(el.id)} cntMsg={el.cntMsg ? el.cntMsg : 0} />
                                })
                            }
                        </React.Fragment>
                    </div>
                    <div className="d-flex flex-row justify-content-center">
                        <button type="button" class="btn btn-success" onClick={() => this.props.switchModal("createroom")}>Создать комнату</button>
                    </div>
                </div>
                <div className='d-flex flex-column col-9 roomChat'>
                    {this.state.currentRoom !== -1
                        &&
                        <RoomChat key={room.id} roomId={room.id} userId={this.props.userId} name={room.name} />
                    }
                </div>
            </div>
        )
    }
}

export default Chat;