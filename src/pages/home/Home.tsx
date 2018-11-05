import * as React from 'react';
import {   NavBar, TabBar, Modal, WhiteSpace, List, Grid,Carousel } from "antd-mobile";

import { History } from "history";
import  QRCode  from "qrcode.react";
import "./Home.css"
import iconQrcode from "../../assets/icon_qrcode.png"
import imageTabHome from "../../assets/tab_home.png"
import imageTabHomeSelected from "../../assets/tab_home_selected.png"

import imageTabProfile from "../../assets/tab_profile.png"
import imageTabProfileSelected from "../../assets/tab_profile_selected.png"

import iconFeedback from "../../assets/icon_feedback.png"
import iconPlatformNotice from "../../assets/icon_platform_notice.png"
import iconSettings from "../../assets/icon_settings.png"
import iconSystemMessage from "../../assets/icon_system_message.png"

import iconExchange from "../../assets/icon_exchange.png"
import iconWallet from "../../assets/icon_wallet.png"
import iconChange from "../../assets/icon_change.png"
import iconTeam from "../../assets/icon_team.png"
import iconCommunity from "../../assets/icon_community.png"
import Banner from "../../assets/banner.jpg"

import iconAssets from "../../assets/icon_assets.png"
import iconLucre from "../../assets/icon_lucre.png"
import iconLockPass from "../../assets/iocn_lockPass.png"
import icon_UsablePass from "../../assets/icon_usablePass.png"

import treeBg from "../../assets/tree-bg.jpg"


import { UserService } from '../../service/UserService';
import { AndroidUserAgent, IOSUserAgent } from "../../utils/Constants";

import { model } from '../../model/model';
import { UIUtil } from '../../utils/UIUtil';
// import { number } from 'prop-types';


interface HomeProps {
    history: History
}

interface HomeState {
    selectedTab: "HomeTab"|"PropertyTab"|"ProfileTab",
    showQRCode: boolean,
    isSignIn: boolean,
    isActivate: boolean,
    userInfo?: model.User,
    pageIndexData?: model.PageIndexData,
    pageAssetsData?: model.PageAssetsData,
    remove:boolean,
    list:any,
    index:number,
    xstr:any,
    ystr:any,
    banners:any
  
}
// interface MenuItem {
//     icon: string,
//     text: string
// }
const homeBottomMenuData = [
    {
        icon: iconQrcode,
        text: '分享二维码'
    },
    {
        icon: iconExchange,
        text: '购树兑换'
    },
    {
        icon: iconWallet,
        text: '种子钱包'
    },
    {
        icon: iconChange,
        text: "种子互转"
    },
    {
        icon: iconTeam,
        text: "我的团队"
    },
    {
        icon: iconCommunity,
        text: "社区申请"
    }
]
// const dataTest=[
//     {
//         name:"奖励1"
//     },
//     {
//         name:"奖励2"
//     },
//     {
//         name:"奖励3"
//     }
// ]

export class Home extends React.Component<HomeProps, HomeState> {
    rData: any
    lv: any
    avatarInput: any
    inapp?: string
    constructor(props: HomeProps) {
        super(props)
        this.state = {
            selectedTab: "HomeTab",
            showQRCode: false,
            isSignIn: false,
            isActivate: true,
            remove:false,
            list:[],
            index:-1,
            xstr:null,
            ystr:null,
            banners:[]
          
        }
    }

    onTapHomeMenu = (el: object, index: number) => {
        console.log("onTapHomeMenu", el, index)
        if (index == 0) {
            this.setState({
                ...this.state,
                showQRCode: true
            })
        } else if (index == 1) {
            this.props.history.push("/exchangeAgreement")
        } else if (index == 2) {
            this.props.history.push("/wallet")
        } else if (index == 3) {
            this.props.history.push("/change")
        } else if (index == 4) {
            this.props.history.push("/myTeam")
        }else if (index == 5) {
            this.onCommunityStatus();
        }
    }
    onCommunityStatus = () => {
        UserService.Instance.community_status().then( (res) => {
            console.log(res)
            if(res.errno){
                if(res.errno == 30021){
                    Modal.alert('提示',res.errmsg,[{ text:'ok',onPress: () => {
                        this.props.history.goBack()
                    }, style: 'default' }])
                    return;
                }
                if(res.errno == 30022){
                    Modal.alert('提示',res.errmsg,[{ text:'ok',onPress: () => {
                        this.props.history.goBack()
                    }, style: 'default' }])
                    return;
                }
                if(res.errno == 0){
                    this.props.history.push("/community")
                }
            }else{
                this.props.history.push("/community")
            }
        }).catch( err => {
            UIUtil.showError(err)
        })
    }

    onCloseQRCode = () => {
        this.setState({
            ...this.state,
            showQRCode: false
        })
    }

