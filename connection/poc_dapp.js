const contract = require('truffle-contract');
var sender = require('../config/config');
const zecash_artifact = require('../build/contracts/ZeCash_PoS.json');
var ZCH = contract(zecash_artifact);

ZCH.defaults({
	
  from:  sender.address
  //from: '0xa2E2e7a41F93A01337B6272fb2E38Fe82584f8E9'
})

module.exports = {
  
  start: function(callback) {
    var self = this;

    // Bootstrap the ZCH abstraction for Use.
    ZCH.setProvider(self.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        console.log("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];

      callback(self.accounts);
    });


  },

  getZecash: function(address,amount,sender, callback) {
  	var self = this;

  	// Bootstrap the ZCH abstraction for Use.
    ZCH.setProvider(self.web3.currentProvider);

    var zch;
    ZCH.deployed().then(function(instance) {
      zch = instance;
      console.log("reached here");
      return zch.getZecash(address, amount, {from: sender, gas:3000000});
    }).then(function() {
      self.refreshBalance(address, function (answer) {
      	 console.log("reached here1");
        callback(answer);
      });
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });

  },

  getCoinAge: function (address, sender, callback) {
  	var self  = this;
  	ZCH.setProvider(self.web3.currentProvider);

  	var zch;
  	ZCH.deployed().then(function(instance) {
  		zch = instance;

  		return zch.getCoinAge(address,{from:sender});
  	}).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
        console.log(e);
        callback("Error 404");
    });
  },

  refreshBalance: function(account, callback) {
    var self = this;

    // Bootstrap the SLT abstraction for Use.
    ZCH.setProvider(self.web3.currentProvider);
   
    var zch;
    ZCH.deployed().then(function(instance) {
      zch = instance;
      return zch.getBalance.call(account);
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
        console.log(e);
        callback("Error 404");
    });
  },

  getListedAsValidator: function(address,sender, callback) {
  	var self = this;

  	// Bootstrap the ZCH abstraction for Use.
    ZCH.setProvider(self.web3.currentProvider);

    var zch;
    ZCH.deployed().then(function(instance) {
      zch = instance;
     
      return zch.setValidators(address, {from: sender, gas:3000000});
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });

  },

  getListedAsValidatorNew: function(address,sender, callback) {
    var self = this;
    var config = require('../config/config');
    var Web3 = require('web3');
    var web3 = new Web3(config.clientEndPoint);

    var sender = config.address;
    var contractAddr = config.contractAddress;
    
    //var address = '0x3042D8086E1a52D6a2c4D7B8068a1064bDC32FCC';


    var tokenInstance = new web3.eth.Contract(zecash_artifact.abi, contractAddr, {
      from: sender
    });

    var txnNonce;
    var txnObject;

    web3.eth.getTransactionCount(sender)
      .then(function(data){
        txnNonce = data;
        console.log(txnNonce);
        txnObject = {
          from : sender,
          to : contractAddr,
          value : "0x0",
          gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'Gwei')),
          gas: web3.utils.toHex('250000'),
          nonce: txnNonce,
          data: tokenInstance.methods.setValidators(address).encodeABI()
        };

        console.log(txnObject);

        //sendTransactionToEth(txnObject, req.body.prvkey);

        var Tx = require('ethereumjs-tx');
        var privateKey = new Buffer(config.privkey, 'hex');

        var tx = new Tx(txnObject);
        tx.sign(privateKey);

        var serializedTx = tx.serialize();
        console.log(serializedTx);

        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
          .on('receipt', function(receipt){
            console.log("Receipt Called");
            callback(receipt.valueOf());
            /* res.json({
              "data" : receipt
            }); */
          })
          .on('error', function(err){
            console.log("Error Called: "+ err);

            var minedPending = "Be aware that it might still be mined";
            var sourceErr = " " + err + " ";
            if(sourceErr.indexOf(minedPending) !== -1)
            {
              var rtnObj = {
                "status" : "pending",
                "data" : err,
                "errmsg" : "Your transaction is on the Blockchain. Depending on data traffic, it may take anywhere between 5-30 minutes to execute. Kindly check your wallet again in some time to be sure that the transaction was successfully executed."
                };

              callback(rtnObj.valueOf());  
            }
            else
            {
              console.log(e);
              callback("ERROR 404");
              /* res.json({
                "status" : "error",
                "data" : err,
                "errmsg" : "There has been some error processing your transaction. Please try again later."
              }) */
            }
          });
      });

    /*}) .then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    }); */

  },

  getAllValidatorsNew: function (callback) {
    var self = this;
    
    var config = require('../config/config');
    var Web3 = require('web3');
    var web3 = new Web3(config.clientEndPoint);

    var contractInstance = new web3.eth.Contract(zecash_artifact.abi, config.contractAddress);

    var number = contractInstance.methods.getValidators().call()
    .then(function(data){
      callback(data.valueOf());
    })
    .catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });

  },

  removeValidator: function (address, sender, callback) {
    var self = this;

    // Bootstrap the ZCH abstraction for Use.
    ZCH.setProvider(self.web3.currentProvider);

    var zch;
    ZCH.deployed().then(function(instance) {
      zch = instance;
     
      return zch.removeValidator(address, {from: sender, gas:3000000});
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });

  },

  getAllValidators: function (callback) {
  	var self = this;

  	// Bootstrap the ZCH abstraction for Use.
    ZCH.setProvider(self.web3.currentProvider);

    var zch;
    ZCH.deployed().then(function(instance) {
      zch = instance;
      return zch.getValidators();
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  },

  getValidator: function(address,callback) {
  	var self = this;

  	ZCH.setProvider(self.web3.currentProvider);

  	var zch;
  	ZCH.deployed().then(function (instance) {
  		zch = instance;
  		return zch.getValidator(address);
  	}).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  },


  getAllIndexes: function (callback) {
    var self = this;

    // Bootstrap the ZCH abstraction for Use.
    ZCH.setProvider(self.web3.currentProvider);

    var zch;
    ZCH.deployed().then(function(instance) {
      zch = instance;
      return zch.getAllIndexes();
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  },

  getBlock: function(index,callback) {
    var self = this;

    ZCH.setProvider(self.web3.currentProvider);

    var zch;
    ZCH.deployed().then(function (instance) {
      zch = instance;
      return zch.getBlock(index);
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  },

  forgeBlock: function(index,address,sender,callback) {
    var self = this;

    ZCH.setProvider(self.web3.currentProvider);

    var zch;
    ZCH.deployed().then(function (instance) {
      zch = instance;
      return zch.forgeBlock(index,address, {from: sender, gas: 3000000});
    }).then(function(value) {
      console.log("reached here");
        callback(value.valueOf());
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  },

  mint: function(address,sender,callback) {
    var self = this;

    ZCH.setProvider(self.web3.currentProvider);

    var zch;
    ZCH.deployed().then(function (instance) {
      zch = instance;
      return zch.mint(address, {from: sender, gas: 3000000});
    }).then(function(value) {
      console.log("reached here + mint");
        callback(value.valueOf());
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  }
  
}