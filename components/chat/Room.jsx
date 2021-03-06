import React from 'react';


export default class Room extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='d-flex flex-row w-100 room' onClick={this.props.onClick}>
                <div className='d-flex flex-column col-3'></div>
                <div className='d-flex flex-column col-9'>
                    <div className='d-flex flex-row'>{this.props.name}
                        {
                            this.props.cntMsg > 0 && (
                                <span class="badge bg-secondary">{this.props.cntMsg}</span>
                            )
                        }
                    </div>
                    <div className='d-flex flex-row'></div>
                </div>
            </div>
        )
    }
}