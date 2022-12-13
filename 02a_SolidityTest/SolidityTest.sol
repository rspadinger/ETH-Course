// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

//10: import and inheritance
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestSolidity is ERC20 {
    //1: public state variable *****************************************************
    uint8 public myInt;

    function decrement() public {
        myInt = 0;
        myInt--; //throws an error and reverts

        unchecked {
            myInt--;
            console.logUint(myInt);
        }
    }

    //2: enums *********************************************************************
    enum Directions {
        Left,
        Right
    }
    Directions public direction;

    //3: address *******************************************************************
    function transferEther() public {
        address payable address2 = payable(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2);
        address addressContract = address(this);

        console.log("Balance of contract: ", addressContract.balance);

        if (addressContract.balance >= 1 ether) {
            //address2.transfer(1 ether);
            (bool success, ) = address2.call{value: 1 ether}("");
            require(success, "Transfer failed.");
        }
    }

    //4: arrays ********************************************************************
    uint[] arr1; //data location is storge - can be omitted

    function arrayTest(uint[] memory arr2) public {
        arr1 = arr2; //this creates an independant copy

        uint[] storage arr3 = arr1; //assigns a reference
        arr3[0] = 5; //modifies arr1 through arr3
        console.log("Value of arr1[0]: ", arr1[0]);
        arr1[1] = 10; //modifies arr3 through arr1
        console.log("Value of arr3[1]: ", arr3[1]);
    }

    //5: struct & mapping **********************************************************
    struct Payment {
        uint amount;
        uint timestamp;
    }

    struct AccountDetails {
        uint totalBalance;
        uint numPayments;
        mapping(uint => Payment) payments;
    }

    mapping(address => AccountDetails) public accounts;

    function updateAccountDetails() public payable {
        accounts[msg.sender].totalBalance += msg.value;

        Payment memory payment = Payment(msg.value, block.timestamp);
        accounts[msg.sender].payments[accounts[msg.sender].numPayments] = payment;
        accounts[msg.sender].numPayments++;
    }

    //6: error handling ************************************************************

    /// the provided amount must be 1 ETH
    /// @param provided The amount provided by the user
    error WrongAmount(uint provided);

    function buySomethingFor1ETH() public payable {
        if (msg.value != 1 ether) revert WrongAmount(msg.value);

        // Alternative way to do it:
        require(msg.value != 1 ether, "Incorrect amount.");

        // Perform the purchase...
    }

    //7: view & pure functions *****************************************************
    function funcWrite(uint8 val) public {
        myInt = val;
    }

    function funcPure(uint a, uint b) internal pure returns (uint sum, uint prod) {
        sum = a + b;
        prod = a * b;
        //return (a+b, a*b);
    }

    function funcView() public view returns (uint) {
        (uint add, uint multiply) = funcPure(3, 5);
        return myInt + add + multiply;
    }

    //8: events ********************************************************************
    event Received(address indexed from, uint amount);

    //9: special functions: constructor, selfdestruct, receive, fallback ***********
    constructor(uint8 valueForMyInt) payable ERC20("name", "symbol") {
        owner = payable(msg.sender);
        myInt = valueForMyInt;
        direction = Directions.Right;

        _mint(msg.sender, 1000 * 10**decimals());
    }

    function destroySmartContract() public onlyOwner {
        selfdestruct(owner);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external {
        myInt = 55;
    }

    //10: modifier ******************************************************************
    address payable public owner;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    //11: overide function from ERC20
    function name() public view virtual override returns (string memory) {
        return "TEST";
    }
}
