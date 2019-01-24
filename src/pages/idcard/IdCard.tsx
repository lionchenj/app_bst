import * as React from 'react';

import { History, Location } from "history";
import { NavBar, Icon, List, InputItem, WhiteSpace, Button, Modal} from "antd-mobile";
import { UIUtil } from '../../utils/UIUtil';
import { UserService } from '../../service/UserService';
import { Redirect } from "react-router-dom";
import './IdCard.css'

interface Props {
    location: Location,
    history: History
}
interface State {
    files: any[],
    redirectToLogin: boolean
}

export class IdCard extends React.Component<Props, State> {
    name: string
    idcardNumber: string
    constructor(props: Props) {
        super(props)
        this.state = {
            files: [],
            redirectToLogin: false
        }
    }
    onRedirectBack = () => {
        this.props.history.push("/settings")
    }

    onChange = (files: any[], type: any, index: number) => {
        console.log(files, type, index);
        this.setState({
          files,
        });
    }

    onNameBlur = (value: string) => {
        this.name = value
    }

    onIdcardBlur = (value: string) => {
        this.idcardNumber = value
    }

    onSubmit = () => {
        const nameInfo = "请输入姓名"
        const idcardInfo = "请输入正确的身份证号码"
        if (!this.name) {
            UIUtil.showInfo(nameInfo)
            return 
        }
        const idCardNumberLength = this.idcardNumber ? this.idcardNumber.length : 0
        if (idCardNumberLength != 15 && idCardNumberLength != 18 ) {
            UIUtil.showInfo(idcardInfo)
            return 
        }

        // const passState = this.props.location.state
        // const code = passState.code 
        // const sharePhone = passState.sharePhone
        // const password = passState.password 

    

        UserService.Instance.Identify(this.name, this.idcardNumber, this.state.files[0]).then( () => {
            Modal.alert('提示','认证成功',[{ text:'ok',onPress: () => {
                this.setState({
                    ...this.state,
                    redirectToLogin: true
                })
            },style: 'default' }])
            
        }).catch( err => {
            UIUtil.showError(err)
            if(err.errno ==="401"){
                this.props.history.push("/login")
            }
        })

        console.log("onSubmit", this.state.files[0])
    }

    public render() {

        const { redirectToLogin} = this.state
    
        if (redirectToLogin) {
            const to = {
                pathname: "/login"
            }
            return <Redirect to={to} />
        }
        
        return (
            <div className="address-container idcard">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">实名认证</div>
                </NavBar>

                <div className="feedback-images-container">

                    <List className="content-item-border">
                            <InputItem name="name" placeholder="请输入您的真实姓名" onBlur={this.onNameBlur}>
                               姓名
                            </InputItem>
                            <InputItem name="name" placeholder="请输入身份证号" onBlur={this.onIdcardBlur}>
                                身份证号
                            </InputItem>
                            
                            
                    </List>
                    <WhiteSpace size="lg" />
                    <WhiteSpace size="lg" />
                    <div className="address-footer-button-container"><Button onClick={this.onSubmit}>确认提交</Button></div>
                    
                </div>
            </div>
        )
    }
}