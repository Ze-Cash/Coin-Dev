const express = require('express');
const EthCrypto = require('eth-crypto');
const mongoose = require('mongoose');
const Web3 = require('web3');
const truffle_connect = require('../.././connection/poc_dapp.js');
const fs = require('fs');
const request = require('request')
const stripHexPrefix = require('strip-hex-prefix');
var async = require('async');
var config = require('../../config/config');
var roundround = require('roundround');
var next = roundround([config.address,config.address1,config.address2,config.address3,config.address4,config.address5,config.address6,config.address7]);
var privkeys = roundround([config.privkey,config.privkey1,config.privkey2,config.privkey3,config.privkey4,config.privkey5,config.privkey6,config.privkey7]);
var sender;
var key;
// express router // used to define routes for users
const userRouter  = express.Router();

const cron = require('node-cron');
var _=require('lodash');

var path = require ('path');
//var roundround = require('roundround');
module.exports.userControllerFunction = function(app) {
  
  app.use(express.static(path.join(__dirname, './../../public')));
  
  var selectedValidator;
  var randValidator;

  userRouter.get('/getCurrentValidator', (req, res) => {
    console.log("**** GET /getCurrentValidator ****");
    /*truffle_connect.getValidator(randValidator,function (answer1) {
               
          console.log("answer1",answer1);
            res.send(answer1);
    });*/
    res.send({data: randValidator})
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
 //done
//Request to provide Test Zecash to the users
  userRouter.post('/getZecash', (req, res) => {

    console.log("**** GET /getZecash ****");
    
    let amount = req.body.amount;
    let address = req.body.address;
    let privatekeystr = req.body.privatekey.toString();
    let privatekey = stripHexPrefix(privatekeystr);
    console.log("address of zecash is",address);
    truffle_connect.getZecash(address,amount,privatekey, function (answer) {
      res.send(answer);
    });

  });
  //done
  userRouter.post('/getTestEthers', (req, res) => {

    console.log("**** GET /getTestEthers ****");
    sender = next();
    console.log("sender is", sender);

    key = privkeys();
    console.log("key is ",key);
    let address = req.body.address;
    
    truffle_connect.getTestEther(address,sender,key, function (answer) {
      res.send(answer);
    });

  });
//done
//Request to get listed as a validator
   userRouter.post('/getListedAsValidator', (req, res) => {
  
    console.log("**** GET /getListedAsValidator ****");

    sender = next();
    console.log("sender is", sender);

    key = privkeys();
    console.log("key is ",key);

    let identity = EthCrypto.createIdentity();
    console.log("identity",identity);
    let identityAdd = identity.address;
    let privateKey = identity.privateKey;

    truffle_connect.getListedAsValidator(identityAdd,sender,key,function (answer) {
     // console.log(answer);
      res.send({identityAdd: identityAdd, privateKey: privateKey});
    });

  });

//done
   userRouter.post('/removeValidator', (req, res) => {
    
    console.log("**** GET /removeValidator ****");
    
    sender = next();
    console.log("sender is", sender);

    key = privkeys();
    console.log("key is ",key);

    let address = req.body.address;
    truffle_connect.removeValidator(address,sender,key,function (answer) {
      res.send(address);
    });

  });

   

//Request to get all the validators
  userRouter.get('/getAllValidators', (req, res) => {
    console.log("**** GET /getAllValidators ****");

    truffle_connect.getAllValidators(function (answer) {
     // console.log(answer);
      res.send(answer);
    });

  });

//Request to show all the validators
  userRouter.get('/showAllValidators', (req,res) => {

    var arrayOfValidators = [];
    console.log("**** GET /showAllValidators ****");
    
     truffle_connect.getAllValidators(function (answer) {
       
        let addresses = answer;
       // console.log(addresses);
       //var index = 0;

        async.forEach(addresses, function (addr, callback) {
             // index++;
               truffle_connect.getValidator(addr,function (answer1) {
               console.log("answer1",answer1);
              // answer1[7] = index;
                arrayOfValidators.push(answer1);
               // console.log(answer1);
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
      let indexArr = answer;
      //console.log(indexes);
     //let indexArr = indexes.map(x => x.toNumber());

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
//sender's ethers are gonna be used
  userRouter.post('/forgeBlock', (req,res) => {

    console.log("**** GET /forgeBlock ****");

   truffle_connect.getAllIndexes(function (answer) {
      let indexArr = answer;
     // let indexArr = indexes.map(x => x.toNumber());
     
      let oldIndex = indexArr[indexArr.length - 1];
    
      let validatorAddress = req.body.address;
      let privatekeystr = req.body.privatekey.toString();
      let privatekey = stripHexPrefix(privatekeystr);
      console.log(validatorAddress);
        truffle_connect.forgeBlock(oldIndex,validatorAddress,validatorAddress,privatekey, function(answer1){
          // get list of all accounts and send it along with the response
         
           truffle_connect.mint(validatorAddress,validatorAddress,privatekey, function(answer11) {
             console.log("minted by user");
           //  console.log(answer11);
           });
          res.send(answer1);
        });
    
    });

  });
  
  function getCron(){
    
       request.get('/pickWinner', (err, res) => {
        //  userRouter.get('/pickWinner',(req,res) => {
     var eligibleValidators = [];
     var eligibleValidators1 = [];
     var coinageOfValidator;
     var oldBlockValidator;
     var consideredCoinage;
     var defaultValidators = ['0x8547375670f0db79e59c832b2dcaeb0dde2f6006','0x323233a2052d66b247c96d3a7e63164b5cd8afbb','0x5ac69b00570412ad65f59404308005b4bea0db77','0xbd5dbffe75274258bc9d0d907f957a2d0774d60f','0x1b2fe0836fb9306250c47143f7274ba38dd2ca07','0x8c4794fb81114a2dafe3b04eb3d4a3944752b276']
    console.log("**** GET /pickWinner ****");

   sender = next();
    console.log("sender is", sender);

    key = privkeys();
    console.log("key is ",key);

    
    truffle_connect.getAllValidators(function (answer) {
        let validatorList = answer;
        //console.log('validatorList', answer);
        async.forEach(validatorList, function(a2,callback) {
         
           truffle_connect.getCoinAge(a2,function (answer1) {
              //console.log('coinage',answer1);
             // console.log('a2',a2);
              coinageOfValidator = answer1;
              //console.log("coinage",coinageOfValidator);
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
                 // console.log('selectedValidator1',answer2);
                  console.log("sel[4]",selectedValidator1[4]);
                  
                  if (selectedValidator1[4] == true) {
                    truffle_connect.getAllIndexes(function (answer3) {
                      let indexArr = answer3;
                      //let indexArr = indexes.map(x => x.toNumber());
                    // console.log('answer3',answer3);
                      let oldIndex = indexArr[indexArr.length - 1];
                
                      oldBlockNo = oldIndex;
                     
                        truffle_connect.forgeBlock(oldIndex,randValidator,sender,key, function(answer4){
                          // get list of all accounts and send it along with the response
                          truffle_connect.mint(randValidator, sender,key, function(answer9) {
                              console.log("minted by first");
                           //   console.log("answer9",answer9);
                          })
                         // console.log(answer4);
                          //console.log("answer4",answer4); //here is error
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
                      let indexArr = answer5;
                      //let indexArr = indexes.map(x => x.toNumber());
                     //console.log("answer5",answer5);
                      let newIndex = indexArr[indexArr.length - 1];
                      
                      truffle_connect.getBlock(newIndex, function (answer8) {
                      
                          oldBlockValidator = answer8[4];
                          //console.log('answer8',answer8);
                          //console.log("old",oldBlockValidator);
                          //console.log("def",defaultValidators);
                          if (selectedValidator != oldBlockValidator) {
                        async.forEach(defaultValidators, function(a3,callback) {
                            
                           truffle_connect.getCoinAge(a3,function (answer6) {
                              coinageOfValidator = answer6;
                              //console.log("answer6",answer6);
                              //console.log("coinage11",coinageOfValidator);
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
                                truffle_connect.forgeBlock(newIndex,randValidatorBackup,sender, key,function(answer7){
                                  // get list of all accounts and send it along with the response
                                  truffle_connect.mint(randValidatorBackup, sender, key,function(answer10) {
                                      console.log("minted by second");
                                      console.log('answer10',answer10);
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
    
    truffle_connect.getCoinAge(address, function (answer) {
      res.send(answer);
    });
  });

  app.use('/users', userRouter);

}