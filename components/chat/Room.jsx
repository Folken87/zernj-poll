import React from 'react';


export default class Room extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className='d-flex flex-row w-100 room'>
                <div className='d-flex flex-column col-3'></div>
                <div className='d-flex flex-column col-9'>
                    <div className='d-flex flex-row'>{this.props.name}</div>
                    <div className='d-flex flex-row'></div>
                </div>
            </div>
        )
    }
}