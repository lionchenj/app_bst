import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Modal, Tabs, WingBlank, Slider, Picker } from "antd-mobile";
import { History } from "history";
import "./Wallet.css"
import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';
import { model } from '../../model/model';

interface WithdrawProps {
    history: History
}

interface WithdrawState {
    codeCountDown: number,
    selectedCoinId: "1" | "2", // 币ID 1:EOS 2:VETH
    pageIndexData: any,
    service: number,
    sValue: any,
    CoinData?: model.CoinData<model.CoinInfo>,
    coinlist: any,
    exchange_rate: string,
    address: string,
    usable: string,
    canch: string,
    setService?: model.Service<model.ServiceData>,
    servicemin: number,
    servicemax: number,
    changeCoin: string,

}
const tabs = [
    { title: '购树凭证' },
    { title: '再种' },
    { title: '可兑换种子' },
];
const CustomChildren = (props: any) => (
    <div style={{ backgroundColor: '#fff', paddingLeft: 15 }}>
        <div className="test" style={{ display: 'flex', height: '45px', lineHeight: '45px' }}>
            <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{props.children}</div>
            <div style={{ textAlign: 'right', color: '#888', marginRight: 15 }} onClick={props.onClick}>{props.extra}</div>
        </div>
    </div>
);
const bodyHeight = (window.innerHeight / 100 - 0.9) + 'rem';
export class Wallet extends React.Component<WithdrawProps, WithdrawState> {
    codeCountDownTimer: number
    code: string
    withdrawNumber: string
    address: string
    constructor(props: WithdrawProps) {
        super(props)
        this.codeCountDownTimer = 0
        this.state = {
            codeCountDown: 0,
            selectedCoinId: "1",
            pageIndexData: [],
            service: 0,
            sValue: [],
            coinlist: [],
            exchange_rate: '',
            address: '',
            usable: '',
            canch: '',
            changeCoin: '0.00',
            servicemin: 0,
            servicemax: 100
        }
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    // onSelectCoinId = () => {
    //     const buttons = ['EOS', 'VETH', '取消']
    //     ActionSheet.showActionSheetWithOptions({
    //         options: buttons,
    //         cancelButtonIndex: buttons.length - 1,
    //         maskClosable: true,
    //     }, (buttonIndex) => {
    //         if (buttonIndex != 0 && buttonIndex != 1) {
    //             return 
    //         }
    //         this.setState({
    //             selectedCoinId: (buttonIndex == 0 ) ? "1" : "2"
    //         })
    //         console.error("onSelectCoinId", buttonIndex)
    //     })
    // }

    onNumberBlur = (value: string) => {
        this.withdrawNumber = value;
        console.log((parseInt(value) / parseInt(this.state.exchange_rate)))
        this.setState({ changeCoin: (parseInt(value) / parseInt(this.state.exchange_rate)).toFixed(2) + '' });
    }
    onAddressBlur = (value: string) => {
        let regex = /^[A-Za-z0-9]+$/;
        if (regex.test(value)) {
            this.address = value
        } else {
            const addRess = "请输入正确钱包地址";
            if (!this.code) {
                UIUtil.showInfo(addRess)
            }
        }
    }
    onCodeBlur = (value: string) => {
        this.code = value
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
        })
    }
    onActivate = () => {
        const codeInfo = "请输入验证码"
        const numberInfo = "请输入数量"
        if (!this.withdrawNumber) {
            UIUtil.showInfo(numberInfo)
            return
        }
        if (!this.code) {
            UIUtil.showInfo(codeInfo)
            return
        }
        UIUtil.showLoading("再种中");
        UserService.Instance.activate(this.withdrawNumber, this.code, this.state.service).then(() => {
            UIUtil.hideLoading();
            Modal.alert('提示', '再种成功', [{
                text: 'ok', onPress: () => {
                    this.props.history.goBack()
                }, style: 'default'
            }])
        }).catch(err => {
            UIUtil.showError(err)
        })
    }
    onSubmit = (event: React.MouseEvent) => {
        event.preventDefault()

        const codeInfo = "请输入验证码"
        const numberInfo = "请输入数量"
        const add = "请输入提现地址"
        if (!this.address) {
            UIUtil.showInfo(add)
            return
        }
        if (!this.withdrawNumber) {
            UIUtil.showInfo(numberInfo)
            return
        }
        if (!this.code) {
            UIUtil.showInfo(codeInfo)
            return
        }
        UIUtil.showLoading("提取中");
        UserService.Instance.assets(this.state.selectedCoinId, this.withdrawNumber, this.code, this.state.service, this.address).then(() => {
            UIUtil.hideLoading();
            Modal.alert('提示', '提取成功', [{
                text: 'ok', onPress: () => {
                    this.props.history.goBack()
                }, style: 'default'
            }])
        }).catch(err => {
            UIUtil.showError(err)
        })

    }

    getCode = () => {
        if (this.state.codeCountDown > 0) {
            return
        }
        UIUtil.showLoading("正在发送验证码")
        UserService.Instance.getUserInfo().then((userInfo) => {
            const phone = userInfo.mobile
            UserService.Instance.getMobileMassges(phone).then(() => {
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
            }).catch((err) => {
                UIUtil.showError(err)
            })

        })
    }
    log = (name: string) => {
        return (value: number) => {
            console.log(`${name}: ${value}`);
        };
    }
    onGoPage = () => {
        this.props.history.push("/earnings")
    }
    setService = (val: number) => {
        this.setState({
            service: val / 100
        })
    }
    onSetCoinInfo = (val: any) => {
        var list = this.state.CoinData && this.state.CoinData[val];
        console.log(list)
        this.setState({
            selectedCoinId: list.id,
            sValue: [list.name],
            exchange_rate: list.exchange_rate,
            address: list.address,
            usable: list.usable,
            canch: (list.usable * list.exchange_rate + '')
        })
        this.setState({ changeCoin: (parseInt(this.withdrawNumber) / parseInt(list.exchange_rate)).toFixed(2) + '' });
    }
    public componentDidMount() {
        UserService.Instance.pageIndex().then(pageIndexData => {
            this.setState({
                pageIndexData: pageIndexData
            })
        })


        UserService.Instance.getService().then((res) => {
            this.setState({
                servicemin: parseFloat(res.start),
                servicemax: parseFloat(res.end)
            })
        })

        UserService.Instance.getCoin().then((res) => {
            var list = []
            for (var i in res) {
                console.log('label:' + res[i].name + ',value:' + i)
                list.push({ label: res[i].name, value: i })
            }
            this.setState({
                CoinData: res,
                coinlist: list,
                selectedCoinId: res[0].id,
                sValue: [res[0].name],
                exchange_rate: res[0].exchange_rate,
                address: res[0].address,
                usable: res[0].usable,
                canch: (res[0].usable * res[0].exchange_rate + '')
            })
            console.log(this.state.CoinData)
        })
    }

    public render() {
        return (
            <div className="withdraw-container">
                <NavBar mode="light" icon={<Icon type="left" />}
                    onLeftClick={this.onRedirectBack}
                    rightContent={[
                        <div className="wallet-navbar-right" onClick={this.onGoPage}></div>
                    ]}
                    className="home-navbar" >
                    <div className="nav-title">香库</div>
                </NavBar>
                <Tabs tabs={tabs}>
                    <div style={{ height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                        <div className="withdraw-header">
                            <div className="withdraw-header-content">
                                <div className="withdraw-title">已购种子（个）</div>
                                <div className="withdraw-num">{this.state.pageIndexData.lock}</div>
                            </div>
                        </div>
                        <WhiteSpace size="lg" />
                        <List className="wallet-list">
                            <InputItem placeholder="请输入短信验证码" onBlur={this.onCodeBlur}
                                onExtraClick={this.state.codeCountDown > 0 ? undefined : this.getCode}
                                extra={<Button disabled={this.state.codeCountDown > 0} type="ghost" size="small" className="address-code-button" >{this.state.codeCountDown > 0 ? this.state.codeCountDown : "获取验证码"}</Button>}
                            >
                                验证码</InputItem>
                        </List>
                        <WhiteSpace size="xl" />
                        <WhiteSpace size="xl" />
                        <WhiteSpace size="xl" />
                        <WhiteSpace size="xl" />
                        <div className="address-footer-button-container"><Button onClick={this.onQuicken}>解除合约</Button></div>
                    </div>
                    <div style={{ height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                        <WingBlank>
                            <WhiteSpace size="sm" />
                            <div className='change-list-title'>再种种子数量（可再种种子数量：<span>{this.state.pageIndexData.usable}</span>）</div>
                            <List className="wallet-list">
                                <InputItem placeholder="请输入通证数量" type="number" onBlur={this.onNumberBlur}></InputItem>
                            </List>
                            <WhiteSpace size="lg" />
                            <List className="wallet-list">
                                <InputItem placeholder="请输入短信验证码" onBlur={this.onCodeBlur}
                                    onExtraClick={this.state.codeCountDown > 0 ? undefined : this.getCode}
                                    extra={<Button disabled={this.state.codeCountDown > 0} type="ghost" size="small" className="address-code-button" >{this.state.codeCountDown > 0 ? this.state.codeCountDown : "获取验证码"}</Button>}
                                >
                                    验证码</InputItem>
                            </List>
                            <WhiteSpace size="lg" />
                            <div className='change-list-title'>手续费</div>
                            <List className="wallet-list">
                                <div className="wallet-text">
                                    <div className="lf">{this.state.servicemin}</div>
                                    <div className="lr">{this.state.servicemax}</div>
                                </div>
                                <div className="wallet-slider">
                                    <Slider
                                        defaultValue={this.state.servicemin}
                                        min={this.state.servicemin}
                                        max={this.state.servicemax * 100}
                                        onChange={this.setService}
                                        onAfterChange={this.log('afterChange')}
                                    />
                                </div>
                                <div className="wallet-text">
                                    <div className="lf">慢</div>
                                    <div className="lr">快</div>
                                </div>
                                <div className="wallet-totle">总计：<span>{this.state.service}</span></div>
                            </List>
                            <WhiteSpace size="xl" />
                            <WhiteSpace size="xl" />
                            <div className="address-footer-button-container"><Button onClick={this.onActivate}>确认</Button></div>
                        </WingBlank>
                    </div>
                    <div style={{ height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                        <WingBlank>
                            <WhiteSpace size="sm" />
                            <div className='change-list-title'>提种子金额（可提种子数：<span>{this.state.pageIndexData.usable}</span>）</div>
                            <List className="change-list exchange">
                                <Picker
                                    cols={1}
                                    data={this.state.coinlist}
                                    title="选择币种"
                                    extra={this.state.sValue}
                                    value={this.state.sValue}
                                    onChange={v => this.onSetCoinInfo(v)}>
                                    <CustomChildren><InputItem placeholder="请输入提种子数量" type="phone" onBlur={this.onNumberBlur} ></InputItem></CustomChildren>
                                </Picker>
                            </List>
                            <div className='change-list-body-text'><span>{this.state.changeCoin}</span>{this.state.sValue}</div>
                            <div className='change-list-body-text'>{this.state.exchange_rate}BST = 1{this.state.sValue}</div>
                            <WhiteSpace size="lg" />
                            <div className='change-list-title'>钱包地址</div>
                            <List className="change-list">
                                <InputItem placeholder="请输入钱包地址" type="text" onBlur={this.onAddressBlur}></InputItem>
                            </List>
                            <WhiteSpace size="lg" />
                            <List className="wallet-list">
                                <InputItem placeholder="请输入短信验证码" onBlur={this.onCodeBlur}
                                    onExtraClick={this.state.codeCountDown > 0 ? undefined : this.getCode}
                                    extra={<Button disabled={this.state.codeCountDown > 0} type="ghost" size="small" className="address-code-button" >{this.state.codeCountDown > 0 ? this.state.codeCountDown : "获取验证码"}</Button>}
                                >
                                    验证码</InputItem>
                            </List>
                            <WhiteSpace size="lg" />
                            <div className='change-list-title'>手续费</div>
                            <List className="wallet-list">
                                <div className="wallet-text">
                                    <div className="lf">{this.state.servicemin}</div>
                                    <div className="lr">{this.state.servicemax}</div>
                                </div>
                                <div className="wallet-slider">
                                    <Slider
                                        defaultValue={this.state.servicemin}
                                        min={this.state.servicemin}
                                        max={this.state.servicemax * 100}
                                        onChange={this.setService}
                                        onAfterChange={this.log('afterChange')}
                                    />
                                </div>
                                <div className="wallet-text">
                                    <div className="lf">慢</div>
                                    <div className="lr">快</div>
                                </div>
                                <div className="wallet-totle">总计：<span>{this.state.service}</span></div>
                            </List>
                            <WhiteSpace size="xl" />
                            <WhiteSpace size="xl" />
                            <div className="address-footer-button-container"><Button onClick={this.onSubmit}>确认</Button></div>
                        </WingBlank>
                    </div>
                </Tabs>



            </div>
        )
    }

    public componentWillUnmount() {
        this.codeCountDownTimer && window.clearInterval(this.codeCountDownTimer)
        this.codeCountDownTimer = 0
    }

    private _codeCountDownHander = () => {
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