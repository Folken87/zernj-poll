import React from 'react';
import socket from '../../context/socket';
import VotingAnswer from './VotingAnswer';

export default class Voting extends React.Component {
    constructor(props) {
        super(props);
        //this.props.votingId
        //this.props.userId
        this.state = {
            name: "Название голосования",
            voted: false,
            answers: [
                // {
                //     id: 0,
                //     text: "11111",
                //     count: 1
                // },
                // {
                //     id: 1,
                //     text: "22222",
                //     count: 2
                // },
            ],
            sum: 0
        }
    }
    setAnswer(id) {
        socket.emit("setAnswer", {
            userId: this.props.userId,
            voteId: this.props.votingId,
            answerId: id
        })
    }
    componentDidMount() {
        socket.on("loadVoting", data => {
            console.log(data);
            let voted = data.voted;
            let rows = data.rows;
            this.state.answers = [];
            rows.forEach(el => {
                this.state.name = el.nameVote;
                this.state.answers.push({
                    id: el.id,
                    text: el.answerValue,
                    count: el.count
                })
            });
            this.setState({
                name: this.state.name,
                voted: voted,
                answers: this.state.answers
            })
        });
        console.log("================")
        socket.emit("getVoting", {
            id: this.props.votingId,
            userId: this.props.userId
        })
    }
    render() {
        return (
            <div className={`d-flex flex-row message justify-content-center voting`}>
                <div className='d-flex flex-column align-items-center'>
                    <h5>{this.state.name}{this.props.votingId}</h5>
                    <p>Варианты ответов:</p>
                    {this.state.answers.map((el, index) => {
                        return <VotingAnswer
                            key={index + 200}
                            voted={this.state.voted}
                            text={el.text}
                            percent={el.count / (3 / 100)}
                            setAnswer={() => this.setAnswer(el.id)}
                        />
                    })}
                </div>
            </div>
        )
    }
}