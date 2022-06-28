import React from 'react';
import socket from '../../context/socket';

import Room from './Room';
import RoomChat from './roomChat';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRoom: -1,
            rooms: [
                // {
                //     id: 0,
                //     img: "",
                //     name: "Room 1",
                // },
                // {
                //     id: 1,
                //     img: "",
                //     name: "Room 2"
                // },
                // {
                //     id: 2,
                //     img: "",
                //     name: "Room 3"
                // },
            ]
        }
    }
    componentDidMount() {
        // socket.on('now', data => {
        //     this.setState({
        //         message: data.message
        //     })
        // })
        socket.on("loadRooms", data => {
            console.log(data.rooms);
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
                                    return <Room img={el.img} name={el.name} onClick={() => this.selectChat(el.id)} />
                                })
                            }
                        </React.Fragment>
                    </div>
                </div>
                <div className='d-flex flex-column col-9 roomChat'>
                    {this.state.currentRoom !== -1
                        &&
                        <RoomChat name={room.name} />
                    }
                </div>
            </div>
        )
    }
}

export default Chat;