import React, {Component} from 'react';
import Asset from './Asset';
import '../../layout/components/assets.sass';

class Assets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenList: this.props.tokenList
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({tokenList: nextProps.tokenList});
  }

  render() {
    return (
      <div className="assets">
        <div className="assets__details">
          <p className="assets__detail">
            Assets
          </p>
          <p className="assets__detail">
            Amount/USD
          </p>
        </div>
        {this.state.tokenList.length === 0 &&
          <p className="asset__empty">
            No assets yet... Click deposit to get started.
          </p>
        }
        <ul className="assets__list">
          {this.state.tokenList.map((token, i) => {
            if(token.balance > 0) {
              return (<Asset 
                key={i} 
                token={token} 
                drizzle={this.props.drizzle} />);
            } else {
              return null;
            }
          })}
        </ul>
      </div>
    );
  }
}

export default Assets;