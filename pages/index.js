import React from 'react';
import socket from '../context/socket';
import 'bootstrap/dist/css/bootstrap.css';

import Auth from '../components/Auth/Auth';
import Chat from '../components/chat/Chat';
import CreateRoom from '../components/chat/CreateRoom';
import CreateVoting from '../components/chat/CreateVoting';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            id: -1,
            name: "",
            modal: ""
        }
    }
    componentDidMount() {
        socket.on("loadAuth", data => {
            console.log(data);
            if (data.result.length == 0) return false;
            let acc = data.result[0];
            this.setState({
                id: acc.id,
                name: acc.name,
                auth: true
            })
        })
    }
    switchModal(str) {
        console.log(str);
        this.setState({
            modal: str
        })
    }
    render() {
        let modal = null;
        let ss = this.state.modal.split(" ");
        let str = "";
        if (ss.length > 1) str = ss[0];
        else str = this.state.modal;
        switch (str) {
            case "createroom":
                modal = <CreateRoom userId={this.state.id} switchModal={(e) => this.switchModal(e)} />;
                break;
            case "createvoting":
                modal = <CreateVoting userId={this.state.id} roomId={parseInt(ss[1])} switchModal={(e) => this.switchModal(e)} />;
                break;
        }
        return (
            <div className='d-flex w-100 h-100 justify-content-center align-items-center position-absolute'>
                {!this.state.auth && <Auth setAuth={() => this.setAuth()} />}
                {this.state.auth &&
                    <>
                        <Chat userId={this.state.id} switchModal={(e) => this.switchModal(e)} />
                        {modal}
                    </>
                }
            </div>
        )
    }
}