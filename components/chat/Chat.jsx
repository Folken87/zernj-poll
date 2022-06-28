import React from 'react';
import socket from '../../context/socket';

import Room from './Room';
import RoomChat from './roomChat';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: [
                {
                    img: "",
                    name: "Room 1"
                },
                {
                    img: "",
                    name: "Room 2"
                },
                {
                    img: "",
                    name: "Room 2"
                },
            ]
        }
    }
    componentDidMount() {
        socket.on('now', data => {
            this.setState({
                message: data.message
            })
        })
    }

    render() {
        return (
            <div className="container d-flex flex-row customChat">
                <div className='d-flex flex-column col-3 pe-2'>
                    <div className='d-flex flex-row mb-2'>
                        <div class="input-group">
                            <span class="input-group-text" id="basic-addon1">@</span>
                            <input type="text" class="form-control" placeholder="Поиск..." aria-label="Поиск..." aria-describedby="basic-addon1" />
                        </div>
                    </div>
                    <div className='d-flex flex-row roomList flex-wrap align-content-start'>
                        <React.Fragment>
                            {
                                this.state.rooms.map((el, i) => {
                                    return <Room img={el.img} name={el.name} />
                                })
                            }
                        </React.Fragment>
                    </div>
                </div>
                <div className='d-flex flex-column col-9 roomChat'>
                    <RoomChat />
                </div>
            </div>
        )
    }
}

export default Chat;