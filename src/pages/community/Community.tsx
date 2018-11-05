import * as React from 'react';
import { NavBar, Icon, List, InputItem, WhiteSpace, Button, Modal} from "antd-mobile";
import { History } from "history";
import "./Community.css"

import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';

interface AddressProps {
    history: History
}

interface AddressState {
    name: string,
    mobile:string,
    idCard:string
}

export class Community extends React.Component<AddressProps, AddressState> {

    constructor(props: AddressProps) {
        super(props)

        this.state = {
            name: '',
            mobile:'',
            idCard:''
        }
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }
    onNameBlur= (value: string) => {
        this.setState({
            name:value
        })
    }
    onPhoneBlur= (value: string) => {
        this.setState({
            mobile:value
        })
    }
    onIdCardBlur= (value: string) => {
        this.setState({
            idCard:value
        })
    }
    onSubmit = (event: React.MouseEvent) => {
        event.preventDefault()
        const nameInfo = "请输入姓名"
        const idCardInfo = "请输入身份证"
        const numberInfo = "请输入手机号码"
        if (!this.state.mobile) {
            UIUtil.showInfo(numberInfo)
            return
        }
        if (!this.state.idCard) {
            UIUtil.showInfo(idCardInfo)
            return
        }
        if (!this.state.name) {
            UIUtil.showInfo(nameInfo)
            return
        }
        UserService.Instance.community(this.state.name, this.state.idCard, this.state.mobile).then( () => {
            Modal.alert('提示','申请成功',[{ text:'ok',onPress: () => {
                this.props.history.push('/')
            }, style: 'default' }])
        }).catch( err => {
            UIUtil.showError(err)
        })
    }

    public render () {
        return (
            <div className="address-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">社区申请</div>
                </NavBar>

                <List className="address-list">
                    <InputItem type="text"  placeholder="请输入您的姓名" onBlur={this.onNameBlur}>姓名</InputItem>
                    <InputItem type="phone" placeholder="请输入您的手机" onBlur={this.onPhoneBlur}>手机</InputItem>
                    <InputItem type="text" placeholder="请输入您的身份证" onBlur={this.onIdCardBlur}>身份证</InputItem>
                </List>

                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <div className="address-footer-button-container"><Button onClick={this.onSubmit} >提交</Button></div>
             
            </div>
        )
    }
}