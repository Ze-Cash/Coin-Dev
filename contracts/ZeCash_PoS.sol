pragma solidity ^0.4.24;

library SafeMath {
    function mul(uint256 a, uint256 b) internal constant returns (uint256) {
        uint256 c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal constant returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    function sub(uint256 a, uint256 b) internal constant returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal constant returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}
/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    address public owner;
    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    function Ownable() public {
        owner = msg.sender;
    }
    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    /**
     * @dev Allows the current owner to In control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        owner = newOwner;
    }

}

contract ZeCash_PoS is Ownable {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed _address, uint _reward);
    using SafeMath for uint256;
    string public name = "ZCHToken";
    string public symbol = "ZCH";
    uint public decimals = 18;
    uint public chainStartTime; //chain start time
    uint public chainStartBlockNumber; //chain start block number
    uint public stakeStartTime = now; //stake start time
    uint public stakeMinAge = 50 seconds; // minimum age for coin age: 3M
    uint public stakeMaxAge = 100 seconds; // stake age of full weight: 10M
    uint public maxMintProofOfStake = 10**17; // default 10% annual interest
    uint256 totalStakedAmount = 0;
    uint256 public totalSupply;
    uint256 public maxTotalSupply;
    uint256 public totalInitialSupply;
    
    /*** Structs ***************/
    
    struct Validator {
        uint256 stakedPercent;
        uint256 totalAmount;
        uint256 earnedZecash;
        address addr;
        bool defValidator;
        uint256 noBlocksForged;
        uint256[] blocks;
    }
    
    struct transferInStruct{
        uint128 amount;
        uint64 time;
    }

    struct Block {
        uint256 index;
        uint256 timestamp;
        address data;
        bytes32 hash;
        bytes32 prevHash;
        address validator;
    }

    mapping (uint256 => Block) public blockchain;
    uint256[] public blockIndexes;

    /**** Validators ***************/

    mapping (address => Validator) public validators;                      
    address[] public validatorAccts;
    uint128 next_validator_index = 1;                               
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    mapping(address => transferInStruct[]) transferIns;
    
    /*** Events ***************/
    
    
    event Burn(address indexed burner, uint256 value);

    /*** Modifiers ***************/

    modifier canPoSMint() {
        require(totalSupply < maxTotalSupply);
        _;
    }    //Total Supply should be less than maxTotalSupply
    
    /*** Functions ***************/

    function ZeCash_PoS() public {
        
        maxTotalSupply = 10 * 10**26; // 500 Mil.
        totalInitialSupply = 10**26; // 1 Mil.
        totalStakedAmount = 100000;
        chainStartTime = now;
        chainStartBlockNumber = block.number;
        uint64 _now = uint64(now);
        balances[owner] = totalInitialSupply;
        totalSupply = totalInitialSupply;
        validatorAccts = [0x8547375670f0dB79e59C832b2dcAeB0DdE2F6006,0x323233A2052D66b247c96d3A7E63164B5Cd8afBb,0x5Ac69B00570412aD65F59404308005b4bea0Db77,0xBD5DbFFe75274258bC9D0d907f957A2d0774D60f,0x1B2FE0836FB9306250C47143F7274ba38dD2cA07,0x8c4794FB81114A2daFe3B04eB3D4a3944752b276];

        var genesisblock = blockchain[0];
        genesisblock.index = 0;
        genesisblock.timestamp = now;
        genesisblock.hash = "";
        genesisblock.prevHash = "";
        genesisblock.validator = owner;
        blockIndexes.push(genesisblock.index);

        var validator1 = validators[0x8547375670f0dB79e59C832b2dcAeB0DdE2F6006];
        
        validator1.totalAmount = 4000;
        validator1.earnedZecash = 0;
        validator1.addr = 0x8547375670f0dB79e59C832b2dcAeB0DdE2F6006;
        validator1.defValidator = true;
        balances[0x8547375670f0dB79e59C832b2dcAeB0DdE2F6006] = 4000;
        validator1.stakedPercent = percent(balances[0x8547375670f0dB79e59C832b2dcAeB0DdE2F6006],totalStakedAmount,3);
        validator1.noBlocksForged = 0;
        transferIns[0x8547375670f0dB79e59C832b2dcAeB0DdE2F6006].push(transferInStruct(uint128(balances[0x8547375670f0dB79e59C832b2dcAeB0DdE2F6006]),_now));

        var validator2 = validators[0x323233A2052D66b247c96d3A7E63164B5Cd8afBb];
        
        validator2.totalAmount = 6000;
        validator2.earnedZecash = 0;
        validator2.addr = 0x323233A2052D66b247c96d3A7E63164B5Cd8afBb;
        validator2.noBlocksForged = 0;
        validator2.defValidator = true;
        balances[0x323233A2052D66b247c96d3A7E63164B5Cd8afBb] = 6000;
        validator2.stakedPercent = percent(balances[0x323233A2052D66b247c96d3A7E63164B5Cd8afBb],totalStakedAmount,3);
        transferIns[0x323233A2052D66b247c96d3A7E63164B5Cd8afBb].push(transferInStruct(uint128(balances[0x323233A2052D66b247c96d3A7E63164B5Cd8afBb]),_now));

        var validator3 = validators[0x5Ac69B00570412aD65F59404308005b4bea0Db77];
       
        validator3.totalAmount = 20000;
        validator3.earnedZecash = 0;
        validator3.addr = 0x5Ac69B00570412aD65F59404308005b4bea0Db77;
        validator3.noBlocksForged = 0;
        validator3.defValidator = true;
         balances[0x5Ac69B00570412aD65F59404308005b4bea0Db77] = 20000;
         validator3.stakedPercent = percent(balances[0x5Ac69B00570412aD65F59404308005b4bea0Db77],totalStakedAmount,3);
        transferIns[0x5Ac69B00570412aD65F59404308005b4bea0Db77].push(transferInStruct(uint128(balances[0x5Ac69B00570412aD65F59404308005b4bea0Db77]),_now));

        var validator4 = validators[0xBD5DbFFe75274258bC9D0d907f957A2d0774D60f];
       
        validator4.totalAmount = 25000;
        validator4.earnedZecash = 0;
        validator4.addr = 0xBD5DbFFe75274258bC9D0d907f957A2d0774D60f;
        validator4.noBlocksForged = 0;
        validator4.defValidator = true;
        balances[0xBD5DbFFe75274258bC9D0d907f957A2d0774D60f] = 25000;
        validator4.stakedPercent = percent(balances[0xBD5DbFFe75274258bC9D0d907f957A2d0774D60f],totalStakedAmount,3);
        transferIns[0xBD5DbFFe75274258bC9D0d907f957A2d0774D60f].push(transferInStruct(uint128(balances[0xBD5DbFFe75274258bC9D0d907f957A2d0774D60f]),_now));

        var validator5 = validators[0x1B2FE0836FB9306250C47143F7274ba38dD2cA07];
        
        validator5.totalAmount = 40000;
        validator5.earnedZecash = 0;
        validator5.addr = 0x1B2FE0836FB9306250C47143F7274ba38dD2cA07;
        validator5.noBlocksForged = 0;
        validator5.defValidator = true;
        balances[0x1B2FE0836FB9306250C47143F7274ba38dD2cA07] = 40000;
        validator5.stakedPercent = percent(balances[0x1B2FE0836FB9306250C47143F7274ba38dD2cA07],totalStakedAmount,3);
        transferIns[0x1B2FE0836FB9306250C47143F7274ba38dD2cA07].push(transferInStruct(uint128(balances[0x1B2FE0836FB9306250C47143F7274ba38dD2cA07]),_now));

        var validator6 = validators[0x8c4794FB81114A2daFe3B04eB3D4a3944752b276];
        
        validator6.totalAmount = 5000;
        validator6.earnedZecash = 0;
        validator6.addr = 0x8c4794FB81114A2daFe3B04eB3D4a3944752b276;
        validator6.noBlocksForged = 0;
        validator6.defValidator = true;
        balances[0x8c4794FB81114A2daFe3B04eB3D4a3944752b276] = 5000;
        validator6.stakedPercent = percent(balances[0x8c4794FB81114A2daFe3B04eB3D4a3944752b276],totalStakedAmount,3);
        transferIns[0x8c4794FB81114A2daFe3B04eB3D4a3944752b276].push(transferInStruct(uint128(balances[0x8c4794FB81114A2daFe3B04eB3D4a3944752b276]),_now));    
    }
    
    function transfer(address _to, uint256 _value) public returns (bool) {
        if(msg.sender == _to) return mint(_to);
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        if(transferIns[msg.sender].length > 0) delete transferIns[msg.sender];
        uint64 _now = uint64(now);
        transferIns[msg.sender].push(transferInStruct(uint128(balances[msg.sender]),_now));
        transferIns[_to].push(transferInStruct(uint128(_value),_now));
        return true;
    }

    function percent(uint256 numerator, uint256 denominator, uint256 precision) internal constant returns(uint quotient) {
         // caution, check safe-to-multiply here
        uint _numerator  = numerator * 10 ** (precision+1);
        // with rounding of last digit
        uint _quotient =  ((_numerator / denominator) + 5) / 10;
        return ( _quotient);
    }


    function getZecash(address _to, uint256 _value) public returns (bool) {

        if (balances[owner] < _value || (balances[_to] + _value )> 100000) return false;
        validators[_to].totalAmount = validators[_to].totalAmount + _value;
        balances[owner] = balances[owner].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(owner, _to, _value);
        if(transferIns[_to].length > 0) delete transferIns[_to];
        uint64 _now = uint64(now);
        transferIns[owner].push(transferInStruct(uint128(balances[owner]),_now));
        transferIns[_to].push(transferInStruct(uint128(_value),_now));
        totalStakedAmount = totalStakedAmount + _value;
        validators[_to].stakedPercent = percent(balances[_to],totalStakedAmount,3);

        for (var j = 0; j < validatorAccts.length; j++) {

            
                validators[validatorAccts[j]].stakedPercent = percent(balances[(validatorAccts[j])],totalStakedAmount,3);
            
        }
        
        return true;
    }
    
    function balanceOf(address _owner) public constant returns (uint256 balance) {
        return balances[_owner];
    }

    function calculateHash(uint256 newBlockIndex) internal returns(bytes32) {
        var newblock = blockchain[newBlockIndex];
        bytes32 hash = sha256(newblock.index, newblock.timestamp, newblock.prevHash, newblock.data);
        return hash;
    }

    function forgeBlock(uint256 oldBlockIndex, address _address) public {
        var oldblock = blockchain[oldBlockIndex];
        var newblock = blockchain[oldBlockIndex+1];
        newblock.index = oldblock.index + 1;
        newblock.timestamp = now;
        newblock.prevHash = oldblock.hash;
        newblock.data = _address;
        newblock.hash = calculateHash(newblock.index);
        newblock.validator = _address;
        blockIndexes.push(newblock.index);
        var val = validators[_address];
        val.noBlocksForged = val.noBlocksForged + 1;
        val.blocks.push(newblock.index);
    }

    function getAllIndexes () view public returns (uint256[]) {
        return blockIndexes;
    }

    function getBlock (uint256 index) view public returns (uint256, uint256, bytes32, bytes32, address) {
        return (blockchain[index].index, blockchain[index].timestamp, blockchain[index].hash, blockchain[index].prevHash,blockchain[index].validator );
    }

    function isBlockValid(uint256 newBlockIndex, uint256 oldBlockIndex) public returns(bool) {
        if (oldBlockIndex != newBlockIndex) {
            return false;
        }
        if (blockchain[oldBlockIndex].hash != blockchain[newBlockIndex].prevHash) {
            return false;
        }
        if (calculateHash(newBlockIndex) != blockchain[newBlockIndex].hash) {
            return false;
        }
        return true;
    }
    
   function mint(address _address) canPoSMint public returns (bool) {
        if(balances[_address] <= 0) return false;
        if(transferIns[_address].length <= 0) return false;
        uint reward = getProofOfStakeReward(_address);
        if(reward <= 0) return false;
        totalSupply = totalSupply.add(reward);  
        var validatorBal = validators[_address];
        validatorBal.earnedZecash = validatorBal.earnedZecash.add(reward.div(100));
        delete transferIns[_address];
        transferIns[_address].push(transferInStruct(uint128(balances[_address]),uint64(now)));
        emit Mint(_address, reward);
        return true;
    }
    
    function getBlockNumber() view public returns (uint blockNumber) {
        blockNumber = block.number.sub(chainStartBlockNumber);
    }

    function annualInterest() constant public returns(uint interest) {
        uint _now = now;
        interest = maxMintProofOfStake;
        if((_now.sub(stakeStartTime)).div(1 years) == 0) {
            interest = (770 * maxMintProofOfStake).div(100);
        } else if((_now.sub(stakeStartTime)).div(1 years) == 1){
            interest = (435 * maxMintProofOfStake).div(100);
        }
    }
    
    function getCoinAge(address _address) public view returns (uint _coinAge) {
        if(transferIns[_address].length <= 0) return 0;

        for (uint i = 0; i < transferIns[_address].length; i++){
            if( now < uint(transferIns[_address][i].time).add(stakeMinAge) ) continue;

            uint nCoinSeconds = now.sub(uint(transferIns[_address][i].time));
            if( nCoinSeconds > stakeMaxAge ) nCoinSeconds = stakeMaxAge;

            _coinAge = _coinAge.add(uint(transferIns[_address][i].amount) * nCoinSeconds);
        }
        return _coinAge;
    }
    
    function ownerBurnToken(uint _value) onlyOwner public {
        require(_value > 0);
        balances[owner] = balances[owner].sub(_value);
        delete transferIns[owner];
        transferIns[owner].push(transferInStruct(uint128(balances[owner]),uint64(now)));
        totalSupply = totalSupply.sub(_value);
        totalInitialSupply = totalInitialSupply.sub(_value);
        maxTotalSupply = maxTotalSupply.sub(_value*10);
        emit Burn(owner, _value);
    }
    
    function getProofOfStakeReward(address _address) internal view returns (uint) {
        //require( (now >= stakeStartTime) && (stakeStartTime > 0) );

        uint _now = now;
        uint _coinAge = getCoinAge(_address);
        if(_coinAge <= 0) return 0;

        uint interest = maxMintProofOfStake;
        // Due to the high interest rate for the first two years, compounding should be taken into account.
        // Effective annual interest rate = (1 + (nominal rate / number of compounding periods)) ^ (number of compounding periods) - 1
        if((_now.sub(stakeStartTime)).div(1 years) == 0) {
            // 1st year effective annual interest rate is 100% when we select the stakeMaxAge (90 days) as the compounding period.
            interest = (770 * maxMintProofOfStake).div(100);
        } else if((_now.sub(stakeStartTime)).div(1 years) == 1){
            // 2nd year effective annual interest rate is 50%
            interest = (435 * maxMintProofOfStake).div(100);
        }

        return (_coinAge * interest).div(365 * (10**decimals));
    }

    function setValidators (address _address) public {
        var validator = validators[_address];
        // validator.stakedPercent = 0;
        validator.totalAmount = 0;
        validator.addr = _address;
        validator.defValidator = false;
        validator.noBlocksForged = 0;
        validatorAccts.push(_address);
    }

    function IndexOf(address _address) returns(uint) {
    uint i = 0;
    while (validatorAccts[i] != _address) {
      i++;
    }
    return i;
  }

  /** Removes the given value in an array. */
  function removeValidator(address _address) public {
         balances[owner] = balances[owner].add(validators[_address].totalAmount);
         totalStakedAmount = totalStakedAmount.sub(validators[_address].totalAmount);
         for (var j = 0; j < validatorAccts.length; j++) {
         validators[validatorAccts[j]].stakedPercent = percent(balances[(validatorAccts[j])],totalStakedAmount,3);
        }
        validators[_address].totalAmount = 0;
        balances[_address] = 0;
        uint64 _now = uint64(now);
        transferIns[owner].push(transferInStruct(uint128(balances[owner]),_now));
        validators[_address].stakedPercent = 0;
        uint i = IndexOf(_address);
        RemoveByIndex(i);
  }

  /** Removes the value at the given index in an array. */
  function RemoveByIndex(uint i) {
    while (i<validatorAccts.length-1) {
      validatorAccts[i] = validatorAccts[i+1];
      i++;
    }
    validatorAccts.length--;
  }

    function getValidators () view public returns (address[]) {
        return validatorAccts;
    }

    function getValidator (address ins) view public returns (uint256,uint256,uint256, address, bool, uint256, uint256[]) {
       
        return (validators[ins].totalAmount,validators[ins].stakedPercent,validators[ins].earnedZecash, validators[ins].addr, validators[ins].defValidator,validators[ins].noBlocksForged, validators[ins].blocks);
    }

    function countValidators() view public returns (uint) {
        return validatorAccts.length;
    }
    
    function getBalance(address addr) public view returns(uint,uint) {
       var stakedpercent = percent(balances[addr],totalStakedAmount,3);
        return (balances[addr],stakedpercent);
    }

}