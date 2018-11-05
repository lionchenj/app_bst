import * as React from 'react';

import { NavBar, Icon} from "antd-mobile";
import { History, Location } from "history";

import "./MessageDetail.css"
import { model } from '../../model/model';

interface MessageDetailProps {
    history: History,
    location: Location
}

export class MessageDetail extends React.Component<MessageDetailProps> {

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    public render() {
        const systemBulletin = this.props.location.state.systemBulletin as model.SystemBulletinItem
        return (
            <div className="message-detail-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">通知详情</div>
                </NavBar>
                <div className="message-content-container">
                    {/* <div>
                        <h3>{systemBulletin.title}</h3>
                        <span>发布者：EOS生态 {systemBulletin.time}</span>
                    </div> */}
                    <div className="system-bulletin-content" dangerouslySetInnerHTML={{__html: systemBulletin.content}}>
                     
                    </div>
                </div>
            </div>
        )
    }
}