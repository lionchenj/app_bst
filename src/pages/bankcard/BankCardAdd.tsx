import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Toast, Modal} from "antd-mobile";
import { History, Location } from "history";
import { UserService } from '../../service/UserService';

import { Redirect } from "react-router-dom";
import { UIUtil } from '../../utils/UIUtil';

import { Util } from '../../utils/Util';

interface BankCardAddProps {
    history: History,
    location: Location
}

interface BankCardAddState {
    redirectToReferrer: boolean
    phone: string
    name:string

}

export class BankCardAdd extends React.Component<BankCardAddProps, BankCardAddState> {
    bankname:string
    bankId: string
    pages: string
    name: string
    phone: string

    constructor(props: BankCardAddProps) {
        super(props)
        this.pages = "/bankCard";
        this.phone = "";
        this.state = {
            phone: '',
            name:'',
            redirectToReferrer: false
        }
    }
    onRedirectBack = () => {
        const history = this.props.history
        history.push("/bankCard")
    }

    onBankNameBlur = (value: string) => {
        this.bankname = value
    }

    onBankid = (value: string) => {
        this.bankId = value
    }

    onPhoneBlur = (value: string) => {
        this.phone = value
    }

    onNameBlur = (value: string) => {
        this.name = value
    }

    onSubmit = () => {
        const bankInfo = "请输入银行名";
        const idInfo = "请输入银行卡号";
        const nameinfo = "请输入持卡人姓名";
        const phoneinfo = "请输入11位手机号码";

        if (!this.bankname) {
            Toast.info(bankInfo);
            return;
        } 
        if (!this.bankId) {
            Toast.info(idInfo);
            return;
        }
        if (!this.name) {
            Toast.info(nameinfo);
            return;
        }

        const trimPhone = Util.trim(this.phone!)
        if (!Util.validPhone(trimPhone)) {

            Toast.info(phoneinfo);
            return;
        }
        UserService.Instance.addPayment(this.bankname, this.bankId,this.name, trimPhone).then( (res:any) => {
            const alert = Modal.alert;
            alert('提示','新增成功');
            if(this.pages == "/walletQuiet"||this.pages == "/wallet"){
                UserService.Instance.defaultPayment(this.bankId).then( () => {
                    this.setState({
                        ...this.state,
                        redirectToReferrer: true
                    })
                })
            }else{
                this.props.history.push(this.pages);
            }
        }).catch( err => {
            UIUtil.showError(err);

            console.log(err)
            if(err.errno=="401"||err.errno=="400"){
                this.props.history.push("/login");
  
              }
        })
        
    }

    public componentDidMount (){
        console.log(this.props.location.state)
        const page = this.props.location.state&&this.props.location.state.page||'';
        
        if(page == 'ww'){
            this.pages = "/wallet";
        }
    }
    public render() {
        const {redirectToReferrer} = this.state;
        if (redirectToReferrer) {
            const to = {
                pathname: this.pages
            }
            return <Redirect to={to} />
        }
        return (
            <div >
                <NavBar icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">新增银行卡</div>
                </NavBar>
                <List renderHeader='' className="content-item-border">
                    <InputItem type="text" placeholder="请输入开户银行全称" onBlur={this.onBankNameBlur}>银行名</InputItem>

                    <InputItem type="digit" placeholder="请输入银行卡号" onBlur={this.onBankid}>银行卡号</InputItem>
                    <InputItem type="text" placeholder="请输入持卡人姓名" onBlur={this.onNameBlur}>姓名</InputItem>
                    <InputItem type="phone" placeholder="请输入持卡人手机号" onBlur={this.onPhoneBlur}>手机号</InputItem>

                </List>
                {/* <WhiteSpace size="lg" /> */}
                <WhiteSpace size="xs" />
                <div className="fans-footer">
                    <Button className="login-button" onClick={this.onSubmit}>提交新增</Button>
                </div>
            </div>
        )
    }
}