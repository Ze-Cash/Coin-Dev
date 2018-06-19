const contract = require('truffle-contract');
var config = require('../config/config');
const zecash_artifact = require('../build/contracts/ZeCash_PoS.json');
var ZCH = contract(zecash_artifact);

/*ZCH.defaults({
	
  from:  config.address
  //from: '0xa2E2e7a41F93A01337B6272fb2E38Fe82584f8E9'
})*/

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

  getCoinAge: function (address, callback) {
  	var self  = this;
    var config = require('../config/config');
    var Web3 = require('web3');
    var web3 = new Web3(config.clientEndPoint);
   
    var contractInstance = new web3.eth.Contract(zecash_artifact.abi, config.contractAddress);

    var number = contractInstance.methods.getCoinAge(address).call()
    .then(function(data){
      callback(data.valueOf());
    })
    .catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
    
  },
  

  refreshBalance: function(account, callback) {
    var self = this;

    var config = require('../config/config');
    var Web3 = require('web3');
    var web3 = new Web3(config.clientEndPoint);
   
    var contractInstance = new web3.eth.Contract(zecash_artifact.abi, config.contractAddress);

    var number = contractInstance.methods.getBalance(account).call()
    .then(function(data){
      callback(data.valueOf());
    })
    .catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });

  },

  getAllValidators: function (callback) {
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


  getListedAsValidator: function(address,sender,key, callback) {
    var self = this;
    var config = require('../config/config');
    var Web3 = require('web3');
    var web3 = new Web3(config.clientEndPoint);

    
    var contractAddr = config.contractAddress;
    
    //var address = '0x3042D8086E1a52D6a2c4D7B8068a1064bDC32FCC';


    var tokenInstance = new web3.eth.Contract(zecash_artifact.abi, contractAddr, {
      from: sender
    });

    var txnNonce;
    var txnObject;

    web3.eth.getTransactionCount(sender,'pending')
      .then(function(data){
        txnNonce = data;
        //console.log(txnNonce);
        txnObject = {
          from : sender,
          to : contractAddr,
          value : "0x0",
          gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'Gwei')),
          gas: web3.utils.toHex('250000'),
          nonce: web3.utils.toHex(txnNonce),
          data: tokenInstance.methods.setValidators(address).encodeABI()
        };


        /*
          
          {"nonce":"0x0174",
          "gasPrice":"0x098bca5a00",
          "gasLimit":"0x5208",
          "to":"0x5993e434528E5b40A7676838f37CE3400F984744",
          "value":"0x0de0b6b3a7640000",
          "data":"0x",
          "chainId":3}


        */

        console.log(txnObject);

        //sendTransactionToEth(txnObject, req.body.prvkey);
         
        var Tx = require('ethereumjs-tx');
        //console.log("Tx",Tx);    
        //console.log(config.privkey);   
        var privateKey = new Buffer(key, 'hex');
        // console.log("privateKey",privateKey); 
         //done till here
        var tx = new Tx(txnObject);//error in this line
        //console.log("tx",tx); 
        tx.sign(privateKey);

        var serializedTx = tx.serialize();
        //console.log("serializedTx",serializedTx);

        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
          .on('receipt', function(receipt){
            console.log("Receipt Called");
            callback(receipt.valueOf());
            /* res.json({
              "data" : receipt
            }); */
          }).catch(function(e) {
      console.log("e",e);
      callback("ERROR 404");
    });
          






        /*  .on('error', function(err){
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
              
            }
          });*/
      }).catch(function(e1) {
      console.log("e1",e1);
      callback("ERROR 404");
    });;

    /*}) .then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    }); */

  },

  removeValidator: function (address, sender,key, callback) {
    var self = this;

    var config = require('../config/config');
    var Web3 = require('web3');
    
    var web3 = new Web3(config.clientEndPoint);
   
    var contractAddr = config.contractAddress;

    var tokenInstance = new web3.eth.Contract(zecash_artifact.abi, contractAddr, {
      from: sender
    });

    var txnNonce;
    var txnObject;
    
      web3.eth.getTransactionCount(sender,'pending')
      .then(function(data){
        txnNonce = data;
        console.log(txnNonce);
        txnObject = {
          from : sender,
          to : contractAddr,
          value : "0x0",
          gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'Gwei')),
          gas: web3.utils.toHex('3000000'),
          nonce: web3.utils.toHex(txnNonce),
          data: tokenInstance.methods.removeValidator(address).encodeABI()
        };

        console.log(txnObject);

        var Tx = require('ethereumjs-tx');
        var privateKey = new Buffer(key, 'hex');

        var tx = new Tx(txnObject);
        tx.sign(privateKey);

        var serializedTx = tx.serialize();
        console.log(serializedTx);

        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
          .on('receipt', function(receipt){
            console.log("Receipt Called");
            callback(receipt.valueOf());
          
          }).on('error', function(err){
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
              
              callback("ERROR 404");
              
            }
          });
            
          });

  },

  getValidator: function(address,callback) {
  	var self = this;

    var config = require('../config/config');
    var Web3 = require('web3');
    var web3 = new Web3(config.clientEndPoint);

    var contractInstance = new web3.eth.Contract(zecash_artifact.abi, config.contractAddress);

    var number = contractInstance.methods.getValidator(address).call()
    .then(function(data){
      callback(data.valueOf());
    })
    .catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });

  },


  getAllIndexes: function (callback) {
    var self = this;

    var config = require('../config/config');
    var Web3 = require('web3');
    var web3 = new Web3(config.clientEndPoint);

    var contractInstance = new web3.eth.Contract(zecash_artifact.abi, config.contractAddress);

    var number = contractInstance.methods.getAllIndexes().call()
    .then(function(data){
      callback(data.valueOf());
    })
    .catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  },

  getBlock: function(index,callback) {
    var self = this;

    var config = require('../config/config');
    var Web3 = require('web3');
    var web3 = new Web3(config.clientEndPoint);

    var contractInstance = new web3.eth.Contract(zecash_artifact.abi, config.contractAddress);

    var number = contractInstance.methods.getBlock(index).call()
    .then(function(data){
      callback(data.valueOf());
    })
    .catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  },

  forgeBlock: function(index,address,sender, privatekey, callback) {
    var self = this;

    var config = require('../config/config');
    var Web3 = require('web3');
    var web3 = new Web3(config.clientEndPoint);
    sender = sender;
    var contractAddr = config.contractAddress;

    var tokenInstance = new web3.eth.Contract(zecash_artifact.abi, contractAddr, {
      from: sender
    });

    var txnNonce;
    var txnObject;
    
      web3.eth.getTransactionCount(sender,'pending')
      .then(function(data){
        txnNonce = data;
        console.log(txnNonce);
        txnObject = {
          from : sender,
          to : contractAddr,
          value : "0x0",
          gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'Gwei')),
          gas: web3.utils.toHex('7000000'),
          nonce: web3.utils.toHex(txnNonce),
          data: tokenInstance.methods.forgeBlock(index,address).encodeABI()
        };

        console.log(txnObject);

        var Tx = require('ethereumjs-tx');
        var privateKey = new Buffer(privatekey, 'hex');

        var tx = new Tx(txnObject);
        tx.sign(privateKey);

        var serializedTx = tx.serialize();
        console.log(serializedTx);

        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
          .on('receipt', function(receipt){
            console.log("Receipt Called");
            callback(receipt.valueOf());
          
          }).on('error', function(err){
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
             
              callback("ERROR 404");
            
            }
          });
            
          });
     
  },

  mint: function(address,sender,privatekey,callback) {
    var self = this;

    var config = require('../config/config');
    var Web3 = require('web3');
    var web3 = new Web3(config.clientEndPoint);
    sender = sender;
    var contractAddr = config.contractAddress;

    var tokenInstance = new web3.eth.Contract(zecash_artifact.abi, contractAddr, {
      from: sender
    });

    var txnNonce;
    var txnObject;
    
      web3.eth.getTransactionCount(sender,'pending')
      .then(function(data){
        txnNonce = data;
        console.log(txnNonce);
        txnObject = {
          from : sender,
          to : contractAddr,
          value : "0x0",
          gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'Gwei')),
          gas: web3.utils.toHex('7000000'),
          nonce: web3.utils.toHex(txnNonce),
          data: tokenInstance.methods.mint(address).encodeABI()
        };

        console.log(txnObject);

        var Tx = require('ethereumjs-tx');
        var privateKey = new Buffer(privatekey, 'hex');

        var tx = new Tx(txnObject);
        tx.sign(privateKey);

        var serializedTx = tx.serialize();
        console.log(serializedTx);

        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
          .on('receipt', function(receipt){
            console.log("Receipt Called");
            callback(receipt.valueOf());
          
          }).on('error', function(err){
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
              
              callback("ERROR 404");
              
            }
          });
            
          });
      
  },
  
  getTestEther: function(address,sender,privatekey, callback) {

    // let nonce = web3.eth.getTransactionCount(sender);
    var self = this;
    var config = require('../config/config');
    var Web3 = require('web3');
    var web3 = new Web3(config.clientEndPoint);
    sender = sender;
    const amountToSend = '1';
    var etherBalance;
    

    var txnNonce;
    var txnObject;
    
      web3.eth.getTransactionCount(sender,'pending')
      .then(function(data){
        txnNonce = data;
        console.log(txnNonce);
        txnObject = {
          from : sender,
          to : address,
          value : web3.utils.toHex( web3.utils.toWei(amountToSend, 'ether') ),
          gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'Gwei')),
          gas: web3.utils.toHex('3000000'),
          nonce: web3.utils.toHex(txnNonce),
        
        };

        console.log({
          from : sender,
          to : address,
          value : web3.utils.toWei(amountToSend, 'ether'),
          gasPrice: web3.utils.toWei('30', 'Gwei'),
          gas: web3.utils.toHex('3000000'),
          nonce: web3.utils.toHex(txnNonce),
        
        });


        var Tx = require('ethereumjs-tx');
        var privateKey = new Buffer(privatekey, 'hex');

        var tx = new Tx(txnObject);
        tx.sign(privateKey);

        var serializedTx = tx.serialize();
        console.log(serializedTx);

        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
          .on('receipt', function(receipt){
            console.log("Receipt Called");
            //callback(receipt.valueOf());
            /*self.refreshBalance(address, function (answer) {
               console.log("reached here1");
              callback(answer);
            });*/
            web3.eth.getBalance(address, function (error, result) {
              if (!error){
                console.log('Ether:', web3.utils.fromWei(result,'ether')); 
                callback(web3.utils.fromWei(result,'ether'));
              }

              else{
                console.log('Huston we have a promblem: ', error);
              }
            });
          
          }).on('error', function(err){
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
              
              callback("ERROR 404");
            
            }
          });
      });
    
  },
   

  getZecash: function(address,amount,privatekey, callback) {
    var self = this;
    var config = require('../config/config');
    var Web3 = require('web3');
    var web3 = new Web3(config.clientEndPoint);
    sender = address;
    console.log("privatekey is",privatekey);
    var contractAddr = config.contractAddress;

    var tokenInstance = new web3.eth.Contract(zecash_artifact.abi, contractAddr, {
      from: sender
    });

    var txnNonce;
    var txnObject;
    
      web3.eth.getTransactionCount(sender,'pending')
      .then(function(data){
        txnNonce = data;
        console.log(txnNonce);
        txnObject = {
          from : sender,
          to : contractAddr,
          value : "0x0",
          gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'Gwei')),
          gas: web3.utils.toHex('3000000'),
          nonce: web3.utils.toHex(txnNonce),
          data: tokenInstance.methods.getZecash(address,amount).encodeABI()
        };

        console.log(txnObject);


        var Tx = require('ethereumjs-tx');
        var privateKey = new Buffer(privatekey, 'hex');

        var tx = new Tx(txnObject);
        tx.sign(privateKey);

        var serializedTx = tx.serialize();
        console.log(serializedTx);

        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
          .on('receipt', function(receipt){
            console.log("Receipt Called");
            //callback(receipt.valueOf());
            self.refreshBalance(address, function (answer) {
               console.log("reached here1");
              callback(answer);
            });
          
          }).on('error', function(err){
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
              
              callback("ERROR 404");
            
            }
          });
      });
    
  }
   
}