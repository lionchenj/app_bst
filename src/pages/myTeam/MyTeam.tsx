import * as React from 'react';
import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, WhiteSpace,Modal} from "antd-mobile";
import { History } from "history";


import "./MyTeam.css"
import { UserService } from '../../service/UserService';

import { model } from '../../model/model';

interface FansProps {
    history: History
}


interface FansState {
    dataSource: any,
    isLoading: boolean,
    hasMore: boolean,
    height: number,
    total: number,
    not_active: number,
    recharge_num: number,
    userid:string,
    count:number,
    todaycount:number
}




export class MyTeam extends React.Component<FansProps, FansState> {
    rData: any
    lv: any
    constructor(props: FansProps) {
        super(props);
        
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1: model.Fans, row2: model.Fans) => row1 !== row2,
          });
      
          this.state = {
            dataSource,
            isLoading: true,
            hasMore: false,
            height:  document.documentElement.clientHeight - 260,
            total: 0,
            not_active: 0,
            recharge_num: 0,
            userid:"",
            count: 0,
            todaycount: 0
          };
        
      }

    onRedirectBack = () => {
        const history = this.props.history
        console.log('onLeftClick', history)
        history.goBack()
    }

    onGotoTeamHistory = (e:any)=>{

        // _userid是用户的id值
        const _userid = e.currentTarget.dataset.id
        console.log(e.currentTarget.dataset.id)

        //判断是否已成为运营中心
        UserService.Instance.community_status().then( (res)=>{
            console.log(res)
                if(res.errno == 0||res.errorCode == 30021){
                    Modal.alert('提示', '请先成为运营中心', [
                        { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
                        { text: '确认', onPress: () => this.props.history.push("/community") },
                    ]);
                }

        }).catch( err => {
            console.log(err)
            
            if(err.errorCode == 0){
                Modal.alert('提示', '请先成为运营中心', [
                    { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
                    { text: '确认', onPress: () => this.props.history.push("/community") },
                ]);
                
            }
            if(err.errorCode == 30022){

                this.props.history.push("/teamHistory",{userid: _userid})
                
            }
        })

    }  
    
    componentDidMount() {
        console.log(this.refs.nav,this.lv)
        UserService.Instance.pageMyFans().then( (fansData) => {
        //   console.log(ReactDOM.findDOMNode(this.lv)!.parentNode!)
          const offsetTop = (ReactDOM.findDOMNode(this.lv)!.parentNode! as HTMLElement).offsetTop;
          const hei = document.documentElement.clientHeight - offsetTop-60;
            

          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(fansData.list),
            isLoading: false,
            hasMore: false,
            height: hei,
            count:fansData.count || 0,
            todaycount:fansData.todaycount || 0,
            total: fansData.total,
            recharge_num: fansData.recharge_num,
            not_active: fansData.not_active
          })
          console.log(fansData);
        })
        UserService.Instance.community_status().then( (res)=>{
                console.log(res);

        }).catch( err => {
            if(err.errorCode === 30022){
    
            }
            
        })

      }

    public render() {

        const separator = (sectionID: number, rowID: number) => (
            <div
              key={`${sectionID}-${rowID}`}
              style={{
                backgroundColor: '#DDDDDD',
                height: 1,
                // borderTop: '1px solid #ECECED',
                // borderBottom: '1px solid #ECECED',
              }}
            />
          );
      
          const row = (rowData: model.Fans, sectionID: number, rowID: number) => {
 
    
            return (
                <div className="fans-row-item" 
                     key={rowID} 
                     onClick={this.onGotoTeamHistory} 
                     data-id={rowData.userid}>
                
                    <div >{rowData.nickname}
                        <div className="fans-row-item-bold">{rowData.mobile}</div>
                      {/* <div className="fans-row-item-normal">{rowData.mobile}</div> */}
                    </div>
                  
                    <div >
                        <div className="fans-row-item-bold fans-row-item-right">{rowData.today_order}</div>
                        <div className="fans-row-item-normal">购树量</div>
                    </div>
                </div>
            
            );
          };
     
        return (
            <div className="fans-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" ref="nav">
                        <div className="nav-title">我的团队</div>
                </NavBar>
                <div>
                    <div>
                        <div className="fans-top-bg"></div>
                        <div className="fans-top-content">
                            <div className="fans-left-section">
                                <div className="fans-section-text">总会员量</div>
                                <div className="fans-section-num">{this.state.total }</div>
                            </div>
                            <div className="fans-middel-line" ></div>
                            <div className="fans-right-section">
                                <div className="fans-section-text">今天购树人数</div>
                                <div className="fans-section-num">{this.state.recharge_num }</div>
                            </div>
                        </div>
                    </div>
                </div>
                <WhiteSpace size="xl"/>
                
                <div className="fans-list-view-container" >
                <ListView 
                    ref={el => {this.lv = el;console.log(this.lv,this.refs)}}
                    dataSource={this.state.dataSource}
                    renderHeader={() => <span className="fans-list-title">会员</span>}
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
                    onEndReachedThreshold={10}
                    style={{
                        height: this.state.height,
                        overflow: 'auto',
                    }}
                />
                <div className="foot-list">
                    <div>总业绩统计：{this.state.count}</div>
                    <div>当日统计：{this.state.todaycount}</div>
                </div>
                </div>
            </div>
        )
    }
}