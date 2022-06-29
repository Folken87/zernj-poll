import React from 'react';
import socket from '../../context/socket';

export default class CreateVoting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: [
                {
                    text: ""
                },
                {
                    text: ""
                }
            ]
        }
        this.inputRef = React.createRef();
    }
    addNewAnswer() {
        this.state.answers.push({
            text: ""
        })
        this.setState({
            answers: this.state.answers
        })
    }
    updateAnswerText(e, index) {
        this.state.answers[index].text = e.target.value;
        this.setState({
            answers: this.state.answers
        })
    }
    createNewVoting() {
        if (this.inputRef.current.value.length == 0) return false;
        if (this.state.answers.findIndex(el => el.text.length == 0) !== -1) return false;
        socket.emit("createVoting", {
            roomId: this.props.roomId,
            userId: this.props.userId,
            name: this.inputRef.current.value,
            answers: this.state.answers
        })
        this.props.switchModal("")
    }
    render() {
        return (
            <div className='modalGlobal'>
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Создание голосования</h5>
                    </div>
                    <div class="modal-body">
                        <div class="input-group mb-3">
                            <span class="input-group-text"
                                id="inputGroup-sizing-default">Название</span>
                            <input ref={this.inputRef} type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                        </div>
                        {
                            this.state.answers.map((el, index) => {
                                return (
                                    <input type="text" class="form-control mb-1" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" onChange={(e) => this.updateAnswerText(e, index)} />
                                )
                            })
                        }
                        <button type="button" class="btn btn-success btn-sm bold mt-1 mb-1" onClick={() => this.addNewAnswer()}>+</button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={() => this.props.switchModal("")}>Отмена</button>
                        <button type="button" class="btn btn-primary" onClick={() => this.createNewVoting()}>Создать</button>
                    </div>
                </div>
            </div>
        )
    }
}