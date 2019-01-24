import * as React from 'react';
import './App.css';
// import { Button } from 'antd-mobile'
import { Switch, Route } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";
import { Login } from "./pages/login/Login";
import { Register } from "./pages/register/Register";
import { IdCard } from "./pages/idcard/IdCard";
import { BankCard } from "./pages/bankcard/BankCard";
import { BankCardAdd } from "./pages/bankcard/BankCardAdd";
import { Home } from "./pages/home/Home";
import { MyTeam } from "./pages/myTeam/MyTeam";
import { Settings } from "./pages/settings/Settings";
import { Message } from "./pages/message/Message";
import { Community } from "./pages/community/Community";
import { UpdatePwd } from "./pages/updatePwd/UpdatePwd";
import { Feedback } from "./pages/feedback/Feedback";
import { Aboutus } from "./pages/aboutus/Aboutus";
import { Exchange } from "./pages/exchange/Exchange";
import { ExchangeAgreement } from "./pages/exchangeAgreement/ExchangeAgreement";
import { Change } from "./pages/change/Change"
import { Wallet } from "./pages/wallet/Wallet";
import { Deposit } from "./pages/deposit/Deposit"
import { Earnings } from "./pages/earnings/Earnings";
// import { Activate } from "./pages/activate/Activate";
import { WithdrawHistory } from "./pages/withdrawHistory/WithdrawHistory";
import { DepositHistory } from "./pages/depositHistory/DepositHistory";
import { ChangeHistory } from "./pages/changeHistory/ChangeHistory";
import { MessageDetail } from "./pages/messageDetail/MessageDetail";
import { UserStorage } from "./storage/UserStorage";
import { Treedetail } from "./pages/treedetail/Treedetail";
import { NoContract } from "./pages/noContract/NoContract";
import { NoContractHistory } from "./pages/noContractHistory/NoContractHistory";
import { TeamHistory } from "./pages/teamHistory/TeamHistory";

// const NotFound = () => (
//   <div> Sorry, this page does not exist. </div>
// )
const accessToken = UserStorage.getCookie("User.AccessTokenKey");


class App extends React.Component {
  public render() {
    return (
      <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <Route path="/login"  component={Login} />
          <Route path="/register"  component={Register} />
          <Route path="/idcard" component={IdCard} />
          <Route path="/bankcard" component={BankCard} />
          <Route path="/bankcardadd" component={BankCardAdd} />
          <PrivateRoute path="/myTeam"  component={MyTeam} />
          <PrivateRoute path="/settings" component={Settings} />
          <PrivateRoute path="/message" component={Message} />
          <PrivateRoute path="/aboutus" component={Aboutus} />
          <PrivateRoute path="/community" component={Community} />
          <Route path="/update_pwd" component={UpdatePwd} />
          <PrivateRoute path="/feedback" component={Feedback} />
          <PrivateRoute path="/exchangeAgreement" component={ExchangeAgreement} />
          <PrivateRoute path="/exchange" component={Exchange} />
          <PrivateRoute path="/treedetail" component={Treedetail} />
          <PrivateRoute path="/noContract"  component={NoContract} />
          <PrivateRoute path="/noContractHistory"  component={NoContractHistory} />
          <PrivateRoute path="/teamHistory"  component={TeamHistory} />

          <PrivateRoute path="/change" component={Change} />
          <PrivateRoute path="/wallet" component={Wallet} />
          <PrivateRoute path="/deposit" component={Deposit} />
          <PrivateRoute path="/earnings" component={Earnings} />
          {/* <PrivateRoute path="/activate" component={Activate} /> */}
          <PrivateRoute path="/withdrawHistory" component={WithdrawHistory} />
          {/* 交易流水，尚未设置跳转 */}
          <PrivateRoute path="/depositHistory" component={DepositHistory} />
          <PrivateRoute path="/changeHistory" component={ChangeHistory} />
          <PrivateRoute path="/messageDetail" component={MessageDetail} />
          <Route component={Home} />
          <Route component={accessToken?Home:Login} />

      </Switch>
    );
  }
}

export default App;
