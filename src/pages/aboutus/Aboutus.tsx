import * as React from 'react';

import { NavBar, Icon} from "antd-mobile";
import { History, Location } from "history";

import "./Aboutus.css"
//import { model } from '../../model/model';
import { UserService } from '../../service/UserService';

interface AboutusProps {
    history: History,
    location: Location
}
interface AboutusState {
    aboutus:any
}
export class Aboutus extends React.Component<AboutusProps,AboutusState> {
    
    constructor(props: AboutusProps) {
        super(props)
        this.state = {
            aboutus:''
        }
    }
    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    public componentDidMount() {
        UserService.Instance.aboutus().then( (res) => {
            console.log(res)
            this.setState({
                aboutus:res.data
            })
        })
    }

    public render() {
        return (
            <div className="aboutus-detail-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">关于我们</div>
                </NavBar>
                <div className="aboutus-content-container">
                    
                    <div className="about-us-content" dangerouslySetInnerHTML={{__html: this.state.aboutus}}>
                     
                    </div>
                </div>
            </div>
        )
    }
}