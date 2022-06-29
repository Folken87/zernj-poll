import React from 'react';
import socket from '../../context/socket';
import VotingAnswer from './VotingAnswer';

export default class Voting extends React.Component {
    constructor(props) {
        super(props);
        //this.props.votingId
        //this.props.userId
        // this.state = {
        //     name: "Название голосования",
        //     voted: false,
        //     answers: [
        //         // {
        //         //     id: 0,
        //         //     text: "11111",
        //         //     count: 1
        //         // },
        //         // {
        //         //     id: 1,
        //         //     text: "22222",
        //         //     count: 2
        //         // },
        //     ],
        //     sum: 0
        // }
    }
    setAnswer(id) {
        socket.emit("setAnswer", {
            userId: this.props.userId,
            voteId: this.props.votingId,
            answerId: id
        })
    }
    // componentDidMount() {
    //     console.log("================")
    //     socket.emit("getVoting", {
    //         id: this.props.votingId,
    //         userId: this.props.userId
    //     })
    // }
    render() {
        return (
            <div className={`d-flex flex-row message justify-content-center voting`}>
                <div className='d-flex flex-column align-items-center'>
                    <h5>{this.props.name}{this.props.sum}</h5>
                    <p>Варианты ответов:</p>
                    {this.props.answers.map((el, index) => {
                        return <VotingAnswer
                            key={index + 200}
                            voted={this.props.voted}
                            text={el.text}
                            percent={el.count / (this.props.sum / 100)}
                            count={el.count}
                            setAnswer={() => this.setAnswer(el.id)}
                        />
                    })}
                </div>
            </div>
        )
    }
}