import * as React from 'react';
import { NavBar, Icon, Button,Carousel} from "antd-mobile";
import { History, Location } from "history";
import "./Treedetail.css"
import { UIUtil } from '../../utils/UIUtil';
// import { UserStorage } from "../../storage/UserStorage";
import { UserService } from '../../service/UserService';
import Banner from "../../assets/banner.jpg"


export interface TreedetailProps {
    history: History,
    location: Location
}

export interface TreedetailState {
    banners:any,

}

export class Treedetail extends React.Component<TreedetailProps, TreedetailState> {
    agree: boolean
    constructor(props: TreedetailProps) {
        super(props);
        this.agree = true
        this.state = {
            banners:[],
        }
    }


    onRedirectBack = () => {
        this.props.history.goBack();

    }

    onChangeChecked = (event: any) => {
        this.agree = event.target.checked;
    }

    onSubmit = (event: React.MouseEvent) => {
        event.preventDefault();
        this.props.history.push("/exchange");
    }
    
    //获取轮播图2
    getBanner = () => {
        UserService.Instance.banner(2).then( (res) => {
            
            this.setState({
                banners:res.data?res.data:Banner,
            })
        }).catch( err => {
            UIUtil.showError(err);
            this.setState({
                banners:Banner
            })
        })
    }

    public componentWillMount() {
        this.getBanner();
        
    }

    public render() {
        let banners = [];
          if(this.state.banners.length != 0 ){
            for(let i of this.state.banners){
                banners.push(<div><img className="banner-img" src={i.img_path} /></div>)
            }
          }else{
            banners.push(<div><img className="banner-img" src={Banner} /></div>)
          }
        return (
            <div className="message-container">
                <NavBar icon={<Icon type="left" />}
                    onLeftClick={this.onRedirectBack}
                    className="home-navbar" >
                    <div className="nav-title">绿奇楠树(苗)</div>
                </NavBar>
                <div className="tree-banner ">
                                    <Carousel autoplay dots>
                                        {banners}
                                    </Carousel>
                                </div>
                <div className="page-content-container exchange-argeement-container">
                    <div style={{lineHeight:'.19rem',textIndent:".28rem",color:"#000"}}>
                        <p style={{margin:"0"}}>
                            奇楠，是沉香中的极品。奇楠是沉香升华质变而成，需要大自然及其苛刻的特殊条件及偶性。早期香农在野外采香时，从山上寻回来的野生奇楠沉香苗，种植过程中奇楠树不管是外伤还是内感染所结的香都是奇楠香，且不管树根、树干、树枝一旦有受伤都能结奇楠香。结香体颜色呈默绿、黄绿、鹦哥绿，故称为绿棋楠。
                        </p>
                        <p style={{margin:"0"}}>
                            人工种植的速生绿奇楠手感温软，过手留香，油脂含量高，气味穿透力强等特点。绿奇楠具有原料珍稀、功效卓实、香品高雅等特点，自古以来被列为香中之王。绿奇楠具有行气止痛、温中止呕，納气平喘功效，特别是心脑血管疾病用到奇楠实有“奇效”。也可园林观赏、收藏与投资价值，用途非常广阔。
                        </p>
                        <p style={{margin:"0"}}>
                            绿奇楠是未来真正的摇钱树，投资绿奇楠将成为理财的风向标。我司推出五年结香“莺歌绿＂绿奇楠品种，由会员进行委托公司进行种植。委托种植由我司技术人员专业护理！
                        </p>
                    </div>
                    <div className="address-footer-button-container" onClick={this.onSubmit}>
                        <Button type="primary" style={{color:"white"}}>立即购买</Button>
                    </div>
                </div>
            </div>
        );
    }
}
