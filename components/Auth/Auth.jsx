import React from 'react';
import socket from '../../context/socket';

export default class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0,
            login: "",
            password: ""
        }
    }
    switchCurrentTab() {
        this.setState({
            currentTab: this.state.currentTab == 0 ? 1 : 0
        })
    }

    changeLogin(value) {
        this.setState({
            login: value
        })
    }
    changePassword(value) {
        this.setState({
            password: value
        })
    }
    clickLogin() {
        socket.emit("auth", [this.state.login, this.state.password]);
    }
    clickRegister() {
        socket.emit("registration", [this.state.login, this.state.password]);
    }

    render() {
        return (
            <div className='d-flex flex-column authForm'>

                <div className="d-flex flex-row">
                    <div className='d-flex flex-column col-6 customTab' onClick={() => this.switchCurrentTab()}>Авторизация</div>
                    <div className='d-flex flex-column col-6 customTab' onClick={() => this.switchCurrentTab()}>Регистрация</div>
                </div>
                <div className="d-flex flex-column h-100 p-3 justify-content-center align-items-center">
                    {this.state.currentTab == 0 ?
                        <>
                            <input key={0} autoComplete="new-password" type="text" name="" className="form-control" placeholder="Логин" onChange={(e) => this.changeLogin(e.target.value)} />
                            <input key={1} autoComplete="new-password" type="password" name="" className="form-control" placeholder="Пароль" onChange={(e) => this.changePassword(e.target.value)} />
                            <button className="btn btn-dark btn-block" onClick={() => this.clickLogin()}>Авторизоваться</button>

                        </> :
                        <>
                            <input key={2} autoComplete="new-password" type="text" name="" className="form-control" placeholder="Логин" onChange={(e) => this.changeLogin(e.target.value)} />
                            <input key={3} autoComplete="new-password" type="password" name="" className="form-control" placeholder="Пароль" onChange={(e) => this.changePassword(e.target.value)} />
                            <input key={4} autoComplete="new-password" type="password" name="" className="form-control" placeholder="Повторите пароль" />
                            <button className="btn btn-dark btn-block" onClick={() => this.clickRegister()}>Зарегистрироваться</button>
                        </>}
                </div>
            </div>
        )
    }
}