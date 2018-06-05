const express = require('express');
const app = express();
//use process environment variables in case the application is deployed on some other platform
let port = process.env.PORT || 3000;
let Web3 = require('web3');
const truffle_connect = require('./connection/poc_dapp.js');
const bodyParser = require('body-parser');
//include the middleware to log the requests
const morgan = require('morgan');
var config = require('./config/config');
//config of the database
var cors = require('cors');
const fs = require('fs');

app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(cors());
// include controllers
fs.readdirSync('./app/controllers').forEach(function(file) {
	if(file.indexOf('.js')){
		// include a file as a route variable
		var userRoute = require('./app/controllers/users.js');
		//call controller function of each file and pass your app instance to it
		userRoute.userControllerFunction(app);

	}
});//end for each

app.use(morgan('dev'));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use('/', express.static('public_static'));

//Interaction with the contracts
app.listen(port, () => {

  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    truffle_connect.web3 = new Web3(web3.currentProvider);
  } else {
    //console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    console.warn("No web3 detected");
    truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider(config.clientEndPoint));
  }
  console.log("Express Listening at http://zecash.io " + port);

});
