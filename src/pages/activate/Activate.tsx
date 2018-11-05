import * as React from 'react';
import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, List} from "antd-mobile";
import { History } from "history";


import "./Activate.css"
import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';
import { model } from '../../model/model';



interface ActivateProps {
    history: History
}


interface ActivateState {
    activateRecordList: any
    total: number,
    isLoading: boolean,
    hasMore: boolean,
    height: number,
    visible: boolean
}



export class Activate extends React.Component<ActivateProps, ActivateState> {
    rData: any
    lv: any

    constructor(props: ActivateProps) {
        super(props);
        
        const dataSource = new ListView.DataSource({
          rowHasChanged: (row1: model.ActivateRecordItem, row2: model.ActivateRecordItem) => row1 !== row2,
        });
        this.state = {
          total: 0,
          isLoading: true,
          hasMore: false,
          height:  document.documentElement.clientHeight - 200,
          visible: false,
          activateRecordList: dataSource
        };
        
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    componentDidMount() {
       UserService.Instance.activateRecord().then( activeRecordList => {
        const offsetTop = (ReactDOM.findDOMNode(this.lv)!.parentNode! as HTMLElement).offsetTop
        const hei = document.documentElement.clientHeight - offsetTop

          this.setState({
            activateRecordList: this.state.activateRecordList.cloneWithRows(activeRecordList),
            total: activeRecordList.length,
            isLoading: false,
            hasMore: false,
            height: hei
          })
       }).catch( err => {
         UIUtil.showError(err)
       })
      
      }

      onEndReached = (event:any) => {

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
        
          const row = (rowData: model.ActivateRecordItem, sectionID: number, rowID: number) => {
       
            return (
                <List.Item multipleLine  >
                {rowData.eos} <List.Item.Brief>{rowData.time}</List.Item.Brief>
                </List.Item>
  
            );
          };


        return (
            <div className="message-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" 
               
                    // rightContent={[
                    //     <Button key="filter-button" size="small" onClick={this.onFilter}>筛选</Button>
                    //   ]}
                    >
                        <div className="nav-title">激活记录</div>
                </NavBar>
                <div className="earings-filter-type-text">只显示最近{this.state.total}条激活记录</div>
                <div className="fans-list-view-container">
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.activateRecordList}
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