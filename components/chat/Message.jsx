import React from 'react';

export default class Message extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className='d-flex flex-row'>
                <div className='d-flex flex-column col-12'>
                    <div className='d-flex flex-row messageInfo'>
                        {this.props.info}
                    </div>
                    <div className='d-flex flex-row messageText'>
                        {this.props.text}
                    </div>
                </div>
            </div>
        )
    }
}