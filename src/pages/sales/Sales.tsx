import * as React from 'react';
import ReactDOM from "react-dom";
import { NavBar, Icon, ListView} from "antd-mobile";
import { History } from "history";


import "./Sales.css"

interface SalesProps {
    history: History
}


interface SalesState {
    dataSource: any,
    isLoading: boolean,
    hasMore: boolean,
    height: number
}

const data = [
    {
      type: "EOS",
      date: "2018-08-19  17:20",
      num: "+500.00"
    },
    {
        type: "小币",
        date: "2018-08-19  17:20",
        num: "-100.00"
    },
    {
        type: "EOS",
        date: "2018-08-19  17:20",
        num: "+250.00"
      },
  ];

const NUM_ROWS = 20;
let pageIndex = 0;

function genData(pIndex = 0) {
  const dataBlob = {};
  for (let i = 0; i < NUM_ROWS; i++) {
    const ii = (pIndex * NUM_ROWS) + i;
    dataBlob[`${ii}`] = `row - ${ii}`;
  }
  return dataBlob;
}


export class Sales extends React.Component<SalesProps, SalesState> {
    rData: any
    lv: any

    constructor(props: SalesProps) {
        super(props);
        
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1: any, row2: any) => row1 !== row2,
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

    componentDidMount() {
        // you can scroll to the specified position
        // setTimeout(() => this.lv.scrollTo(0, 120), 800);
      
        const offsetTop = (ReactDOM.findDOMNode(this.lv)!.parentNode! as HTMLElement).offsetTop
        const hei = document.documentElement.clientHeight - offsetTop
        // simulate initial Ajax
        setTimeout(() => {
          this.rData = genData();
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            isLoading: false,
            height: hei
          });
        }, 600);
      }

      onEndReached = (event:any) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
          return;
        }
        console.log('reach end', event);
        this.setState({ isLoading: true });
        setTimeout(() => {
          this.rData = { ...this.rData, ...genData(++pageIndex) };
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            isLoading: false,
          });
        }, 1000);
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
          let index = data.length - 1;
          const row = (rowData: any, sectionID: number, rowID: number) => {
            if (index < 0) {
              index = data.length - 1;
            }
            const obj = data[index--];
            return (
              <div className="sales-row-item" key={rowID}>
                
                  <div >
                      <div className="sales-row-item-bold">{obj.type}</div>
                      <div className="sales-row-item-normal">{obj.date}</div>
                  </div>
                  <div >
                    <div className="sales-row-item-right">{obj.num}</div>
                  </div>
                </div>
            
            );
          };


        return (
            <div className="sales-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">销售记录</div>
                </NavBar>
                <div className="fans-list-view-container">
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                    {this.state.isLoading ? 'Loading...' : 'Loaded'}
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