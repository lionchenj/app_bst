import * as React from 'react';
import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, List,} from "antd-mobile";
import { History, Location } from "history";


import "./Message.css"
import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';
import { model } from '../../model/model';

interface MessageProps {
    history: History,
    location: Location
}


interface MessageState {
    dataSource: any,
    isLoading: boolean,
    hasMore: boolean,
    height: number
}



export class Message extends React.Component<MessageProps, MessageState> {
 
    lv: any

    constructor(props: MessageProps) {
        super(props);
        
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1: model.SystemBulletinItem, row2: model.SystemBulletinItem) => row1 !== row2,
          });
      
          this.state = {
            dataSource,
            isLoading: true,
            hasMore: false,
            height:  document.documentElement.clientHeight - 200,
          };
        
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    onMessageDetail = (systemBulletin: model.SystemBulletinItem) => {
      this.props.history.push("/messageDetail", {systemBulletin: systemBulletin})
    }

    componentDidMount() {
        const messageType = this.props.location.state.messageType
        if (messageType == "1") {
          UserService.Instance.systemBulletin().then( systemBulletinList => {
            const offsetTop = (ReactDOM.findDOMNode(this.lv)!.parentNode! as HTMLElement).offsetTop
            const hei = document.documentElement.clientHeight - offsetTop
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(systemBulletinList),
              isLoading: false,
              hasMore: false,
              height: hei
            })
          }).catch( err => {
            UIUtil.showError(err)
          })
        } else {
          UserService.Instance.mail().then( systemBulletinList => {
            const offsetTop = (ReactDOM.findDOMNode(this.lv)!.parentNode! as HTMLElement).offsetTop
            const hei = document.documentElement.clientHeight - offsetTop
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(systemBulletinList),
              isLoading: false,
              hasMore: false,
              height: hei
            })
          }).catch( err => {
            UIUtil.showError(err)
          })
        }
        
      
      }

      onEndReached = (event:any) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
   
      }

    public render() {
        const messageType = this.props.location.state.messageType
        const separator = (sectionID: number, rowID: number) => (
            <div
              key={`${sectionID}-${rowID}`}
              style={{
                backgroundColor: '#F5F5F5',
                height: 8,
                // borderTop: '1px solid #ECECED',
                // borderBottom: '1px solid #ECECED',
              }}
            />
          );

          const row = (rowData: model.SystemBulletinItem, sectionID: number, rowID: number) => {
       
            return (
                <List.Item multipleLine extra={rowData.time} arrow="horizontal" onClick={ () => { this.onMessageDetail(rowData) }}>
                {rowData.title} <List.Item.Brief>{rowData.describe}</List.Item.Brief>
                </List.Item>
  
            );
          };


        return (
            <div className="message-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">{messageType == "1" ? "消息" : "站内信"}</div>
                </NavBar>
                <div className="fans-list-view-container">
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                    {this.state.isLoading ? 'Loading...' : ''}
                    </div>)}
                    renderRow={row}
                    renderSeparator={separator}
                    className="am-list"
                    pageSize={4}
                    // useBodyScroll
                    onScroll={() => { console.log('scroll'); }}
                    scrollRenderAheadDistance={500}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
                    style={{
                        height: this.state.height,
                        overflow: 'auto',
                    }}
                />
                </div>
            </div>
        )
    }
}