import * as React from 'react';
import { NavBar, Icon, List, Button} from "antd-mobile";
import { Redirect } from "react-router-dom";
import { History } from "history";
import "./Settings.css"
import { UserService } from '../../service/UserService';

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

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }
    
    onLogout = () => {
        UserService.Instance.logout()

        this.setState( {
            redirectToLogin: true
        })
    }

    public render() {
        if (this.state.redirectToLogin) {
            const to = {
                pathname: "/login"
            }
            return <Redirect to={to} />
        }
        return (
            <div className="fans-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">设置</div>
                </NavBar>
                <List renderHeader={() => ''} className="my-list">
                    <List.Item arrow="horizontal">关于我们</List.Item>
                </List>
                <div className="fans-footer">
                    <Button onClick={this.onLogout} >退出账号</Button>
                </div>
            </div>
        )
    }
}