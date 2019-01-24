import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, ActionSheet, Modal} from "antd-mobile";
import { History, Location } from "history";
import "./Change.css"

import qs from "qs";
// import QRCode from "qrcode.react";

import { UserService } from '../../service/UserService';
import { model } from '../../model/model';

import { UIUtil } from '../../utils/UIUtil';
import { Util } from '../../utils/Util';

interface ChangeProps {
    location: Location,
    history: History
}

interface ChangeState {
    codeCountDown: number,
    usableCoin?: model.UsableCoin,
    selectedCoinId: "1"|"2", // 币ID 1:EOS 2:VETH,
    text: string,
    phone: string,
    userInfo?: model.User,
    remarksInfo: any
    turnService:string
}
// const tabs = [
//     { title: '转入' },
//     { title: '转出' },
// ];
const bodyHeight = (window.innerHeight/100 - 0.9) + 'rem';
export class Change extends React.Component<ChangeProps, ChangeState> {
    codeCountDownTimer: number
    changeNumber: string
    name: string
    code: string
    constructor(props: ChangeProps) {
        super(props)
        this.codeCountDownTimer = 0
        this.state = {
            phone: '',
            codeCountDown: 0,
            selectedCoinId: "1",
            text: '18900000002',
            remarksInfo: '',
            turnService:"0"
        }
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    onSelectCoinId = () => {
        const buttons = ['EOS', 'VETH', '取消']
        ActionSheet.showActionSheetWithOptions({
            options: buttons,
            cancelButtonIndex: buttons.length - 1,
            maskClosable: true,
        }, (buttonIndex) => {
            if (buttonIndex != 0 && buttonIndex != 1) {
                return 
            }
            this.setState({
                selectedCoinId: (buttonIndex == 0 ) ? "1" : "2"
            })
            console.error("onSelectCoinId", buttonIndex)
        })
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

    onSubmit = (event: React.MouseEvent) => {
        event.preventDefault()

        const info = "请输入11位手机号码";
        const codeInfo = "请输入验证码";
        const remarksInfo = "请输入备注信息";
        // const numberInfo = "种子个数应为100的倍数"
        const numberInfo = "请输入种子个数";

        console.log(Number(this.changeNumber));
        // if (!this.changeNumber ||(Number(this.changeNumber) % 100 != 0)) {
        //     UIUtil.showInfo(numberInfo)
        //     return
        // }
        if (!this.changeNumber) {
            UIUtil.showInfo(numberInfo);
            return;
        }
        if (!this.state.phone) {
            UIUtil.showInfo(info);
            return;
        } 
        if (!this.state.remarksInfo) {
            UIUtil.showInfo(remarksInfo);
            return;
        }        
        const trimPhone = Util.trim(this.state.phone!);
        if (!Util.validPhone(trimPhone)){
            UIUtil.showInfo(info);
            return;
        }
        // if (!this.name) {
        //     UIUtil.showInfo(nameInfo)
        // }
        if (!this.code) {
            UIUtil.showInfo(codeInfo);
            return;
        }
        UIUtil.showLoading("转换中")
        UserService.Instance.give(this.state.selectedCoinId,this.changeNumber, trimPhone, this.code ,this.state.remarksInfo).then( () => {
            UIUtil.hideLoading();
            Modal.alert('提示','转种子成功',[{ text:'ok',onPress: () => {
                this.props.history.goBack();
            }, style: 'default' }])
        }).catch( err => {
            UIUtil.showError(err)
            if(err.errno=="401"||err.errno=="400"){
                this.props.history.push("/login");
  
              }
        })

    }
    onGolog = () =>{
        this.props.history.push("/changeHistory");
    }
    getInfo = () => {
        UserService.Instance.getUserInfo().then( (userInfo) => {
            this.setState({
                userInfo: userInfo
            })
        })
    }
    public componentDidMount () {
        //检测互转手续费
        UserService.Instance.getService().then((res:any) => {
            this.setState({
                turnService : res.give
            })
        }).catch(err=> {
            
            console.log(err);
            UIUtil.showError(err);
            // Modal.alert('提示',err)

        
        }); 
        
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
        // const refUrl = `https://www.bst123456.com/change?mobile=${this.state.userInfo&&this.state.userInfo.mobile}`
        // const query = qs.parse(this.props.location.search, {
        //     ignoreQueryPrefix: true
        // })
        // let pageTabs = 0;
        // if (query.mobile) {
        //     pageTabs = 1;
        // }
        return (
            <div className="change-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    rightContent={[
                        <div className="change-navbar-right" onClick={this.onGolog}></div>
                    ]}
                    className="home-navbar" >
                        <div className="nav-title">种子互转</div>
                </NavBar>
                {/* <Tabs tabs={tabs} initialPage={pageTabs}> */}
                    {/* <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                        <div className="change-code-title">扫描二维码快速对我转账</div>
                        <div className="change-code-img">
                            <QRCode value={refUrl} size={150} />
                        </div>
                    </div> */}
                    <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                        <List className="change-list">
                            <InputItem placeholder="请输入个数" type="number"
                                onBlur={this.onNumberBlur}
                                >转出种子个数</InputItem>
                            <InputItem placeholder="请输入接收人手机号" value={this.state.phone} type="phone" onChange={this.onPhoneBlur} >接收人手机号</InputItem>
                            <InputItem placeholder="请输入短信验证码" onBlur={this.onCodeBlur}
                                onExtraClick={ this.state.codeCountDown > 0 ? undefined : this.getCode}
                                extra={<Button disabled={this.state.codeCountDown > 0} type="ghost" size="small" className="address-code-button" >{ this.state.codeCountDown > 0 ? this.state.codeCountDown: "获取验证码"}</Button>}
                            >
                            验证码</InputItem>
                            <InputItem placeholder="请输入备注信息" onBlur={this.onRemarksBlur}>备注</InputItem>
                        </List>
                        <WhiteSpace size="lg" />
                        <div className="service-charge">转出种子需收取对方 {Number(this.state.turnService)*100}% 手续费</div>

                        <div className="address-footer-button-container"><Button onClick={this.onSubmit} >确认</Button></div>
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
        const newCodeCount = this.state.codeCountDown - 1;
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