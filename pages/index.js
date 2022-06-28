import React from 'react';
import socket from '../context/socket';
import 'bootstrap/dist/css/bootstrap.css';

import Chat from '../components/chat/Chat';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='d-flex w-100 h-100 justify-content-center align-items-center position-absolute'>
                <Chat />
            </div>
        )
    }
}