import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Modal} from "antd-mobile";
import { History, Location } from "history";
import qs from "qs";

import { UserService } from '../../service/UserService';
import { model } from '../../model/model';

import { UIUtil } from '../../utils/UIUtil';

interface NoContractProps {
    location: Location,
    history: History
}

interface NoContractState {
    codeCountDown: number,
    usableCoin?: model.UsableCoin,
    text: string,
    phone: string,
    userInfo?: model.User,
    remarksInfo: any
    turnService:string
}

const bodyHeight = (window.innerHeight/100 - 0.9) + 'rem';
export class NoContract extends React.Component<NoContractProps,NoContractState> {
    codeCountDownTimer: number
    changeNumber: string
    name: string
    code: string
    constructor(props: NoContractProps) {
        super(props)
        this.codeCountDownTimer = 0
        this.state = {
            phone: '',
            codeCountDown: 0,
            text: '',
            remarksInfo: '',
            turnService:"0"
        }
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    getCode = () => {
        if (this.state.codeCountDown > 0) {
            return 
        }
        UIUtil.showLoading("正在发送验证码")
        UserService.Instance.getUserInfo().then( (userInfo) => {
            const phone = userInfo.mobile
            UserService.Instance.getMobileMassges(phone).then( ()=> {
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
            }).catch( (err)=> {
                UIUtil.showError(err)
                if(err.errno ==="401"){
                    this.props.history.push("/login")
                  }
            })
        })
    }

    onNumberBlur = (value: string) => {
        this.changeNumber = value
    }
    
    onPhoneBlur = (value: string) => {
        this.setState({
            phone : value
        })
    }

    onRemarksBlur = (value: string) => {
        this.setState({
            remarksInfo : value
        })
    }

    onNameBlur = (value: string) => {
        this.name = value
    }

    onCodeBlur = (value: string) => {
        this.code = value
    }

    
    onGolog = () =>{
        this.props.history.push("/noContractHistory")
    }
    getInfo = () => {
        UserService.Instance.getUserInfo().then( (userInfo) => {
            this.setState({
                userInfo: userInfo
            })
        })
    }
    onQuicken = () => {
        const codeInfo = "请输入验证码";
        if (!this.code) {
            UIUtil.showInfo(codeInfo)
            return
        }
        UIUtil.showLoading("解除中");
        UserService.Instance.quicken(this.code).then(() => {
            UIUtil.hideLoading();
            Modal.alert('提示', '解除成功', [{
                text: 'ok', onPress: () => {
                    this.props.history.goBack()
                }, style: 'default'
            }])
        }).catch(err => {
            UIUtil.showError(err)
            if(err.errno ==="401"){
                this.props.history.push("/login")
              }
        })
    }
    public componentDidMount () {
        
        const query = qs.parse(this.props.location.search, {
            ignoreQueryPrefix: true
        })
        if (query.mobile) {
            this.setState({
                phone : query.mobile
            })
        }
        this.getInfo();
    }

    public render() {
        
        return (
            <div className="change-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    rightContent={[
                        <div className="change-navbar-right" onClick={this.onGolog}></div>
                    ]}
                    className="home-navbar" >
                        <div className="nav-title">解除合约</div>
                </NavBar>
                
                    <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                        <WhiteSpace size="lg"/>

                        <List className="change-list">
                            <InputItem placeholder="请输入短信验证码" onBlur={this.onCodeBlur}
                                onExtraClick={ this.state.codeCountDown > 0 ? undefined : this.getCode}
                                extra={<Button disabled={this.state.codeCountDown > 0} type="ghost" size="small" className="address-code-button" >{ this.state.codeCountDown > 0 ? this.state.codeCountDown: "获取验证码"}</Button>}
                            >
                            验证码</InputItem>
                        </List>
                        <WhiteSpace size="lg" />

                        <div className="address-footer-button-container"><Button onClick={this.onQuicken} >解除合约</Button></div>
                    </div>
                {/* </Tabs> */}
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