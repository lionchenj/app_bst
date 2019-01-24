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
    selectedEarningStyle?: "2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"10"|"11"|"12"|"13",
    spanStyle:string

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
            visible: false,
            spanStyle:''
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
        console.log("selected-key", opt.key);
        this._loadDataWithStyle(opt.key)
        this.setState({
            ...this.state,
            visible: false,
            selectedEarningStyle: opt.key
        });
    }

    public render() {

      const spanStyle = {
        fontSize:".1rem",
        overflow:"hidden",
        color: "#888"
      }     
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
            const title = this._getStyleTypeTitle(rowData.style);

            return (
                <List.Item multipleLine extra={(rowData.plusminus == "-1"? "-" : (rowData.plusminus=="1"?"+":"")) + (rowData.number)} >
                {/* <List.Item multipleLine extra={(rowData.plusminus == "-1"? "-" : (rowData.plusminus=="1"?"+":"")) + (title === "解约返回"? "":rowData.number)} > */}

                {title} 
                &nbsp;<span style={spanStyle}>{(rowData.remarkinfo? ("(" + rowData.remarkinfo + ")"):"")}</span>
                <List.Item.Brief>{rowData.time}</List.Item.Brief>
                {/* <span style={spanStyle}  className="_item3">{(rowData.remarkinfo? ("(" + rowData.remarkinfo + ")"):"")}</span> */}
                </List.Item>
            );
          };
        const selectedStyleTitle = this._getStyleTypeTitle(this.state.selectedEarningStyle)
         return (
            <div className="message-container">
                {/* NavBar导航栏 */}
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" 
                    rightContent={
                        // Propover气泡
                        <Popover 
                          visible={this.state.visible}
                          overlay={[
                            (<Popover.Item icon={ <img src={iconFilterAll} className="am-icon am-icon-xs" alt="" /> } data-seed="logId">全部</Popover.Item>),
                            (<Popover.Item key={"1"} icon={ <img src={iconFilterRecoment} className="am-icon am-icon-xs" alt="" /> }>分享奖励</Popover.Item>),
                            (<Popover.Item key={"3"} icon={ <img src={iconFilterRecoment} className="am-icon am-icon-xs" alt="" /> }>团队奖励</Popover.Item>),
                            (<Popover.Item key={"5"} icon={ <img src={iconFilterSpeed} className="am-icon am-icon-xs" alt="" /> }>加速奖励</Popover.Item>),
                            (<Popover.Item key={"4"} icon={ <img src={iconFilterManage} className="am-icon am-icon-xs" alt="" /> }>增值奖励</Popover.Item>),
                            (<Popover.Item key={"2"} icon={ <img src={iconFilterCommunity} className="am-icon am-icon-xs" alt="" /> }>管理奖励</Popover.Item>),
                            (<Popover.Item key={"6"} icon={ <img src={iconFilterSpeed} className="am-icon am-icon-xs" alt="" /> }>销售记录</Popover.Item>),
                            // (<Popover.Item key={"7"} icon={ <img src={iconFilterSpeed} className="am-icon am-icon-xs" alt="" /> }>销售失败</Popover.Item>),
                            (<Popover.Item key={"8"} icon={ <img src={iconFilterSpeed} className="am-icon am-icon-xs" alt="" /> }>再种记录</Popover.Item>),
                            (<Popover.Item key={"9"} icon={ <img src={iconFilterManage} className="am-icon am-icon-xs" alt="" /> }>解约返回</Popover.Item>),

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
                        <div className="nav-title">交易流水</div>
                </NavBar>
                <div className="earings-filter-type-text">显示{(selectedStyleTitle ==="销售成功"?"销售记录":selectedStyleTitle)}{this.state.dataSource.getRowCount()}条</div>
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
        console.log(profitData)
        if(profitData  == undefined){
          this.props.history.push("/login")
        }else{
        const offsetTop = (ReactDOM.findDOMNode(this.lv)!.parentNode! as HTMLElement).offsetTop
        const hei = document.documentElement.clientHeight - offsetTop
        console.log(this.state.dataSource.cloneWithRows(profitData.list))

          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(profitData.list),
            isLoading: false,
            hasMore: false,
            height: hei
          });
        }
        
      }).catch( err => {
        console.log(err)

        if(err.errno=="401"||err.errno=="400"){
            this.props.history.push("/login")

          }

    })
    }

    //左方列表分类名称
    private _getStyleTypeTitle(selectedType?: string): string {
      let title = ""
      if (!selectedType) {
        title = "全部"
        return title
      }
      switch(selectedType) {
        case "0":
          title = "解约返回"
          break;
        case "1":
          title = "分享奖励"
          break;
        case "2":
          title = "管理奖励"
          break;
        case "3":
          title = "团队奖励"
          break;
        case "4":
          title = "增值奖励"
          break;
        case "5":
          title = "加速奖励"
          break;
        case "6":
          title = "销售成功"
          break;
        case "7":
          title = "销售失败"
          break;
        case "8":
          title = "再种记录"
          break;
        case "9":
          title = "解约返回"
          break;
        case "10":
          title = "扣除回购手续费"
          break;
        case "11":
          title = "返还回购手续费"
          break;
        case "12":
          title = "扣除回购优先服务费"
          break; 
        case "13":
          title = "返还回购优先服务费"
          break;         
        default:
          break;
      }
      return title
    }
}