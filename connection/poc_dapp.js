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