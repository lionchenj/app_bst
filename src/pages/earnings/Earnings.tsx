import * as React from 'react';
import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, List,  Popover} from "antd-mobile";
import { History } from "history";


import "./Earnings.css"

import iconFilterAll  from "../../assets/filter_all.png"
import iconFilterSpeed from "../../assets/filter_speed.png"
import iconFilterCommunity from "../../assets/filter_community.png"
import iconFilterManage from "../../assets/filter_manage.png"
import iconFilterRecoment from "../../assets/filter_recoment.png"
import { UserService } from '../../service/UserService';
import { model } from '../../model/model';

interface EarningsProps {
    history: History
}


interface EarningsState {
    dataSource: any,
    isLoading: boolean,
    hasMore: boolean,
    height: number,
    visible: boolean,
    selectedEarningStyle?: "2"|"3"|"4"|"5"
}





export class Earnings extends React.Component<EarningsProps, EarningsState> {
    rData: any
    lv: any

    constructor(props: EarningsProps) {
        super(props);
        
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1: any, row2: any) => row1 !== row2,
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
      this._loadDataWithStyle(this.state.selectedEarningStyle)
      
      }

      onEndReached = (event:any) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
          return;
        }

      }



    handleVisibleChange = (visible: boolean) => {
        this.setState({
            ...this.state,
            visible,
          });
    }

    onSelect = (opt: any) => {
        console.log("selected key", opt.key);
        this._loadDataWithStyle(opt.key)
        this.setState({
            ...this.state,
            visible: false,
            selectedEarningStyle: opt.key
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
       
          const row = (rowData: model.ProfitItem, sectionID: number, rowID: number) => {
            const title = this._getStyleTypeTitle(rowData.style)
            return (
                <List.Item multipleLine extra={rowData.number} >
                {title} <List.Item.Brief>{rowData.time}</List.Item.Brief>
                </List.Item>
  
            );
          };

         const selectedStyleTitle = this._getStyleTypeTitle(this.state.selectedEarningStyle)
        return (
            <div className="message-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" 
                    rightContent={
                        <Popover 
                          visible={this.state.visible}
                          overlay={[
                            (<Popover.Item icon={ <img src={iconFilterAll} className="am-icon am-icon-xs" alt="" /> } data-seed="logId">全部</Popover.Item>),
                            (<Popover.Item key={"1"} icon={ <img src={iconFilterRecoment} className="am-icon am-icon-xs" alt="" /> }>分享奖励</Popover.Item>),
                            (<Popover.Item key={"3"} icon={ <img src={iconFilterRecoment} className="am-icon am-icon-xs" alt="" /> }>团队奖励</Popover.Item>),
                            (<Popover.Item key={"5"} icon={ <img src={iconFilterSpeed} className="am-icon am-icon-xs" alt="" /> }>加速返还</Popover.Item>),
                            (<Popover.Item key={"4"} icon={ <img src={iconFilterManage} className="am-icon am-icon-xs" alt="" /> }>增值奖励</Popover.Item>),
                            (<Popover.Item key={"2"} icon={ <img src={iconFilterCommunity} className="am-icon am-icon-xs" alt="" /> }>管理奖励</Popover.Item>),
                          ]}
                          onVisibleChange={this.handleVisibleChange}
                          onSelect={this.onSelect}
                        >
                          <div style={{
                            height: '100%',
                            padding: '0 15px',
                            marginRight: '-15px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          >
                            筛选
                          </div>
                        </Popover>
                    }
        
                    >
                        <div className="nav-title">收益流水</div>
                </NavBar>
                <div className="earings-filter-type-text">显示{selectedStyleTitle}{this.state.dataSource.getRowCount()}条</div>
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

    private _loadDataWithStyle(selectedType?: string) {
      UserService.Instance.profit(selectedType).then( (profitData) => {
        const offsetTop = (ReactDOM.findDOMNode(this.lv)!.parentNode! as HTMLElement).offsetTop
        const hei = document.documentElement.clientHeight - offsetTop

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(profitData.list),
          isLoading: false,
          hasMore: false,
          height: hei
        });
      })
    }
    private _getStyleTypeTitle(selectedType?: string): string {
      let title = ""
      if (!selectedType) {
        title = "全部"
        return title
      }
      switch(selectedType) {
        case "1":
          title = "分享奖励"
          break
        case "2":
          title = "管理奖励"
          break
        case "3":
          title = "团队奖励"
          break
        case "4":
          title = "增值奖励"
          break
        case "5":
          title = "加速奖励"
          break
        default:
          break
      }
      return title
    }
}