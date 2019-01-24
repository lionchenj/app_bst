import * as React from 'react';
import { Location } from "history";
import { Redirect, Link } from "react-router-dom";
import { Flex, List, InputItem, Button, Toast } from "antd-mobile";

// import  createForm  from "rc-form";

// import logo from "../../assets/logo.png"


import './Login.css'
import { Util } from '../../utils/Util';
import { UserService } from '../../service/UserService';


export interface LoginProps {
    location: Location<any> | undefined
}

interface LoginState {
    redirectToReferrer: boolean,
    redirectToRegister: boolean,
}

export class Login extends React.Component<LoginProps, LoginState> {
    phone: string
    password: string
    constructor(props: LoginProps) {
        super(props)
        this.state = {
            redirectToReferrer: false,
            redirectToRegister: false
        }
    }

    navToRegister = () => {
        this.setState( {
            redirectToReferrer: false,
            redirectToRegister: true
        })
    }

    onPhoneBlur = (value: string) => {
        this.phone = value
    }

    onPasswordBlur = (value: string) => {
        this.password = value
    }

    onSubmit = () => {
        const info = "请输入11位手机号码"
        const passwordInfo = "请输入不少于6位长度的密码"

        if (!this.phone) {
            Toast.info(info)
            return
        }
        const trimPhone = Util.trim(this.phone)
        if (!Util.validPhone(trimPhone)) {
            Toast.info(info)
            return
        }

        if (!this.password) {
            Toast.info(passwordInfo)
            return
        }
        const trimPassword = Util.trim(this.password)
        if (!Util.validPassword(trimPassword)){
            Toast.info(passwordInfo)
            return
        }

        UserService.Instance.login(trimPhone, trimPassword).then( ()=>{
            this.setState({
                ...this.state,
                redirectToReferrer: true
            })
        }).catch( err => {
            const message = (err as Error).message
            Toast.fail(message)
        })
    }

    public componentDidCatch(error: any, info: any) {
        console.log("componentDidCatch", error, info)
    }

    public render() {
        const { redirectToReferrer, redirectToRegister} = this.state
        if (redirectToReferrer) {
            const to = {
                pathname: "/"
            }
            return <Redirect to={to} />
        }
        if (redirectToRegister) {
            const to = {
                pathname: "/register"
            }
            return <Redirect to={to} />
        }

        
        return (
            <div className="login-container">
                <Flex direction="column">
                    <div className="header">
                        <div>
                            <div className="logo" ></div>
                        </div>
                        <div className="app-title"></div>
                        <div className="app-subtitle" ></div>
                    </div> 
                    <div className="content">
                        <List className="content-item-border">
                            <InputItem type="number" maxLength={11} placeholder="请输入手机号" onBlur={this.onPhoneBlur}>
                                <div className="phone-image"/>
                            </InputItem>
                        </List>
                        <List className="content-item-border">
                            <InputItem type="password" placeholder="请输入登录密码" onBlur={this.onPasswordBlur}>
                                <div className="password-image"/>
                            </InputItem>
                        </List>
                        <List className="content-item">
                            <Link to="/update_pwd" className="forget-link" >忘记密码</Link>
                        </List>
                        <List className="content-item">
                            <Button className="login-button" onClick={this.onSubmit} >登录</Button>
                        </List>
                        <List className="content-item">
                            <Button type="ghost" className="register-button" onClick={this.navToRegister} >注册</Button>
                        </List>
                    </div>
                    
                </Flex>
            </div>

        )
    }
}



