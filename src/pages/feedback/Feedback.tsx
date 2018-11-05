import * as React from 'react';

import { NavBar, Icon,  Button, WhiteSpace, TextareaItem, ImagePicker, Toast, Modal} from "antd-mobile";
import { History } from "history";
import "./Feedback.css"
import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';



interface FeedbackProps {
    history: History
}

interface FeedbackState {
    files: any[]
}


export class Feedback extends React.Component<FeedbackProps, FeedbackState> {
    private _content: string;
    constructor(props: FeedbackProps) {
        super(props)
        this._content = ""
        this.state = {
            files: []
        }
  
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    onChange = (files: any[], type: any, index: number) => {
        console.log(files, type, index);
        this.setState({
          files,
        });
    }

    onSubmit = () => {
        const fileList = new Array<File>()
        for (const reactFile of this.state.files) {
            fileList.push(reactFile.file)
        }

        if (this._content.length == 0) {
            Toast.info("请输入反馈内容")
            return 
        }
        UIUtil.showLoading("上传中")
        UserService.Instance.feedback(this._content, fileList).then( () => {
            UIUtil.hideLoading()
            const alert = Modal.alert
            alert('提示','感谢您的反馈',[{ text:'ok',onPress: () => {
                this.props.history.goBack()
            },style: 'default' }])
        }).catch( (err: Error) => {
            UIUtil.showError(err)
        })
    }

    onContentBlur = (value: string) => {
        this._content = value
    }

    public render() {
        return (
            <div className="address-container feedback">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">意见反馈</div>
                </NavBar>

       
                <TextareaItem
                    onBlur={this.onContentBlur}
                    className="feedback-textarea"
                    placeholder='请输入你的意见或者建议，最多200字'
                    autoHeight
                    rows={10}
                    count={200}
                />
                    
                <div className="feedback-images-container">
                    <div className="feedback-images-text"> 点击添加图片（不超过500KB），最多添加3张</div>
                    <ImagePicker
                        files={this.state.files}
                        onChange={this.onChange}
                        onImageClick={(index, fs) => console.log(index, fs)}
                        selectable={this.state.files.length < 3}
                        multiple={false}
                        />
                </div>
            
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <div className="address-footer-button-container"><Button onClick={this.onSubmit}>确认提交</Button></div>
            </div>
        )
    }
}