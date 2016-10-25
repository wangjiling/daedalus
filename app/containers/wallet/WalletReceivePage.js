// @flow
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import WalletWithNavigation from '../../components/wallet/layouts/WalletWithNavigation';
import WalletReceive from '../../components/wallet/WalletReceive';

@observer(['store'])
export default class WalletReceivePage extends Component {

  static propTypes = {
    store: PropTypes.shape({
      wallet: PropTypes.object.isRequired,
    })
  };

  render() {
    const { wallet } = this.props.store;
    return (
      <WalletWithNavigation wallet={wallet}>
        <WalletReceive walletName={wallet.name} walletAddress={wallet.address} />
      </WalletWithNavigation>
    );
  }

}