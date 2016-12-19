// @flow
import faker from 'faker';
import type {
  walletStruct,
  userStruct,
  transactionStruct,
  getTransactionsRequest,
  createTransactionRequest,
  updateUserProfileFieldRequest,
  loginRequest
} from './index';

export default class StubRepository {

  user: userStruct;
  wallets: Array<walletStruct>;
  transactions: Array<transactionStruct>;

  constructor(
    user: userStruct, wallets: Array<walletStruct>, transactions: Array<transactionStruct>
  ) {
    this.user = user;
    this.wallets = wallets;
    this.transactions = transactions;
  }

  login(request: loginRequest) {
    return (
      request.email === this.user.profile.email &&
      request.passwordHash === this.user.profile.passwordHash
    );
  }

  findUser() {
    return this.user;
  }

  findWallets() {
    return this.wallets;
  }

  findTransactions(request: getTransactionsRequest) {
    const { searchTerm } = request;
    const regexp = new RegExp(searchTerm, 'i');
    const filteredTransactions = this.transactions
      .filter((t) => t.walletId === request.walletId) // Filter by walletId
      .filter((t) => regexp.test(t.title)) // Filter by title search
      .sort((a, b) => { // Sort by date
        const aIsSmallerOrEqual = a.date < b.date ? 1 : 0;
        return a.date > b.date ? -1 : aIsSmallerOrEqual;
      });
    return {
      transactions: filteredTransactions.slice(0, request.limit), // Limit number of requests
      total: filteredTransactions.length
    };
  }

  reset() {
    this.wallets = [];
    this.transactions = [];
  }

  generateUser(customData: Object) {
    this.user = Object.assign({}, {
      id: faker.random.uuid(),
      profile: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        phoneNumber: faker.phone.phoneNumber(),
        passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        passwordUpdateDate: faker.date.past(),
        languageLocale: 'en-US'
      }
    }, customData);
    return this.user;
  }

  generateWallet(customData: Object) {
    const wallet: walletStruct = Object.assign({}, {
      userId: this.user.id,
      address: faker.finance.bitcoinAddress(),
      type: 'personal',
      currency: 'ada',
      amount: parseFloat(faker.finance.amount(), 10),
      name: faker.finance.accountName(),
      lastUsed: true
    }, customData);
    this.wallets.push(wallet);
    return wallet;
  }

  generateTransaction(request: createTransactionRequest, customData: Object) {
    const transaction: transactionStruct = Object.assign({}, request, {
      id: `t-id-${this.transactions.length}`,
      walletId: request.walletId,
      type: 'adaExpend',
      title: `Money to ${request.receiver}`,
      transactionId: faker.finance.bitcoinAddress(),
      amount: -1 * request.amount
    }, customData);
    this.transactions.push(transaction);
    return transaction;
  }

  updateProfileField(request: updateUserProfileFieldRequest) {
    this.user.profile[request.field] = request.value;
  }
}
