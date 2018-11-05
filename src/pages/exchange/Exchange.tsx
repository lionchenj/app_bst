import * as React from 'react';

import { NavBar, Icon, List, InputItem, ImagePicker, Button, WhiteSpace, WingBlank, Modal, Tabs, Picker} from "antd-mobile";
import { History } from "history";
import moment from 'moment';
import "./Exchange.css"

// import eosNumImage from "../../assets/eco_num.png"
import { UserService } from '../../service/UserService';
import { model } from '../../model/model';

import { UIUtil } from '../../utils/UIUtil';
import copy from 'copy-to-clipboard';

interface ChangeProps {
    history: History
}
interface ChangeState {
    codeCountDown: number,
    CoinData?: model.CoinData<model.CoinInfo>,
    pageIndexData?: model.PageIndexData,
    files: any[],
    selectedCoinId: string,
    redirectToLogin: boolean,
    sValue: any,
    exchange_rate: string,
    address: string,
    usable: string,
    canch: string,
    coinlist: any,
    phone: string,
    radomCode: string,
    changeCoin: string
}

const tabs = [
    { title: '充币' },
    { title: '币兑换种子' },
];
const bodyHeight = (window.innerHeight/100 - 0.9) + 'rem';

const CustomChildren = (props:any) => (
    <div style={{ backgroundColor: '#fff', paddingLeft: 15 }}>
      <div className="test" style={{ display: 'flex', height: '45px', lineHeight: '45px' }}>
        <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{props.children}</div>
        <div style={{ textAlign: 'right', color: '#888', marginRight: 15 }} onClick={props.onClick}>{props.extra}</div>
      </div>
    </div>
  );
