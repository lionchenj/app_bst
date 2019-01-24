import * as React from 'react';
import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, List} from "antd-mobile";
import { History, Location } from "history";
import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';
import { model } from '../../model/model';


interface NoContractHistoryProps {
    history: History
    location: Location

}

interface NoContractHistoryState {
    dataSource: any,
    isLoading: boolean,
    hasMore: boolean,
    height: number,
    visible: boolean,
    userid:string

}

export class TeamHistory extends React.Component<NoContractHistoryProps, NoContractHistoryState> {
    rData: any
    lv: any

    constructor(props: NoContractHistoryProps) {
        super(props);
        
        const dataSource = new ListView.DataSource({
            // rowHasChanged: (row1: any, row2: any) => row1 !== row2,
            rowHasChanged: (row1: model.TransactionItem, row2: model.TransactionItem) => row1 !== row2,
          });

          this.state = {
            dataSource,
            isLoading: true,
            hasMore: false,
            height:  document.documentElement.clientHeight - 200,
            visible: false,
            userid:"1"
          };
        
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    componentDidMount() {

        if(this.props.location.state.userid){
            console.log(this.props.location&&this.props.location.state.userid||false);
            this.setState({
                userid:(this.props.location.state.userid)
            })
        }


        UserService.Instance.CommunityFan(this.props.location.state.userid).then( (transferPageData)=>{
            console.log(transferPageData.data)
            const offsetTop = (ReactDOM.findDOMNode(this.lv)!.parentNode! as HTMLElement).offsetTop
            const hei = document.documentElement.clientHeight - offsetTop
            this.setState({
            dataSource: this.state.dataSource.cloneWithRows(transferPageData.data.list.reverse()),
            isLoading: false,
            hasMore: false,
            height: hei
            });

        }).catch( err => {
            UIUtil.showError(err)

            console.log(err)
        
        })        


    }

    onEndReached = (event:any) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }
    }

    public render() {
        const separator = (sectionID: number, rowID: number) => (
            <div
              key={`${sectionID}-${rowID}`}
              style={{
                backgroundColor: '#F5F5F5',
                height: 1,
              }}
            />
          );
        
        //row逐项渲染data数组
        const row = (rowData: model.NoContractHistoryItem, sectionID: number, rowID: number) => {
            return (
                <List.Item  className="_item1" multipleLine extra={  "-"+ (rowData.number)} >
                    {/* {rowData.random? "充币记录" : "再种记录"}  */}
                    购树记录
                    <List.Item.Brief className="_item2">{rowData.create_time}                
                    </List.Item.Brief>
                </List.Item>
            );
          };

        return (
            <div className="message-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" 
                    >
                    <div className="nav-title">团队记录</div>
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