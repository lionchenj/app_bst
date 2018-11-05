import * as React from 'react';
// import ReactDOM from "react-dom";
import { NavBar, Icon, ListView,Tabs} from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';
import { model } from '../../model/model';






interface WithdrawHistoryProps {
    history: History
}


interface WithdrawHistoryState {
    height: number,
    visible: boolean
    dataSource1: any,
    isLoading1: boolean,
    hasMore1: boolean,
    page1: number,
    total_num1: number,
    list_num1: number
    dataSource: any,
    isLoading: boolean,
    hasMore: boolean,
    page: number,
    total_num: number,
    list_num: number,
    tabs:any,
    coins:any
}

const tabs = [
    { title: '充币' },
    { title: '币兑换通证' },
];
const bodyHeight = (window.innerHeight/100 - 0.9) + 'rem';

export class WithdrawHistory extends React.Component<WithdrawHistoryProps, WithdrawHistoryState> {
    rData: any
    lv: any

    constructor(props: WithdrawHistoryProps) {
        super(props);
        
        const dataSource1 = new ListView.DataSource({
            rowHasChanged: (row1: model.TransactionItem, row2: model.TransactionItem) => row1 !== row2,
          });
          const dataSource = new ListView.DataSource({
            rowHasChanged: (row1: model.TransactionItem, row2: model.TransactionItem) => row1 !== row2,
          });
          this.state = {
            height:  document.documentElement.clientHeight - 200,
            visible: false,
            dataSource1,
            isLoading1: true,
            hasMore1: false,
            page1: 1,
            total_num1: 1,
            list_num1: 1,
            dataSource,
            isLoading: true,
            hasMore: false,
            page: 1,
            total_num: 1,
            list_num: 1,
            tabs:[],
            coins:[]
          };
        
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    componentDidMount() {
        //兑换
        UserService.Instance.exchangeRecord().then( (res) => {
            var list = res.list;
            console.log(list)
            if(list.length < 1){
                this.setState({isLoading: false})
                return
            }
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(res.list),
            isLoading: false,
            hasMore: false,
            total_num: res.total_num,
            list_num: this.state.list_num + list.length*1,
            page: this.state.page*1+1
          });
        }).catch( err => {
          UIUtil.showError(err)
        })
        //充币
        UserService.Instance.rechangeRecord(this.state.page1).then( (res) => {
            var list = res.list;
            console.log(list)
            if(list.length < 1){
                this.setState({isLoading1: false})
                return
            }
          this.setState({
            dataSource1: this.state.dataSource.cloneWithRows(res.list),
            isLoading1: false,
            hasMore1: false,
            total_num1: res.total_num,
            list_num1: this.state.list_num1 + list.length*1,
            page1: this.state.page*1+1
          });
        }).catch( err => {
          UIUtil.showError(err)
        })
        UserService.Instance.getCoin().then( (res) => {
            var list = []
            for(var i in res){
                console.log('label:'+ res[i].name+',value:'+i)
                list.push({name:res[i].name,id:res[i].id})
            }
            this.setState({
                coins:list
            })
        })
      }

      onEndReached = (event:any) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
          return;
        }
    
      }

    onFilter = () => {

    }

    handleVisibleChange = (visible: boolean) => {
        this.setState({
            ...this.state,
            visible,
          });
    }
    changetab = (tab: any, index: number) => {
        
    }
    onSelect = (opt: any) => {
        console.log("selected key", opt.key);
        this.setState({
            ...this.state,
            visible: false
        });
    }

    public render() {
        const separator1 = (sectionID: number, rowID: number) => (
            <div
              key={`${sectionID}-${rowID}`}
              style={{
                backgroundColor: '#F5F5F5',
                height: 1,
              }}
            />
          );
  
          const row1= (rowData: model.exreChangeRecordItem, sectionID: number, rowID: number) => {
              var coinname = '';
            for(var x of this.state.coins){
                if(rowData.coin_id == x.id){coinname = x.name}
                }
            return (
                <div style={{height:".6rem"}}>
                    <div style={{float:"left",padding:".1rem"}}>
                    {coinname}
                    <div style={{marginTop:".1rem"}}>{rowData.number}</div></div>
                    <div style={{float:"right",padding:".1rem"}}>
                    if(rowData.status == '-1'){'充值失败'}  
                    if(rowData.status == '1'){'审核中'}
                    if(rowData.status == '2'){'充值成功'}
                    <div style={{marginTop:".1rem"}}>{rowData.time}</div></div>
                </div>
  
            );
          };
          const separator = (sectionID: number, rowID: number) => (
            <div
              key={`${sectionID}-${rowID}`}
              style={{
                backgroundColor: '#F5F5F5',
                height: 1,
              }}
            />
          );
  
          const row = (rowData: model.exChangeRecordItem, sectionID: number, rowID: number) => {
     
            return (
                <div style={{height:".6rem"}}>
                    <div style={{float:"left",padding:".1rem"}}>{rowData.coid_name}<div style={{marginTop:".1rem"}}>{rowData.number}</div></div>
                    <div style={{float:"right",padding:".1rem"}}>{rowData.orderid}<div style={{marginTop:".1rem"}}>{rowData.time}</div></div>
                </div>
  
            );
          };
        return (
            <div className="message-container">
                <NavBar icon={<Icon type="left" />}
                    onLeftClick={this.onRedirectBack}
                    className="home-navbar" >
                    <div className="nav-title">通证兑换交易记录</div>
                </NavBar>
                <Tabs tabs={tabs}>
                        <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource1}
                            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                            {this.state.isLoading1 ? 'Loading...' : ''}
                            </div>)}
                            renderRow={row1}
                            renderSeparator={separator1}
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
                        <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
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
                    </Tabs>
                <div className="fans-list-view-container">
                
                </div>
            </div>
        )
    }
}