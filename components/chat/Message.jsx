import React from 'react';

export default class Message extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={`d-flex flex-row message ${this.props.myMsg ? 'justify-content-end' : 'justify-content-start'}`}>
                <div className='d-flex flex-column'>
                    <div className='d-flex flex-row messageAuthor'>
                        <span>{this.props.name}</span>
                    </div>
                    <div className='d-flex flex-row messageInfo'>
                        {this.props.info}
                    </div>
                    <div className={`d-flex flex-row messageText ${this.props.myMsg ? 'my-message' : 'other-message'}`}>
                        {this.props.text}
                    </div>
                </div>
            </div>
        )
    }
}