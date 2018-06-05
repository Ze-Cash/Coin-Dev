var ZeCash_PoS = artifacts.require("./ZeCash_PoS.sol");
//var ConvertLib = artifacts.require("./ConvertLib.sol");

module.exports = function(deployer) {
	//deployer.deploy(ConvertLib);
   // deployer.link(ConvertLib, ZeCash_PoS);
    deployer.deploy(ZeCash_PoS);
};