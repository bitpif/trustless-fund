import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

import TrustlessFund from './contracts/TrustlessFund.json';
import ERC20 from './contracts/ERC20.json';
import getWeb3 from "./getWeb3";

import Index from './pages/Index';
import Fund from './pages/Fund';

// import './layout/config/_base.sass';

class App extends Component {
  state = { 
    web3: null, 
    accounts: null,
    account: null,
    fund: null,
    erc20: null,
    depositAmount: '',
    depositToken: '',
    approveToken: '',
    withdrawAmount: '',
    withdrawToken: ''
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TrustlessFund.networks[networkId];
      const fund = new web3.eth.Contract(
        TrustlessFund.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, fund });
    } catch (error) {
      console.error(error);
    }

    this.accountInterval = setInterval(async () => {
      const accounts = this.state.accounts;
      if (accounts[0] !== this.state.account) {
        this.setState({
          account: accounts[0]
        });
      }
    }, 1000);

    console.log(this.state);
  };

  // GET ERC20 TOKEN

  getERC20Token = (address) => {
    const erc20 = new this.state.web3.eth.Contract(
      ERC20.abi,
      address
    );

    this.setState({erc20});
  }

  // HANDLE APPROVE

  handleApproveTokenChange = (e) => {
    this.setState({approveToken: e.target.value});
  }

  handleApproveAmountChange = (e) => {
    this.setState({approveAmount: e.target.value});
  }

  handleApproveSubmit = async (e) => {
    e.preventDefault();

    await this.getERC20Token(this.state.approveToken);

    this.state.erc20.methods.approve(
      this.state.account,
      this.state.fund.address,
      this.state.approveAmount
    ).send({from: this.state.account});

    this.setState({approveToken: '', approveAmount: ''});
  }

  // HANDLE ALLOWANCE

  handleAllowanceTokenChange = (e) => {
    this.setState({allowanceToken: e.target.value});
  }

  handleAllowanceSubmit = async (e) => {
    await this.getERC20Token(this.state.allowanceToken);

    this.state.erc20.methods.allowance(
      this.state.account,
      this.state.fund.address
    ).call();

    // Return allowance

    this.setState({allowanceToken: ''});
  }

  // HANDLE DEPOSIT

  handleDepositAmountChange = (e) => {
    this.setState({depositAmount: e.target.value});
  }

  handleDepositTokenChange = (e) => {
    this.setState({depositToken: e.target.value});
  }

  handleDepositSubmit = (e) => {
    e.preventDefault();

    if(this.state.depositToken === "0x0000000000000000000000000000000000000000") {
      this.state.fund.methods.deposit(
        this.state.depositAmount,
        this.state.depositToken
      ).send({from: this.state.account, value: this.state.depositAmount});
    } else {
      this.state.fund.methods.deposit(
        this.state.depositAmount,
        this.state.depositToken
      ).send({from: this.state.account});
    }

    this.setState({depositAmount: '', depositToken: ''});
  }

  // HANDLE WITHDRAW

  handleWithdrawAmountChange = (e) => {
    this.setState({withdrawAmount: e.target.value});
  }

  handleWithdrawTokenChange = (e) => {
    this.setState({withdrawToken: e.target.value});
  }

  handleWithdrawSubmit = (e) => {
    e.preventDefault();

    this.state.fund.methods.withdraw(
      this.state.withdrawAmount,
      this.state.withdrawToken
    ).send({from: this.state.account});

    this.setState({withdrawAmount: '', withdrawToken: ''});
  }

  render() {
    return (
      <div className="app">
        {/* TODO: Work on routing later */}

        {/* {this.state.factory &&
          <Router basename="/">
            <Route 
              exact path="/" 
              component={Index}
            />
            <Route 
              path="/fund/:fundId" 
              component={Fund}
            />
          </Router>
        } */}

        <h1>Trust Fund</h1>

        {/* Approve Token */}

        <h2>Approve Token</h2>
        <form onSubmit={this.handleApproveSubmit}>
          <input 
            type="text"
            value={this.state.approveToken}
            placeholder="token"
            onChange={this.handleApproveTokenChange}
          />
          <input 
            type="number"
            value={this.state.approveAmount}
            placeholder="amount"
            onChange={this.handleApproveAmountChange}
          />
          <button>Submit</button>
        </form>
        
        {/* Token Allowance */}

        <h2>Token Allowance</h2>
        <form onSubmit={this.handleAllowanceSubmit}>
          <input 
            type="text"
            value={this.state.allowanceToken}
            placeholder="token"
            onChange={this.handleAllowanceTokenChange}
          />
          <button>Submit</button>
        </form>

        {/* Deposit */}

        <h2>Deposit</h2>
        <form
          onSubmit={this.handleDepositSubmit}
        >
          <input
            type="number"
            value={this.state.depositAmount}
            placeholder="amount"
            onChange={this.handleDepositAmountChange}
          />
          <input
            type="text"
            value={this.state.depositToken}
            placeholder="token"
            onChange={this.handleDepositTokenChange}
          />
          <button>
            Submit
          </button>
        </form>

        {/* Withdraw */}

        <h2>Withdraw</h2>
        <form onSubmit={this.handleWithdrawSubmit}>
          <input
            type="number"
            value={this.state.withdrawAmount}
            placeholder="amount"
            onChange={this.handleWithdrawAmountChange}
          />
          <input
            type="text"
            value={this.state.withdrawToken}
            placeholder="token"
            onChange={this.handleWithdrawTokenChange}
          />
          <button>
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default App;
