import React from 'react';

export default class VotingAnswer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="progress">
                {
                    this.props.voted ? (
                        <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                            style={{
                                width: this.props.percent + '%',
                                cursor: this.props.voted ? "none" : "pointer"
                            }}
                            
                        >
                            {this.props.text}
                        </div>
                    ) : (
                        <span onClick={() => this.props.setAnswer()}>{this.props.text}</span>
                    )
                }

            </div>
        )
    }
}