export class Exchange extends React.Component<ChangeProps, ChangeState> {
    codeCountDownTimer: number
    changeNumber: string
    phone: string
    name: string
    code: string
    voucher: string
    constructor(props: ChangeProps) {
        super(props)
        this.codeCountDownTimer = 0
        this.state = {
            codeCountDown: 0,
            selectedCoinId: '1',
            files: [],
            redirectToLogin:false,
            sValue: [],
            exchange_rate:'',
            address: '',
            usable: '',
            canch: '',
            phone: '',
            coinlist: [],
            radomCode: '0',
            changeCoin:'0'
        }
    }
    onChange = (files: any[], type: any, index: number) => {
        if (!files || files.length == 0) {
            return 
        }
        UIUtil.showLoading("上传中")
        UserService.Instance.uploadFile(files[0]).then( fileUrl => {
            // const userInfo = this.state.userInfo
            // if (userInfo) {
            //     userInfo.head_imgurl = avatarUrl
            //     this.setState({
            //         userInfo: userInfo
            //     })
            // }
            this.setState({
                files,
              });
            UIUtil.hideLoading()
        }).catch( err => {
            UIUtil.showError(err)
        })
        

    }
    onRedirectBack = () => {
        this.props.history.push("/")
    }
    onGoPage = () => {
        this.props.history.push("/withdrawHistory")
    }
    //复制地址
    copyAdd = () => {
        if(copy(this.state.address)){
            UIUtil.showInfo("复制成功");
        }else{
            UIUtil.showInfo("复制失败")
        }
    };
    //复制随机码
    copyRadom = () => {
        if(copy(this.state.radomCode)){
            UIUtil.showInfo("复制成功");
        }else{
            UIUtil.showInfo("复制失败")
        }
    };
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
                    phone:phone,
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
        this.changeNumber = value;
        this.setState({changeCoin:(parseInt(this.changeNumber) * parseInt(this.state.exchange_rate))+''})
    }

    onNameBlur = (value: string) => {
        this.name = value
    }

    onCodeBlur = (value: string) => {
        this.code = value
    }

    onRechange = (event: React.MouseEvent) => {
        event.preventDefault()
        const codeInfo = "请输入验证码"
        const numberInfo = "请输入数量"
        if (!this.changeNumber) {
            UIUtil.showInfo(numberInfo)
            return
        }
        if (!this.code) {
            UIUtil.showInfo(codeInfo)
            return
        }
        UIUtil.showLoading("充币中")
        UserService.Instance.rechange(this.state.selectedCoinId, this.changeNumber, this.state.files[0].url, this.code, this.state.radomCode).then( () => {
            UIUtil.hideLoading();
            Modal.alert('提示','充币成功',[{ text:'ok',onPress: () => {
                this.props.history.goBack()
            }, style: 'default' }])
        }).catch( err => {
            UIUtil.showError(err)
        })
    }

    onSubmit = (event: React.MouseEvent) => {
        event.preventDefault()
        const codeInfo = "请输入验证码"
        const numberInfo = "请输入数量"
        if (!this.changeNumber) {
            UIUtil.showInfo(numberInfo)
            return
        }
        if (!this.code) {
            UIUtil.showInfo(codeInfo)
            return
        }
        UIUtil.showLoading("转币中")
        UserService.Instance.exchange(this.state.selectedCoinId, this.changeNumber, this.code).then( () => {
            UIUtil.hideLoading();
            Modal.alert('转币成功','提示',[{ text:'ok',onPress: () => {
                this.props.history.goBack()
            }, style: 'default' }])
        }).catch( err => {
            UIUtil.showError(err)
        })
    }
    onRadomCode = () => {
        var charactors="ab1cd2ef3gh4ij5kl6mn7opq8rst9uvw0xyz";
        var value='',i;
        for(var j=1;j<=4;j++){
            i = parseInt(35*Math.random()+""); 　
            value = value + charactors.charAt(i);
        }
        this.setState({
            radomCode: moment().format('YYYYMMDDHHmmss') + value
        })
        
    }
    onSetCoinInfo = (val:any) => {
        this.onRadomCode();
        var list = this.state.CoinData&&this.state.CoinData[val];
        // console.log(list)
        this.setState({
            selectedCoinId: list.id,
            sValue: [list.name],
            exchange_rate: list.exchange_rate,
            address: list.address,
            usable: list.usable,
            canch: (list.usable*list.exchange_rate+'')
        })
    }
    public componentDidMount () {
        UserService.Instance.getCoin().then( (res) => {
            var list = []
            for(var i in res){
                // console.log('label:'+ res[i].name+',value:'+i)
                list.push({label:res[i].name,value:i})
            }
            this.setState({
                CoinData: res,
                coinlist: list,
                selectedCoinId: res[0].id,
                sValue: [res[0].name],
                exchange_rate: res[0].exchange_rate,
                address: res[0].address,
                usable: res[0].usable,
                canch: (res[0].usable*res[0].exchange_rate+'')
            })
            // console.log(this.state.CoinData)
        })
        UserService.Instance.pageIndex().then( pageIndexData => {
            this.setState({
                pageIndexData: pageIndexData
            })
        })
        this.onRadomCode();
    }

    public render() {
        return (
            <div className="change-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    rightContent={[
                        <div className="navbar-right" onClick={this.onGoPage}></div>
                    ]}
                    className="home-navbar" >
                        <div className="nav-title">购树兑换</div>
                </NavBar>

                <div>
                    <Tabs tabs={tabs}>
                        <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                            <WingBlank>
                            <WhiteSpace size="sm" />
                            <div className='change-list-title'>选择币种 （{this.state.sValue}现有数：<span>{this.state.usable}</span>）</div>
                            <List className="change-list">
                                <List className="change-list exchange">
                                    <Picker
                                    cols={1}
                                    data={this.state.coinlist}
                                    title="选择币种"
                                    extra={this.state.sValue}
                                    value={this.state.sValue}
                                    onChange={v => this.onSetCoinInfo(v)}>
                                    <CustomChildren><InputItem placeholder="请输入充币数量" type="phone" onBlur={this.onNumberBlur} ></InputItem></CustomChildren>
                                    </Picker>
                                </List>
                            </List>
                            <WhiteSpace size="sm" />

                            <div className='change-list-title'>钱包地址</div>
                            <List className="change-list">
                                <InputItem disabled type="number" value={this.state.address}
                                onExtraClick={ this.copyAdd}
                                extra={<div className="address-code-button red" >复制</div>}></InputItem>
                                </List>
                            <WhiteSpace size="sm" />
                            <div className='change-list-title'>随机码</div>
                                <List className="change-list">
                                <InputItem disabled type="phone" value={this.state.radomCode} 
                                onExtraClick={ this.copyRadom}
                                extra={<div className="address-code-button red">复制</div>}></InputItem>
                                </List>
                                <div className='change-list-title'>请在转入币时复制、填入该随机码</div>
                            <WhiteSpace size="sm" />
                            <List className="change-list exchange">
                                <InputItem placeholder="请输入短信验证码" onBlur={this.onCodeBlur}
                                    onExtraClick={ this.state.codeCountDown > 0 ? undefined : this.getCode}
                                    extra={<Button disabled={this.state.codeCountDown > 0} type="ghost" size="small" className="address-code-button" >{ this.state.codeCountDown > 0 ? this.state.codeCountDown: "获取验证码"}</Button>}
                                >
                                验证码</InputItem>
                            </List>
                            <WhiteSpace size="sm" />
                                <List className="change-list">
                                <div className='change-img-text'>充币凭证<strong>(上传图片不可超过1M)</strong></div>
                            <div className='change-img'>
                                <ImagePicker files={this.state.files}
                                    onChange={this.onChange}
                                    length={1}
                                    onImageClick={(index, fs) => console.log(index, fs)}
                                    selectable={this.state.files.length < 1}></ImagePicker>
                                </div>
                            </List>
                            <div className="address-footer-button-container"><Button onClick={this.onRechange} >确认</Button></div>
                            </WingBlank>
                        </div>
                        <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                            <WingBlank>
                            <WhiteSpace size="sm" />
                            <div className='change-list-title'>兑换金额（{this.state.sValue}可兑换数：<span>{this.state.usable}</span>）</div>
                            <List className="change-list exchange">
                                <Picker
                                cols={1}
                                data={this.state.coinlist}
                                title="选择币种"
                                extra={this.state.sValue}
                                value={this.state.sValue}
                                onChange={v => this.onSetCoinInfo(v)}>
                                <CustomChildren><InputItem placeholder="请输入币兑换数量" type="phone" onBlur={this.onNumberBlur} ></InputItem></CustomChildren>
                                </Picker>
                            </List>
                             <WhiteSpace />
                             <div className='change-list-body-text'>1{this.state.sValue} = {this.state.exchange_rate}BST</div>
                             <WhiteSpace />
                            <div className='change-list-title'>可兑换为（已有宝树证数：<span>{this.state.pageIndexData && this.state.pageIndexData.usable}</span>）</div>
                            <List className="change-list">
                                <InputItem placeholder="0" disabled  type="phone" value={this.state.changeCoin} ></InputItem>
                            </List>
                                <WhiteSpace size="sm" />
                            <List className="change-list exchange">
                                <InputItem placeholder="请输入短信验证码" onBlur={this.onCodeBlur}
                                    onExtraClick={ this.state.codeCountDown > 0 ? undefined : this.getCode}
                                    extra={<Button disabled={this.state.codeCountDown > 0} type="ghost" size="small" className="address-code-button" >{ this.state.codeCountDown > 0 ? this.state.codeCountDown: "获取验证码"}</Button>}
                                >
                                验证码</InputItem>
                            </List>
                            <WhiteSpace size="lg" />
                            <WhiteSpace size="lg" />
                            <WhiteSpace size="lg" />
                            <WhiteSpace size="lg" />
                            <div className="address-footer-button-container"><Button onClick={this.onSubmit} >兑换</Button></div>
                            </WingBlank>
                        </div>
                    </Tabs>
                </div>
                
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