import * as React from 'react';
import { NavBar, Icon, List, Button} from "antd-mobile";
import { Redirect } from "react-router-dom";
import { History } from "history";
import "./Settings.css"
import { UserService } from '../../service/UserService';
import { UserStorage } from "../../storage/UserStorage";

interface SettingsProps {
    history: History,
    
}

interface SettingsState {
    redirectToLogin: boolean
}

export class Settings extends React.Component<SettingsProps, SettingsState> {

    constructor(props: SettingsProps) {
        super(props)
        this.state = {
            redirectToLogin: false
        }
    }
    onGotoAboutus = ()=>{
        this.props.history.push("/aboutus");
    }
    onGotoHomePage = () => {
        this.props.history.push("/#ProfileTab");

    }
    onGotoIdcard = ()=>{
        this.props.history.push("/idcard");
    }  

    onGotoBankcard = ()=>{
        this.props.history.push("/bankcard");
    } 

    onRedirectBack = () => {
        const history = this.props.history;
        history.goBack();
    }

    onGotoNocontract = () => {
        this.props.history.push("/noContract");

    }
    
    onLogout = () => {
        UserService.Instance.logout()
        UserStorage.delCookie('User.AccessTokenKey');

        this.setState( {
            redirectToLogin: true
        })
    }
    
    onClickContract(event: React.MouseEvent){
        event.preventDefault();
    }

    public render() {
        if (this.state.redirectToLogin) {
            const to = {
                pathname: "/login"
            }
            return <Redirect to={to} />;
        }
        return (
            <div className="fans-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onGotoHomePage}
                    className="home-navbar" >
                        <div className="nav-title">设置</div>
                </NavBar>
                <List renderHeader='' className="my-list">
                    <List.Item arrow="horizontal" onClick={this.onGotoIdcard}>实名认证</List.Item>
                    <List.Item arrow="horizontal" onClick={this.onGotoBankcard}>银行卡</List.Item>
                    <List.Item arrow="horizontal" onClick={this.onGotoNocontract}>解除合约</List.Item>
                    <List.Item arrow="horizontal" onClick={this.onGotoAboutus}>关于我们</List.Item>
                </List>
                <div className="fans-footer">
                    <Button onClick={this.onLogout} >退出账号</Button>
                </div>
            </div>
        )
    }
}