import * as React from 'react';
import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, List} from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';
import { model } from '../../model/model';
import "./ChangeHistory.css"


interface ChangeHistoryProps {
    history: History
}


interface ChangeHistoryState {
    dataSource: any,
    isLoading: boolean,
    hasMore: boolean,
    height: number,
    visible: boolean,

}




export class ChangeHistory extends React.Component<ChangeHistoryProps, ChangeHistoryState> {
    rData: any
    lv: any

    constructor(props: ChangeHistoryProps) {
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
            visible: false
          };
        
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    componentDidMount() {
    //    UserService.Instance.profit().then( (transferPageData) => {
       UserService.Instance.transfer().then( (transferPageData) => {
           //transferPageData是接口封装的res.data，而不是res,所以找不到errno
           console.log(transferPageData)

        const offsetTop = (ReactDOM.findDOMNode(this.lv)!.parentNode! as HTMLElement).offsetTop
        const hei = document.documentElement.clientHeight - offsetTop
        console.log(transferPageData.list)
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(transferPageData.list),
          isLoading: false,
          hasMore: false,
          height: hei
        });
      }).catch( err => {
          console.log(err)
        UIUtil.showError(err)
        this.props.history.push("/login")

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

    onSelect = (opt: any) => {
        console.log("selected key", opt.key);
        this.setState({
            ...this.state,
            visible: false
        });
    }

    public render() {

        

        const separator = (sectionID: number, rowID: number) => (
            <div
              key={`${sectionID}-${rowID}`}
              style={{
                backgroundColor: '#F5F5F5',
                height: 1,
                // borderTop: '1px solid #ECECED',
                // borderBottom: '1px solid #ECECED',
              }}
            />
          );
         

        const row = (rowData: model.TransactionItem, sectionID: number, rowID: number) => {
            var changeinfo ='1';
            if(rowData.type === 1){changeinfo = '已转出'}
            if(rowData.type === 2){changeinfo = '已转入'}

            return (
                
                <List.Item  className="_item1" style={{fontSize:'14px',color:'red'}} multipleLine extra={ (rowData.type === 1? "-" + (rowData.number): "+"+ (rowData.number))} >

                {changeinfo + "-" + rowData.consignee} 
                    <List.Item.Brief className="_item2">{rowData.time}                
                    </List.Item.Brief>
                {rowData.type === 2?<div className="_item3">{rowData.service?"扣除手续费" + rowData.service: ''}</div>:""}

                </List.Item>
                
  
            );
          };



        return (
            <div className="message-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" 
                  
                    >
                        <div className="nav-title">转种子记录</div>
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