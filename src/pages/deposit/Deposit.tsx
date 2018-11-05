import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, ImagePicker,Modal} from "antd-mobile";
import { History } from "history";
import { UIUtil } from '../../utils/UIUtil';
import { UserService } from '../../service/UserService';
import { model } from '../../model/model';
//import { Redirect } from "react-router-dom";
import "./Deposit.css"


interface DepositProps {
    history: History
}

interface DepositState {
    codeCountDown: number,
    purseAddress?: model.PurseAddress
    files: any[]
}


export class Deposit extends React.Component<DepositProps, DepositState> {
    codeCountDownTimer: number
    depositNumber?: string
    image?: string
    code?: string
    constructor(props: DepositProps) {
        super(props)
        this.codeCountDownTimer = 0
        this.state = {
            codeCountDown: 0,
            files: [],
        }
    }


    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    onChange = (files: any[], type: any, index: number) => {
        console.log(files, type, index);
        this.setState({
          files,
        });
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
            })

        })
    }

    componentDidMount() {
        UserService.Instance.getPurseAddress().then( (purseAddress) => {
            this.setState({
                purseAddress: purseAddress
            })
        }).catch( err => {
            UIUtil.showError(err)
        })
    }

    onNumberBlur = (value: string) => {
        this.depositNumber = value
    }
    
    onCodeBlur = (value: string) => {
        this.code = value
    }

    onSubmit = () => {
        const depositNumberInfo = "请输入转币数量"
        const imageInfo = "请上传转币凭证"
        const codeInfo = "请输入验证码"
        if (this.state.files.length == 0) {
            UIUtil.showInfo(imageInfo)
            return 
        }

        if (!this.depositNumber) {
            UIUtil.showInfo(depositNumberInfo)
            return 
        }

        if (!this.code) {
            UIUtil.showInfo(codeInfo)
            return 
        }

        UserService.Instance.deposit(this.code, this.depositNumber, this.state.files[0].file ).then( () => {
            Modal.alert('提示','充币成功',[{ text:'ok',onPress: () => {
                this.props.history.goBack()
            }, style: 'default' }])
        }).catch( err => {
            UIUtil.showError(err)
        })
    }




    public render() {
        return (
            <div className="change-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">充币</div>
                </NavBar>
                <List className="change-list">
                    <InputItem placeholder="10个以上" onBlur={this.onNumberBlur} type="number" >预充EOS个数</InputItem>
                    <InputItem value={this.state.purseAddress&&this.state.purseAddress.eosAddress}  editable={false}>充币地址</InputItem>
                </List>
                <WhiteSpace size='md' />

                {/* <List className="change-list">
                    <InputItem value="10" editable={false}>可用激活卡数量</InputItem>
                </List>
                <WhiteSpace size='md' /> */}
                
                <div className="feedback-images-container">
                    <div className="deposit-images-text"> 充币凭证（大小不超过1M)</div>
                    <ImagePicker
                        length="1"
                        files={this.state.files}
                        onChange={this.onChange}
                        onImageClick={(index, fs) => console.log(index, fs)}
                        selectable={this.state.files.length < 1}
                        multiple={false}
                        />
                </div>
                
                <WhiteSpace size='md' />
                <List className="change-list">
                    <InputItem placeholder="请输入短信验证码"  onBlur={this.onCodeBlur}
                        onExtraClick={ this.state.codeCountDown > 0 ? undefined : this.getCode}
                        extra={<Button disabled={this.state.codeCountDown > 0} type="ghost" size="small" className="address-code-button">{ this.state.codeCountDown > 0 ? this.state.codeCountDown: "获取验证码"}</Button>}
                    >验证码</InputItem>
                </List>
                <WhiteSpace size='md' />
                <div className="deposit-footer">
                    注意：<br/><br/>
                    1.  这是注意的内容第一条<br/>
                    2. 这是注意的内容第二条
                </div>
                <WhiteSpace size="lg" />
                <div className="address-footer-button-container"><Button onClick={this.onSubmit}>确认</Button></div>
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