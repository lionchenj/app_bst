import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, WingBlank, Modal, Tabs, Picker} from "antd-mobile";
import { History } from "history";
import moment from 'moment';
import "./Exchange.css"

// import eosNumImage from "../../assets/eco_num.png"
import { UserService } from '../../service/UserService';
import { model } from '../../model/model';

import { UIUtil } from '../../utils/UIUtil';
import copy from 'copy-to-clipboard';
// import { ExchangeAgreement } from '../exchangeAgreement/ExchangeAgreement';
import WeChat from "../../assets/WeChat.png"
import Alipay from "../../assets/Alipay.png"
import offlineTrading from "../../assets/offlineTrading.png"
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
    changeCoin: string,
    checkContract: boolean
    
}
const tabs = [
    { title: '充值' },
    { title: '兑换种子' },
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
    agree: boolean
    checkContract: boolean
    contract:any


    constructor(props: ChangeProps) {
        super(props)
        this.codeCountDownTimer = 0
        this.agree = true

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
            changeCoin:'0',
            checkContract: true
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
        const history = this.props.history
        history.goBack()
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
                if (err) {
                    if (err.errorCode == "401" ||err.errno ==="401") {
                        this.props.history.push("/login")
                    }
                    
                }
            })

        })
    }

    onNumberBlur = (value: string) => {
        this.changeNumber = value;
        if(this.changeNumber == '')
        {
            this.setState({changeCoin: '0'})
        }else{
            this.setState({changeCoin:(parseInt(this.changeNumber) * parseInt(this.state.exchange_rate))+''})

        }
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
        if (!this.agree) {
            UIUtil.showInfo("请先了解并同意《寳树通协议》")
            return
        }
        if (!this.changeNumber) {
            UIUtil.showInfo(numberInfo)
            return
        }
        if (!this.code) {
            UIUtil.showInfo(codeInfo)
            return
        }
        
        UIUtil.showLoading("充种子中")
        UserService.Instance.rechange(this.state.selectedCoinId, this.changeNumber, this.code, this.state.radomCode).then( () => {
            UIUtil.hideLoading();
            Modal.alert('提示','充种子待审核',[{ text:'ok',onPress: () => {
                this.props.history.goBack()
            }, style: 'default' }])
        }).catch( err => {
            UIUtil.showError(err)
            if (err) {
                if (err.errorCode == "401" ||err.errno ==="401") {
                    this.props.history.push("/login")
                }
                
            }
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
        UIUtil.showLoading("转种子中")
        UserService.Instance.exchange(this.state.selectedCoinId, this.changeNumber, this.code).then( () => {
            UIUtil.hideLoading();
            Modal.alert('提示','转种子成功',[{ text:'ok',onPress: () => {
                this.props.history.goBack()
            }, style: 'default' }])
        }).catch( err => {
            UIUtil.showError(err)
            if (err) {
                if (err.errorCode == "401" ||err.errno ==="401") {
                    this.props.history.push("/login")
                }
                
            }
            
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
    onClickChecked = () =>{
        // this.props.history.push("/exchangeAgreement")
        this.setState({
            checkContract:false
        })

    }
    onChangeChecked = (event: any) => {
        this.agree = event.target.checked
    }
    onIspay = (e: any)=>{
        const noOpening = "请使用其它支付方式";
        console.log(e);
        UIUtil.showInfo(noOpening);

    }
    // var contract = React.createClass({
    //     render:function(){
    //         return(
    //             <p>根据《中华人民共和国合同法》的规定，甲乙双方经充分协商，在平等自愿的基础上，就认购及委托管养种植奇楠树苗事宜达成如下协议</p>
    //         )
    //     }
    // })
    public componentDidMount () {
        UserService.Instance.getCoin().then( (res:any) => {

            var list = [];
            for(var i in res){
                // console.log('label:'+ res[i].name+',value:'+i)
                list.push({label:res[i].name,value:i});
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
        }).catch(err => {
            UIUtil.showError(err);
            this.props.history.push("/login");

        })
        UserService.Instance.pageIndex().then( pageIndexData => {
            this.setState({
                pageIndexData: pageIndexData
            })
        }).catch(err => {
            UIUtil.showError(err);
            this.props.history.push("/login");

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
                            <div className='change-list-title'>选择类型 （{this.state.sValue}现有数：<span>{this.state.usable}</span>）</div>
                            <List className="change-list">
                                <List className="change-list exchange">
                                    <Picker
                                    cols={1}
                                    data={this.state.coinlist}
                                    title="选择类型"
                                    extra={this.state.sValue}
                                    value={this.state.sValue}
                                    onChange={v => this.onSetCoinInfo(v)}>
                                    <CustomChildren><InputItem placeholder="请输入数量" type="number" onBlur={this.onNumberBlur} ></InputItem></CustomChildren>
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
                                <div className='change-list-title'>备注说明：请在转账时填入该随机码</div>
                            <WhiteSpace size="sm" />
                            
                            {/* <List className="change-list">
                                <div className='change-img-text'>充值凭证<strong>(上传图片不可超过1M)</strong></div>
                            <div className='change-img'>
                                <ImagePicker files={this.state.files}
                                    onChange={this.onChange}
                                    length={1}
                                    onImageClick={(index, fs) => console.log(index, fs)}
                                    selectable={this.state.files.length < 1}></ImagePicker>
                                </div>
                            </List> */}
                            <List className="change-list exchange">
                                <div className='pay-title'>支付方式</div>

                                <div className='pay-way' onClick={this.onIspay}>
                                    <img src={WeChat}/>
                                    <div className="pay-text">微信支付</div>
                                    <div className="isopen">未开通</div>

                                </div>
                                <div className='pay-way' onClick={this.onIspay}>
                                    <img src={Alipay}/>
                                    <div className="pay-text">支付宝</div>
                                    <div className="isopen">未开通</div>

                                </div>
                                <div className='pay-way'>
                                    <img src={offlineTrading}/>
                                    
                                    <div className="pay-text">线下支付</div>
                                    <label><input type="radio" defaultChecked className="checkContract" / ></label>

                                    
                                </div>
                                <div className='pay-way  pay-underway' >
                                    <div className="detail">
                                     开户名：广州宝树通农业科技有限公司<br/>
                                     公司帐号：3602113209100200569<br/>
                                     开户行：中国工商银行广州颐和支行</div>
                       
                                </div>
                                <div className='pay-way'></div>

                                                                        
                            </List>
                            <WhiteSpace size="xl" />

                            <List className="change-list exchange">
                                <InputItem placeholder="请输入短信验证码" onBlur={this.onCodeBlur}
                                    onExtraClick={ this.state.codeCountDown > 0 ? undefined : this.getCode}
                                    extra={<Button disabled={this.state.codeCountDown > 0} type="ghost" size="small" className="address-code-button" >{ this.state.codeCountDown > 0 ? this.state.codeCountDown: "获取验证码"}</Button>}
                                >
                                验证码
                                </InputItem>
                            </List>
                            
                        <div className="argeement-confirm confirm">
                        {/* <label><input type="checkbox" onClick={this.onClickChecked} defaultChecked/ >&nbsp;&nbsp;我已了解并同意《寳树通协议》</label> */}
                        <label><input type="checkbox" className="checkContract" defaultChecked={this.state.checkContract} onChange={this.onChangeChecked} onClick={this.onClickChecked}/ >&nbsp;&nbsp;我已了解并同意《寳树通协议》</label>
                        {/* <label for="male"></label> */}
                        {/* <input type="checkbox" id="male" defaultChecked={this.state.checkContract} onChange={this.onChangeChecked} onClick={this.onClickChecked}/ >&nbsp;&nbsp;我已了解并同意《寳树通协议》 */}
                        </div>
                        <div>{this.state.checkContract?
                                    ""
                                    : 
                                    
                                    <div className="page-content-container exchange-argeement-container">
                                    <div >
                                    {/* <p>寳树通协议</p>
                                    <p>通证是由寳树通发布用于兑换（交易等）的相应年龄的沉香树所用的凭证，寳树通打造“沉香树”中的极品：绿奇楠！最终实现沉香托管平台，传承千年沉香文化！</p>
                                    <p>一、沉香树的拥有权以及管理！</p>
                                    <p>1.用户首次拥有1万个以上的通证，公司增送专属个人树权证！</p>
                                    <p>2.获得树权证后，沉香树苗种植托管于公司指定基地进行种植培育管理，这培育种植过程中，公司派专人进行锄草，浇水，采香，结香管理等，为了沉香树良好快速的发展，公司将收取五年的管理费！</p>
                                    <p>3.期间沉香树如遇死亡，公司将进行重新种植！</p>
                                    <p>4.沉香树的长大后，当产生的收益后，按照市场价格进行销售，其中书权证本人获得销售额70%利润，公司获得30%！</p>
                                    <p>5.沉香树种植后五年后将收回沉香树收益权！</p>
                                    <p>以上最终解释权归寳树通所有！</p> */}
                                        <p>根据《中华人民共和国合同法》的规定，甲乙双方经充分协商，在平等自愿的基础上，就认购及委托管养种植奇楠树苗事宜达成如下协议</p>
                                        <p>一、甲方的权利及义务</p>
                                        <p>1、甲方负责委托管养种植奇楠树苗的培育、种植、管理、结香、销售，保证所提供的奇楠树苗的品种品质，保证百分百成活率（不可抗力的自然灾害除外）。</p>
                                        <p>2、甲方负责奇楠树苗在种植期间的运输、装卸费用。</p>
                                        <p>3、奇楠树苗成长一年以上乙方卖出时，同等价格甲方有权优先收购。</p>
                                        <p>4、甲方负责奇楠树苗从落地到加工的全程溯源技术。</p>
                                        <p>5、甲方负责种植树苗所有专业人员的工资发放。</p>
                                        <p>6、甲方负责对树苗基地的科学化管理、设备、人工和管护开支的一切费用。</p>
                                        <p>7、甲方提供树苗认购和委托管养种植及树苗生长信息的平台建设。</p>
                                        <p>二、乙方的权利及义务</p>
                                        <p>1、乙方有权检测树苗的品质和前往基地实地考察。</p>
                                        <p>2、乙方享受结香后销售收益的优先分红权。</p>
                                        <p>3、乙方享受结香后加工产品的产品优先购买权。</p>
                                        <p>4、乙方享有树苗销售推广和沉香产品的推广分享权。</p>
                                        <p>5、乙方有权一年后出售所持有树苗。</p>
                                        <p>6、乙方有权随时对树苗的生长进行实地考察。</p>
                                        <p>三、收益与分成</p>
                                        <p>甲方在奇楠沉香树生长周期满3年后负责人工结香技术的施工作业，第5年人工采香销售，每棵奇楠沉香树第五年的预期采香克重（整伐技术）约为300克-500克，采香后的销售收益的70%归乙方所有，30%归甲方所有（如采香后的销售收益不足以支付给乙方前期投入本金金额的，则优先支付乙方前期投入的本金后再按比例进行利润分配）。</p>
                                        <p>四、违约责任</p>
                                        <p>1、甲方需保障种植的品种为奇楠树（苗），否则乙方有权申请赔偿。</p>
                                        <p>2、甲方需保障奇楠树在5年内正常存活及管理，出现不可抗力的自然灾害除外。</p>
                                        <p>3、甲方如不按规定期限内进行采香、销售，乙方有权将树移走或申请赔偿。</p>
                                        <p>4、乙方在签订协议之日起除本协议规定外不可无故毁约，无故毁约甲方不承担任何责任。</p>
                                        <p>5、本协议从签订之日起生效，协议期限为5年，如合同期满乙方单方面终止合同，则合同失效。</p>
                                        <p>6、本协议未尽事宜，由各方协商签订补充协议，其补充协议与本合同具有同等法律效力。</p>
                                        <p>7、乙方可通过线上下载打印标准的电子协议，平台的电子协议会根据具体经营情况进行部分调整，以最后更新的最新版为准。</p>
                                        <p>8、甲、乙双方有其他原因致使协议内容发生改变，由双方协商可补签变更协议。</p>
                                        <p>9、本协议通过线上支付购买后即时生效，如需纸质协议可线下申请。本协议在履行过程中如出现争议，由甲乙双方协商解决；协商不成，由相关部门进行调解；协商、调解不成的，可向甲方所在地人民法院申请诉讼。</p>
                                        <p>10、本协议最终解释权归广州宝树通农业科技有限公司所有。</p>
                                    </div>
                                  </div>  
                                }</div>
                            <div className="address-footer-button-container"><Button onClick={this.onRechange}  style={{color:"white"}}>支付</Button></div>
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
                                title="选择类型"
                                extra={this.state.sValue}
                                value={this.state.sValue}
                                onChange={v => this.onSetCoinInfo(v)}>
                                <CustomChildren><InputItem placeholder="请输入兑换数量" type="number" onBlur={this.onNumberBlur} ></InputItem></CustomChildren>
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
                            <div className="address-footer-button-container"><Button onClick={this.onSubmit} style={{color:"white"}}>兑换</Button></div>
                            </WingBlank>
                        </div>
                    </Tabs>
                </div>
                {/* <ExchangeAgreement></ExchangeAgreement> */}
                
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