    onDownloadQRCode = () => {
        const canvas: any = document.querySelector('.qr-modal-content-containter > canvas');
        let href = canvas.toDataURL()

        if (!this.inapp) {
            const w = window.open('about:blank', 'image from canvas');
             w!.document.write("<img src='"+ href+"' alt='from canvas'/>");
             return 
        }

        if (this.inapp == AndroidUserAgent) {
            // href = href.replace("image/png", "image/octet-stream")
            eval(`VETH.dowloadImage("${href}")`)
        } else if (this.inapp == IOSUserAgent) {
            eval(`window.webkit.messageHandlers.downloadImage.postMessage("${href}")`)

        } 
       
        
    }



    onGotoWithdraw = () => {
        this.props.history.push("/withdraw")
    }

    onGotoDeposit = () => {
        this.props.history.push("/deposit")
    }

    onGotoSettingPage = () => {
        this.props.history.push("/settings")
    }

    onGotoMessagePage = () => {
        this.props.history.push("/message", {messageType: "1"})
    }

    onGotoMailPage = () => {
        this.props.history.push("/message", {messageType: "2"})
    }

    onGotoAddressPage = () => {
        this.props.history.push("/address")
    }

    onGotoUpdatePwdPage = () => {
        this.props.history.push("/update_pwd")
    }

    onGotoFeedbackPage = () => {
        this.props.history.push("/feedback")
    }

