import * as React from 'react';
import { NavBar, Icon, Button, } from "antd-mobile";
import { History, Location } from "history";
import "./ExchangeAgreement.css"
import { UIUtil } from '../../utils/UIUtil';

export interface ExchangeAgreementProps {
    history: History,
    location: Location
}

export interface ExchangeAgreementState {

}

export class ExchangeAgreement extends React.Component<ExchangeAgreementProps, ExchangeAgreementState> {
    agree: boolean
    constructor(props: ExchangeAgreementProps) {
        super(props);
        this.agree = false
        this.state = {

        }
    }

    onRedirectBack = () => {
        this.props.history.push("/")

    }

    onChangeChecked = (event: any) => {
        this.agree = event.target.checked
    }

    onSubmit = (event: React.MouseEvent) => {
        event.preventDefault()
        if (!this.agree) {
            UIUtil.showInfo("请先了解并同意《寳树通协议》")
            return
        }
        this.props.history.push("/exchange")
    }

    public render() {
        return (
            <div className="message-container">
                <NavBar icon={<Icon type="left" />}
                    onLeftClick={this.onRedirectBack}
                    className="home-navbar" >
                    <div className="nav-title">寳树通协议</div>
                </NavBar>
                <div className="page-content-container exchange-argeement-container">
                    <div >
                        {/* <p>寳树通协议</p>
                        <p>通证是由寳树通发布用于兑换（交易等）的相应年龄的沉香树所用的凭证，寳树通打造“沉香树”中的极品：绿奇楠！最终实现沉香托管平台，传承千年沉香文化！</p>
                        <p>一、沉香树的拥有权以及管理！</p>
                        <p>1.用户首次拥有1万个以上的通证，公司增送专属个人树权证！</p>
                        <p>2.获得树权证后，沉香树苗种植托管于公司指定基地进行种植培育管理，这培育种植过程中，公司派专人进行锄草，浇水，采香，结香管理等，为了沉香树良好快速的发展，公司将收取五年的管理费！</p>
                        <p>3.期间沉香树如遇死亡，公司将进行重新种植！</p>
                        <p>4.沉香树的长大后，当产生的收益后，按照市场价格进行销售，其中书权证本人获得销售额70%利润，公司获得30%！</p>
                        <p>5.沉香树种植后五年后将收回沉香树收益权！</p>
                        <p>以上最终解释权归寳树通所有！</p> */}
                        <p>根据《中华人民共和国合同法》的规定，甲乙双方经充分协商，在平等自愿的基础上，就认购及委托管养种植奇楠树苗事宜达成如下协议</p>
                        <p>一、甲方的权利及义务</p>
                        <p>1、甲方负责委托管养种植奇楠树苗的培育、种植、管理、结香、销售，保证所提供的奇楠树苗的品种品质，保证百分百成活率（不可抗力的自然灾害除外）。</p>
                        <p>2、甲方负责奇楠树苗在种植期间的运输、装卸费用。</p>
                        <p>3、奇楠树苗成长一年以上乙方卖出时，同等价格甲方有权优先收购。</p>
                        <p>4、甲方负责奇楠树苗从落地到加工的全程溯源技术。</p>
                        <p>5、甲方负责种植树苗所有专业人员的工资发放。</p>
                        <p>6、甲方负责对树苗基地的科学化管理、设备、人工和管护开支的一切费用。</p>
                        <p>7、甲方提供树苗认购和委托管养种植及树苗生长信息的平台建设。</p>
                        <p>二、乙方的权利及义务</p>
                        <p>1、乙方有权检测树苗的品质和前往基地实地考察。</p>
                        <p>2、乙方享受结香后销售收益的优先分红权。</p>
                        <p>3、乙方享受结香后加工产品的产品优先购买权。</p>
                        <p>4、乙方享有树苗销售推广和沉香产品的推广分享权。</p>
                        <p>5、乙方有权一年后出售所持有树苗。</p>
                        <p>6、乙方有权随时对树苗的生长进行实地考察。</p>
                        <p>三、收益与分成</p>
                        <p>甲方在奇楠沉香树生长周期满3年后负责人工结香技术的施工作业，第5年人工采香销售，每棵奇楠沉香树第五年的预期采香克重（整伐技术）约为300克-500克，采香后的销售收益的70%归乙方所有，30%归甲方所有（如采香后的销售收益不足以支付给乙方前期投入本金金额的，则优先支付乙方前期投入的本金后再按比例进行利润分配）。</p>
                        <p>四、违约责任</p>
                        <p>1、甲方需保障种植的品种为奇楠树（苗），否则乙方有权申请赔偿。</p>
                        <p>2、甲方需保障奇楠树在5年内正常存活及管理，出现不可抗力的自然灾害除外。</p>
                        <p>3、甲方如不按规定期限内进行采香、销售，乙方有权将树移走或申请赔偿。</p>
                        <p>4、乙方在签订协议之日起除本协议规定外不可无故毁约，无故毁约甲方不承担任何责任。</p>
                        <p>5、本协议从签订之日起生效，协议期限为5年，如合同期满乙方单方面终止合同，则合同失效。</p>
                        <p>6、本协议未尽事宜，由各方协商签订补充协议，其补充协议与本合同具有同等法律效力。</p>
                        <p>7、乙方可通过线上下载打印标准的电子协议，平台的电子协议会根据具体经营情况进行部分调整，以最后更新的最新版为准。</p>
                        <p>8、甲、乙双方有其他原因致使协议内容发生改变，由双方协商可补签变更协议。</p>
                        <p>9、本协议通过线上支付购买后即时生效，如需纸质协议可线下申请。本协议在履行过程中如出现争议，由甲乙双方协商解决；协商不成，由相关部门进行调解；协商、调解不成的，可向甲方所在地人民法院申请诉讼。</p>
                        <p>10、本协议最终解释权归广州宝树通农业科技有限公司所有。</p>
                    </div>
                    <div className="argeement-confirm">
                        <label><input type="checkbox" onChange={this.onChangeChecked} />&nbsp;&nbsp;我已了解并同意《寳树通协议》</label>
                    </div>
                    <div className="address-footer-button-container" onClick={this.onSubmit}>
                        <Button type="primary">同意</Button>
                    </div>
                </div>
            </div>
        );
    }
}
