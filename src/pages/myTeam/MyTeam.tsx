import * as React from 'react';
import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, WhiteSpace} from "antd-mobile";
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
            height:  document.documentElement.clientHeight - 200,
            total: 0,
            not_active: 0,
            recharge_num: 0
          };
        
      }

    onRedirectBack = () => {
        const history = this.props.history
        console.log('onLeftClick', history)
        history.goBack()
    }
    componentDidMount() {
        UserService.Instance.pageMyFans().then( (fansData) => {
          const offsetTop = (ReactDOM.findDOMNode(this.lv)!.parentNode! as HTMLElement).offsetTop
          const hei = document.documentElement.clientHeight - offsetTop
            

          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(fansData.list),
            isLoading: false,
            hasMore: false,
            height: hei,
            total: fansData.total,
            recharge_num: fansData.recharge_num,
            not_active: fansData.not_active
          })
        })

      }

      onEndReached = (event:any) => {

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
              <div className="fans-row-item" key={rowID}>
                
                  <div >
                      <div className="fans-row-item-bold">{rowData.userid}</div>
                      {/* <div className="fans-row-item-normal">{rowData.level}</div> */}
                  </div>
                  
                  <div >
                    <div className="fans-row-item-bold fans-row-item-right">{rowData.today_order}</div>
                    <div className="fans-row-item-normal">今日购树量</div>
                  </div>
                </div>
            
            );
          };
     
        return (
            <div className="fans-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
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
                            <div className="fans-middel-line"></div>
                            <div className="fans-right-section">
                                <div className="fans-section-text">今天购树人数</div>
                                <div className="fans-section-num">{this.state.recharge_num }</div>
                            </div>
                        </div>
                    </div>
                </div>
                <WhiteSpace size="xl" />
                <div className="fans-list-view-container">
                <ListView
                    ref={el => this.lv = el}
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