    onEndReached = (event:any) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        // if (this.state.isLoading && !this.state.hasMore) {
        //   return;
        // }

      }
    onSignIn = () => {
        if (this.state.isSignIn) {
            return 
        }
        UserService.Instance.signIn().then( () => {
            UIUtil.showInfo("签到成功")
            this.setState({
                isSignIn: true
            })
        }).catch( err => {
            UIUtil.showError(err)
        })
    }
    getBanner = () => {
        UserService.Instance.banner().then( (res) => {
            console.log(res)
            this.setState({
                banners:res.data?res.data:Banner
            })
        }).catch( err => {
            UIUtil.showError(err)
            this.setState({
                banners:Banner
            })
        })
    }
    onAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const files = event.target.files
        if (!files || files.length == 0) {
            return 
        }
        UIUtil.showLoading("上传中")
        UserService.Instance.updateHead(files[0]).then( avatarUrl => {
            const userInfo = this.state.userInfo
            if (userInfo) {
                userInfo.head_imgurl = avatarUrl
                this.setState({
                    userInfo: userInfo
                })
            }
            UIUtil.hideLoading()
        }).catch( err => {
            UIUtil.showError(err)
        })
    }

    public componentDidUpdate() {
    }
    private _loadDataWithStyle(selectedType?: string) {
        UserService.Instance.profit(selectedType).then( (profitData) => {
          //const offsetTop = (ReactDOM.findDOMNode(this.lv)!.parentNode! as HTMLElement).offsetTop
          //const hei = document.documentElement.clientHeight - offsetTop
  
          this.setState({
            list:profitData
          });
        })
      }
    public componentWillMount() {

        this.getBanner()
        console.log("componentDidUpdate", this.props.history.location.hash)
        const hash = this.props.history.location.hash
        let selectedTab: "HomeTab"|"PropertyTab"|"ProfileTab" = "HomeTab"
        if (hash.length > 0) {
            if (hash == "#PropertyTab") {
                selectedTab = "PropertyTab"
            } else if (hash == "#ProfileTab") {
                selectedTab = "ProfileTab"
            }
        }
        this.setState({
            selectedTab: selectedTab
        })
    }
    
    public componentDidMount() {

        this._loadDataWithStyle('0');

        const userAgentItemList = window.navigator.userAgent.split(" ")
        
        for (const item of userAgentItemList) {
            if (item.startsWith("inapp/")) {
                this.inapp = item
                break
            }
        }
        UserService.Instance.getUserInfo().then( userInfo => {
            this.setState({
                ...this.state,
                userInfo: userInfo
            })
        }).catch ( err => {
            if (err.errorCode) {
                if (err.errorCode == "401") {
                    this.props.history.push("/login")
                }
            }
        })
        UserService.Instance.pageIndex().then( pageIndexData => {
            this.setState({
                pageIndexData: pageIndexData
            })
            console.log(this.state.pageIndexData)
        })
        const a=[];const b=[];
        for(let i=0; i<this.state.list.length;i++){
            const num1= Math.random()*200 + 1;
            const num2= Math.random()*90 + 5;
            const X= String(num1)+'px';
            const Y=String(num2)+'px';
            
            a.push(X)
            b.push(Y)
            this.setState({
                xstr:a,
                ystr:b
            })
           
        }



    }
    bubbleReomove(e:any){
        console.log(e)
       // this.setState({ remove: true })
       var index=e.target.getAttribute("data-index");
    //    e.target.css={display:"none"}
    //    console.log(index)
    //    this.setState({index:index})
       var lists=this.state.list;
       lists.splice(index,1);
       this.setState({list:lists})
    }


    public render() {
        const refUrl = `https://www.bst123456.com/register?mobile=${this.state.userInfo&&this.state.userInfo.mobile}`

        // const a=this.state.xstr;
        // console.log(a[0])
          let conment=[];
          for(let i=0; i<this.state.list.length;i++){
           
            const num1= Math.random()*200 + 1;
            const num2= Math.random()*90 + 5;
            const X= String(num1)+'px';
            const Y=String(num2)+'px';
            conment.push(<div className="bubble-item" style={{left:X,top:Y,display:this.state.index==i?'none':''}} onClick={(e) => this.bubbleReomove(e)}>
                <div className="bubble" data-index={i}>+15</div>
                <div style={{color:'#fff',textShadow:'0 0 5px #39C687',fontSize:'14px'}}>{this.state.list[i].name}</div>
            </div>)
          }
          let banners = [];
          if(this.state.banners.length != 0 ){
            for(let i of this.state.banners){
                banners.push(<div><img className="banner-img" src={i.img_path} /></div>)
            }
          }else{
            banners.push(<div><img className="banner-img" src={Banner} /></div>)
          }
        return (
            <div className="home-container">
                <NavBar mode="light"  className="home-navbar" ><div className="nav-title">寳树通</div></NavBar>
                {/* <Flex direction="column"> */}
                    
                    <div className="tab-bar-container margin-t0">
                        <TabBar unselectedTintColor="#B8B8BA" tintColor="#001451" barTintColor="#fff">
                            <TabBar.Item title="首页" key="HomeTab" 
                                selected={this.state.selectedTab === 'HomeTab'}
                                onPress={
                                    () => {
                                        this.setState({
                                            ...this.state,
                                            selectedTab: "HomeTab"
                                        })
                                        this.props.history.push("#HomeTab")
                                    }
                                }
                                icon={<div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: 'url('+ imageTabHome + ') center center /  21px 21px no-repeat' }}
                                  />
                                  }
                                selectedIcon={<div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: 'url('+ imageTabHomeSelected +') center center /  21px 21px no-repeat' }}
                                /> }
                            >
                                <div className="home-banner">
                                    <Carousel autoplay dots>
                                        {banners}
                                    </Carousel>
                                </div>
                                <div className="home-top-container">
                                    <div className="home-top-item"> 
                                        <div className="home-top-img"><img src={iconLockPass}/></div>
                                        <div><div className="home-top-title">已购种子</div><div className="home-top-num">{this.state.pageIndexData && this.state.pageIndexData.lock}</div></div>
                                    </div>
                                    <div className="home-top-item"> 
                                        <div className="home-top-img"><img src={icon_UsablePass}/></div>
                                        <div><div className="home-top-title">可兑换种子</div><div className="home-top-num">{this.state.pageIndexData && this.state.pageIndexData.usable}</div></div>
                                    </div>
                                    <div className="home-top-item"> 
                                        <div className="home-top-img"><img src={iconAssets}/></div>
                                        <div><div className="home-top-title">种子库</div><div className="home-top-num">{this.state.pageIndexData && this.state.pageIndexData.total}</div></div>
                                    </div>
                                    <div className="home-top-item"> 
                                        <div className="home-top-img"><img src={iconLucre}/></div>
                                        <div><div className="home-top-title">新增种子</div><div className="home-top-num">{this.state.pageIndexData && this.state.pageIndexData.profit}</div></div>
                                    </div>
                                   
                                    {/* <div>
                                        <div className="home-top-main-container">
                                            <div className="home-top-checkin-container" >
                                                    <div>昨日收益</div><div>{this.state.pageIndexData && this.state.pageIndexData.profit}</div>
                                            </div>
                                            <div className="home-top-text-container">
                                                <div className="left-section">
                                                    <div className="left-section-text">在投通证（个）</div>
                                                    <div className="left-section-num">{this.state.pageIndexData && this.state.pageIndexData.lock}</div>
                                                </div>
                                                <div className="middel-line"></div>
                                                <div className="right-section">
                                                    <div className="left-section-text">可提现通证（个）</div>
                                                    <div className="left-section-num">{this.state.pageIndexData && this.state.pageIndexData.usable}</div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="profile-list">
                                    <Grid data={homeBottomMenuData} hasLine={false} onClick={this.onTapHomeMenu} columnNum={4}>

                                    </Grid>

                                </div>
                                <div className="tree-mask">
                                    <img src={treeBg} style={{width:'100%'}}/>
                                    <div className="bubble-mask">
                                        {conment}
                                    </div>
                                </div>
                                 {/* <List  className="profile-list">
                                    <List.Item
                                        thumb= {homeBottomMenuData[0].icon}
                                        arrow="horizontal"
                                        onClick={() => { this.onTapHomeMenu(0) }}
                                        >{homeBottomMenuData[0].text}
                                    </List.Item>
                                    <List.Item
                                        thumb= {homeBottomMenuData[1].icon}
                                        arrow="horizontal"
                                        onClick={() => { this.onTapHomeMenu(1) }}
                                        >{homeBottomMenuData[1].text}
                                    </List.Item>
                                    <List.Item
                                        thumb= {homeBottomMenuData[2].icon}
                                        arrow="horizontal"
                                        onClick={() => { this.onTapHomeMenu(2) }}
                                        >{homeBottomMenuData[2].text}
                                    </List.Item>
                                    <List.Item
                                        thumb= {homeBottomMenuData[3].icon}
                                        arrow="horizontal"
                                        onClick={() => { this.onTapHomeMenu(3) }}
                                        >{homeBottomMenuData[3].text}
                                    </List.Item>
                                    <List.Item
                                        thumb= {homeBottomMenuData[4].icon}
                                        arrow="horizontal"
                                        onClick={() => { this.onTapHomeMenu(4) }}
                                        >{homeBottomMenuData[4].text}
                                    </List.Item>
                                    <List.Item
                                        thumb= {homeBottomMenuData[5].icon}
                                        arrow="horizontal"
                                        onClick={() => { this.onTapHomeMenu(5) }}
                                        >{homeBottomMenuData[5].text}
                                    </List.Item>
                                </List> */}
                                
                                <div className="menu-container">
                                   
                                    <Modal visible={this.state.showQRCode} transparent maskClosable={false}
                                        closable={true}
                                        onClose={this.onCloseQRCode} 
                                        footer={[
                                            { text: '保存图片', onPress: this.onDownloadQRCode },
                                          
                                        ]}
                                        className="qr-modal"
                                    >   
                                        <div className="qr-modal-content-containter" >
                                            <WhiteSpace size='xl' />
                                            <QRCode value={refUrl} size={128} />
                                            <WhiteSpace size='xl' />
                                            <div>{this.state.userInfo && this.state.userInfo.nickname}</div>
                                        </div>
                                    </Modal>
                                </div>
                            </TabBar.Item>
                            
                            <TabBar.Item title="个人中心" key="ProfileTab"
                                selected={this.state.selectedTab === 'ProfileTab'}
                                onPress={
                                    () => {
                                        this.props.history.push("#ProfileTab")
                                        this.setState({
                                            ...this.state,
                                            selectedTab: "ProfileTab"
                                        })
                                    }
                                }
                                icon={
                                    <div style={{
                                      width: '22px',
                                      height: '22px',
                                      background: 'url(' + imageTabProfile + ') center center /  21px 21px no-repeat' }}
                                    />
                                  }
                                  selectedIcon={
                                    <div style={{
                                      width: '22px',
                                      height: '22px',
                                      background: 'url(' + imageTabProfileSelected + ') center center /  21px 21px no-repeat' }}
                                    />
                                  }
                            >
                                <div>
                                <div className="profile-header">
                                  <div className="profile-header-content">
                                        <div className="avatar-container">
                                            <input className="avatar-input" type="file"  ref={el => this.avatarInput = el} onChange={this.onAvatarChange}/>
                                            <img className="profile-header-logo" src={this.state.userInfo && this.state.userInfo.head_imgurl}/>
                                        </div>
                                        
                                        <div className="profile-header-info-container">
                                            <div className="profile-header-nickname">{this.state.userInfo && this.state.userInfo.nickname}</div>
                                            <div className="profile-header-phone">{this.state.userInfo && this.state.userInfo.mobile}</div>
                                        </div>
                                  </div>
                                </div>
                                <List renderHeader={() => ''} className="profile-list">
                                    <List.Item
                                        thumb= {iconPlatformNotice}
                                        arrow="horizontal"
                                        onClick={this.onGotoMessagePage}
                                        >平台公告
                                    </List.Item>
                                    <List.Item
                                        thumb= {iconFeedback}
                                        onClick={this.onGotoFeedbackPage}
                                        arrow="horizontal"
                                        >
                                        意见反馈
                                    </List.Item>
                                    <List.Item
                                        thumb= {iconSystemMessage}
                                        onClick={this.onGotoMailPage}
                                        arrow="horizontal"
                                        >
                                        站内信
                                    </List.Item>
                                </List>

                                <List renderHeader={() => ''} className="profile-list">
                                    <List.Item
                                        thumb= {iconSettings}
                                        arrow="horizontal"
                                        onClick={this.onGotoSettingPage}
                                        >设置
                                    </List.Item>
                                </List>
                                </div>
                            </TabBar.Item>
                        </TabBar>
                    </div>
                {/* </Flex> */}
            </div>
        )
    }
}