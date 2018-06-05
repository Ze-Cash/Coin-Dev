const express = require('express');
const EthCrypto = require('eth-crypto');
const mongoose = require('mongoose');
const Web3 = require('web3');
const truffle_connect = require('../.././connection/poc_dapp.js');
const fs = require('fs');
const request = require('request')
var async = require('async');
// express router // used to define routes for users
const userRouter  = express.Router();

const cron = require('node-cron');
var _=require('lodash');
var sender1 = require('../../config/config');
var path = require ('path');

module.exports.userControllerFunction = function(app) {
  
  app.use(express.static(path.join(__dirname, './../../public')));

  //let sender = '0xbc2bdb845f64baa8d983268b5894585d8d74c36e';
  var sender = sender1.address;
  var selectedValidator;
  var randValidator;

  userRouter.get('/getCurrentValidator', (req, res) => {
    console.log("**** GET /getCurrentValidator ****");
    res.send({data: randValidator})
  });

  userRouter.get('/getAccounts', (req, res) => {
    console.log("**** GET /getAccounts ****");
    truffle_connect.start(function (answer){
      res.send(answer);
    });
  });

//Request to set the spender account in case needed
  userRouter.post('/setSpenderAccount', (req,res) => {
    
    console.log("**** /setSpenderAccount");
   

    let spender = req.body.spender;
    sender = spender;
  
  });

//Request to provide test ethers to the users
  userRouter.post('/getTestEther', (req,res) => {

    console.log("**** GET getTestEther ****");
   
    let address = req.body.address;

    request.get('http://faucet.ropsten.be:3001/donate/' + address, function(err, res) {
        console.log("Congrats You have received 1 Test Ether");    
    });

  });
 
//Request to provide Test Zecash to the users
  userRouter.post('/getZecash', (req, res) => {

    console.log("**** GET /getZecash ****");
    
    let amount = req.body.amount;
    let address = req.body.address;
    
    truffle_connect.getZecash(address,amount,sender, function (answer) {
      res.send(answer);
    });

  });

//Request to get listed as a validator
   userRouter.post('/getListedAsValidator', (req, res) => {
    
    console.log("**** GET /getListedAsValidator ****");
    let identity = EthCrypto.createIdentity();
    let identityAdd = identity.address.toLowerCase();

    truffle_connect.getListedAsValidator(identityAdd, sender,function (answer) {
      res.send(identityAdd);
    });

  });

   userRouter.post('/removeValidator', (req, res) => {
    
    console.log("**** GET /removeValidator ****");
    
  
    let address = req.body.address;
    truffle_connect.removeValidator(address, sender,function (answer) {
      res.send(address);
    });

  });

   

//Request to get all the validators
  userRouter.get('/getAllValidators', (req, res) => {
    console.log("**** GET /getAllValidators ****");

    truffle_connect.getAllValidators(function (answer) {
      console.log(answer);
      res.send(answer);
    });

  });

//Request to show all the validators
  userRouter.get('/showAllValidators', (req,res) => {

    var arrayOfValidators = [];
    console.log("**** GET /showAllValidators ****");
    
     truffle_connect.getAllValidators(function (answer) {
       
        let addresses = answer;
       

        async.forEach(addresses, function (addr, callback) {
               truffle_connect.getValidator(addr,function (answer1) {
               
                arrayOfValidators.push(answer1);
                callback();
              });
                // tell async that that particular element of the iterator is done
            }, function (err) {
               
               res.send({data:arrayOfValidators});
        });
  
     });
  
  });

  userRouter.post('/getValidatorInformation', (req,res) => {

    console.log("**** GET /getValidatorInformation ****");
        
        let addr = req.body.address;
        truffle_connect.getValidator(addr,function (answer0) {
          
          res.send(answer0);
          
        });
  
  });

  userRouter.get('/getBlockChain', (req,res) => {

    console.log("**** GET /getBlockChain ****");
    var arrayOfBlocks = [];
    
    truffle_connect.getAllIndexes(function (answer) {
      let indexes = answer;
      let indexArr = indexes.map(x => x.toNumber());

      async.forEach(indexArr, function (index, callback) {
          truffle_connect.getBlock(index, function (answer1) {
                var convertedBlockArr=[];
                 _.forEach(answer1, function(a1) {
                     
                      if (Number.isInteger(a1)){
                      convertedBlockArr.push(a1.toNumber())
                       
                    }
                     else {
                      convertedBlockArr.push(a1.toString())
                      
                     }
                });
               
               arrayOfBlocks.push(convertedBlockArr);
                callback();
              });
                // tell async that that particular element of the iterator is done
            }, function (err) {
               
               res.send({data:arrayOfBlocks});
        });
    });

  });

  userRouter.post('/forgeBlock', (req,res) => {

    console.log("**** GET /forgeBlock ****");

    truffle_connect.getAllIndexes(function (answer) {
      let indexes = answer;
      let indexArr = indexes.map(x => x.toNumber());
     
      let oldIndex = indexArr[indexes.length - 1];
    
      let validatorAddress = req.body.address;
      console.log(validatorAddress);
        truffle_connect.forgeBlock(oldIndex,validatorAddress,sender, function(answer1){
          // get list of all accounts and send it along with the response
         
           truffle_connect.mint(validatorAddress, sender, function(answer11) {
             console.log("minted by user");
             console.log(answer11);
           });
          res.send(answer1);
        });
    
    });

  });
  
  function getCron(){
    
        request.get('/pickWinner', (err, res) => {
     var eligibleValidators = [];
     var eligibleValidators1 = [];
     var coinageOfValidator;
     var oldBlockValidator;
     var consideredCoinage;
     var defaultValidators = ['0x8547375670f0db79e59c832b2dcaeb0dde2f6006','0x323233a2052d66b247c96d3a7e63164b5cd8afbb','0x5ac69b00570412ad65f59404308005b4bea0db77','0xbd5dbffe75274258bc9d0d907f957a2d0774d60f','0x1b2fe0836fb9306250c47143f7274ba38dd2ca07','0x8c4794fb81114a2dafe3b04eb3d4a3944752b276']
    console.log("**** GET /pickWinner ****");

    
  
    truffle_connect.getAllValidators(function (answer) {
        let validatorList = answer;
       
        async.forEach(validatorList, function(a2,callback) {
         
           truffle_connect.getCoinAge(a2,sender,function (answer1) {
              coinageOfValidator = answer1;
              console.log("coinage",coinageOfValidator);
              consideredCoinage = (coinageOfValidator/1000).toFixed();
              if (coinageOfValidator > 0) {
                for (var i = 0; i < consideredCoinage; i++) {
                  eligibleValidators.push(a2);
                }
             }
             callback();
           });
             
           }, function (err) {
               randValidator = eligibleValidators[Math.floor(Math.random() * eligibleValidators.length)];
               truffle_connect.getValidator(randValidator,function (answer2) {
                  var selectedValidator1 = answer2;
                  console.log("sel",selectedValidator1[4]);
                  
                  if (selectedValidator1[4] == true) {
                    truffle_connect.getAllIndexes(function (answer3) {
                      let indexes = answer3;
                      let indexArr = indexes.map(x => x.toNumber());
                     
                      let oldIndex = indexArr[indexes.length - 1];
                
                      oldBlockNo = oldIndex;
                     
                        truffle_connect.forgeBlock(oldIndex,randValidator,sender, function(answer4){
                          // get list of all accounts and send it along with the response
                          truffle_connect.mint(randValidator, sender, function(answer9) {
                              console.log("minted by first");
                              console.log(answer9);
                          })
                          console.log(answer4);
                          //res.send(answer4);
                        });

    
                  });
                    console.log("randVal11",randValidator);
                }

                else {
                  selectedValidator = randValidator;
                  console.log("userval",selectedValidator);
                  setTimeout(function(){
                     truffle_connect.getAllIndexes(function (answer5) {
                      let indexes = answer5;
                      let indexArr = indexes.map(x => x.toNumber());
                     
                      let newIndex = indexArr[indexes.length - 1];
                      
                      truffle_connect.getBlock(newIndex, function (answer8) {
                      
                          oldBlockValidator = answer8[4];
                          console.log("old",oldBlockValidator);
                          console.log("def",defaultValidators);
                          if (selectedValidator != oldBlockValidator) {
                        async.forEach(defaultValidators, function(a3,callback) {
                            
                           truffle_connect.getCoinAge(a3,sender,function (answer6) {
                              coinageOfValidator = answer6;
                              console.log("coinage",coinageOfValidator);
                              consideredCoinage = (coinageOfValidator/1000).toFixed();
                              if (coinageOfValidator > 0) {
                                for (var i = 0; i < consideredCoinage; i++) {
                                  eligibleValidators1.push(a3);
                                }
                             }
                             callback();
                           });
                             
                           }, function (err) {
                             
                               var randValidatorBackup = eligibleValidators1[Math.floor(Math.random() * eligibleValidators1.length)];
                                truffle_connect.forgeBlock(newIndex,randValidatorBackup,sender, function(answer7){
                                  // get list of all accounts and send it along with the response
                                  truffle_connect.mint(randValidatorBackup, sender, function(answer10) {
                                      console.log("minted by second");
                                      console.log(answer10);
                                  });
                                  
                                  //res.send(answer4);
                                });
                                randValidator =  randValidatorBackup;
                                console.log("randVal",randValidator);
                               //res.send({data:randValidatorBackup});
                        });
                      }
                      });
                      
                  });
                   },40000);
                  }
                  
               });
                
        });
          
        });

    });
  
}

//Pick Winner Api will be coming under this
 cron.schedule('* * * * *', function(){
     console.log('running a task every minute');
     
    getCron();
  });


  userRouter.post('/getCoinAge', (req, res) => {
    console.log("**** GET /getCoinAge ****");
    console.log(req.body);
    let address = req.body.address;
    let sender = req.body.sender;

    truffle_connect.getCoinAge(address,sender, function (answer) {
      res.send(answer);
    });
  });

  app.use('/users', userRouter);

}