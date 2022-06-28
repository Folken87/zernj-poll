import React from 'react';
import socket from '../context/socket';

import Chat from '../components/Chat';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Chat />
            </div>
        )
    }
}