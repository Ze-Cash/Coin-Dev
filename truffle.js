//const HDWalletProvider = require("truffle-hdwallet-provider");
var config1 = require('./config/config');
var Web3 = require('web3');
var web3 = new Web3();
//const infura_apikey = config1.infura_apikey;
//const mnemonic = config1.mnemonic;

const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const privKey = config1.privkey; // raw private key

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(privKey, config1.clientEndPoint);
      },
      network_id: 3,
      gas: 4700000,   // <--- Twice as much
      //gasPrice: 10000000000
      gasPrice: web3.toWei('10','gwei')

    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(privKey, config1.clientEndPoint);
      },
      network_id: 2,
      gas: 4700000,   // <--- Twice as much
      //gasPrice: 10000000000
      gasPrice: web3.toWei('10','gwei')

    }
  }
};




