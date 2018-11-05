import * as React from 'react';
import { Flex, List, InputItem, Button, NavBar, Icon, Toast, Modal } from "antd-mobile";
import { Redirect } from "react-router-dom";
import { History, Location } from "history";
import qs from "qs";
// import logo from "../../assets/logo.png"

import './Register.css'
import { UserService } from '../../service/UserService';
import { Util } from '../../utils/Util';
import { UIUtil } from '../../utils/UIUtil';

interface Props {
    location: Location,
    history: History
}

interface RegisterState {
    redirectToLogin: boolean,
    
    codeCountDown: number,
}

export class Register extends React.Component<Props, RegisterState> {
    codeCountDownTimer: number
    phone?: string
    code?: string
    sharePhone?: string
    password?: string

    constructor(props: Props) {
        super(props)
        this.codeCountDownTimer = 0
        this.state = {
            redirectToLogin: false,
            codeCountDown: 0
        }
    }

    navBack = () => {
        this.setState({
            ...this.state,
            redirectToLogin: true
        })
    }

    onPhoneBlur = (value: string) => {
        console.log("onPhoneBlur", value)
        this.phone = value
    }

    onCodeBlur = (value: string) => {
        this.code = value
    }

    onSharePhoneBlur = (value: string) => {
        this.sharePhone = value
    }

    onPasswordBlur = (value: string) => {
        this.password = value
    }

    onSubmit = () => {
        const info = "请输入11位手机号码"
        const codeInfo = "请输入验证码"
        const sharePhoneInfo = "分享人手机号码格式不正确"
        const passwordInfo = "请输入不少于6位长度的密码"
        if (!this.phone) {
            Toast.info(info)
            return
        } 
        const trimPhone = Util.trim(this.phone!)
        if (!Util.validPhone(trimPhone)){
            Toast.info(info)
            return
        }
        if (!this.code) {
            Toast.info(codeInfo)
            return
        }
        const trimCode = Util.trim(this.code!)
        let trimSharePhone = ""
        if (this.sharePhone) {
            trimSharePhone = Util.trim(this.sharePhone!)
            if (!Util.validPhone(trimSharePhone)) {
                Toast.info(sharePhoneInfo)
                return
            }
        }
        if (!this.password) {
            Toast.info(passwordInfo)
            return
        }
        const trimPassword = Util.trim(this.password!)
        if (!Util.validPassword(trimPassword)){
            Toast.info(passwordInfo)
            return 
        }

        // this.props.history.push("/idcard", {
        //     phone: trimPhone,
        //     code: trimCode,
        //     sharePhone: trimSharePhone,
        //     password: trimPassword
        // })

        UserService.Instance.register(trimPhone, trimCode, trimSharePhone, trimPassword).then( () => {
            const alert = Modal.alert
            alert('提示','注册成功',[{ text:'ok',onPress: () => console.log('ok'),style: 'default' }])
            this.setState({
                ...this.state,
                redirectToLogin: true
            })
        }).catch( err => {
            const message = (err as Error).message
            Toast.fail(message)
        })
        
    }

    getCode = () => {
        if (this.state.codeCountDown > 0) {
            return 
        }
        const phone =  this.phone
        const info = "请输入11位手机号码"
        if (!phone) {
            Toast.info(info)
            return
        }
        const trimPhone = Util.trim(phone)
        if (!Util.validPhone(trimPhone)) {
            Toast.info(info)
            return 
        }
        
        UIUtil.showLoading("正在发送验证码")
        UserService.Instance.getMobileMassges(trimPhone).then( ()=> {
            if (this.codeCountDownTimer != 0) {
                window.clearInterval(this.codeCountDownTimer!)
            }
            const info = "验证码发送成功"
            UIUtil.showInfo(info)
            this.setState({
                ...this.state,
                codeCountDown: 60
            }, () => {
                this.codeCountDownTimer = window.setInterval(this._codeCountDownHander, 1000)
            })
        }).catch( (err) => {
            UIUtil.showError(err)
        })
    }

    

    public render() {
        const { redirectToLogin} = this.state
    
        if (redirectToLogin) {
            const to = {
                pathname: "/login"
            }
            return <Redirect to={to} />
        }

        const query = qs.parse(this.props.location.search, {
            ignoreQueryPrefix: true
        })
        if (query.mobile) {
            this.sharePhone = query.mobile
        }

        return (
            <div className="login-container">
                <NavBar mode="light" icon={<Icon type="left" color="#fff" />} className="navbar" onLeftClick={this.navBack} ></NavBar>
                <Flex direction="column">
                    
                    <div className="register-header" >
                        <div>
                            <div className="logo"></div>
                        </div>
                        <div className="app-title"></div>
                        <div className="app-subtitle" ></div>
                    </div>
                    <div className="content">
                        <List className="content-item-border">
                            <InputItem name="phone" type="digit" maxLength={11}  placeholder="请输入手机号" onBlur={this.onPhoneBlur}>
                               
                            </InputItem>
                            
                            
                            
                        </List>
                        <List className="content-item-border">
                            <InputItem  type="number" placeholder="请输入短信验证码" onBlur={this.onCodeBlur}
                                extra={<Button disabled={this.state.codeCountDown > 0} type="ghost" size="small" className="code-button" >{ this.state.codeCountDown > 0 ? this.state.codeCountDown: "获取验证码"}</Button>}
                                onExtraClick={ this.state.codeCountDown > 0 ? undefined : this.getCode}
                            >
                              
                            </InputItem>
                        </List>
                        <List className="content-item-border">
                            <InputItem type="digit" maxLength={11} placeholder="请输入分享人手机号" onBlur={this.onSharePhoneBlur} defaultValue={query.mobile}
                                >
                               
                            </InputItem>
                            
                            
                            
                        </List>
                        <List className="content-item-border">
                            <InputItem type="password" placeholder="请输入登录密码" onBlur={this.onPasswordBlur}>
                              
                            </InputItem>
                        </List>
                      
                        <List className="content-item">
                            <Button className="login-button" onClick={this.onSubmit}>立即注册</Button>
                        </List>
                       
                    </div>
                    
                </Flex>
            </div>

        )
    }

    public componentWillUnmount() {
        this.codeCountDownTimer && window.clearInterval(this.codeCountDownTimer)
        this.codeCountDownTimer = 0
    }

    private _codeCountDownHander = () =>  {
        const newCodeCount = this.state.codeCountDown - 1
        if (newCodeCount <= 0) {
            this.codeCountDownTimer && window.clearInterval(this.codeCountDownTimer)
            this.codeCountDownTimer = 0
        }
        this.setState({
            ...this.state,
            codeCountDown: newCodeCount
        })
    }

    
}