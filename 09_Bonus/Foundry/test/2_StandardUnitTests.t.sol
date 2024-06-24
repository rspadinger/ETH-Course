// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console, stdStorage, StdStorage} from "forge-std/Test.sol";

import "../src/2_StandardUnitTests.sol";

contract NFTTest is Test {
    using stdStorage for StdStorage;

    NFT private nft;

    //from: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
    error OwnableUnauthorizedAccount(address account);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    function setUp() public {
        // Deploy NFT contract
        nft = new NFT("NFT_tutorial", "TUT", "baseUri");
    }

    function test_RevertMintWithoutValue() public {
        vm.expectRevert(MintPriceNotPaid.selector);
        nft.mintTo(address(1));
    }

    function test_EmitTransferOnMint() public {
        //vm.expectEmit(); //check all topics & Data
        vm.expectEmit(false, true, true, false); //T1, T2, Data, T4
        emit Transfer(address(0), address(1), 1);
        nft.mintTo{value: 0.08 ether}(address(1));
    }

    function test_MintPricePaid() public {
        nft.mintTo{value: 0.08 ether}(address(1));
    }

    function test_RevertMintMaxSupplyReached() public {
        //the Forge standard lib contains several contracts, one of them is stdStorage => allows to read/write storage slots
        //find the slot for the public variable "currentTokenId" in the nft contract using the corresponding function selector
        uint256 slot = stdstore.target(address(nft)).sig("currentTokenId()").find();

        console.log("Slot number: ", slot); //8

        bytes32 loc = bytes32(slot);
        bytes32 mockedCurrentTokenId = bytes32(abi.encode(10000)); //abi.encode returns bytes => we need bytes32
        vm.store(address(nft), loc, mockedCurrentTokenId);

        vm.expectRevert(MaxSupplyReached.selector);
        nft.mintTo{value: 0.08 ether}(address(1));
    }

    function test_RevertMintToZeroAddress() public {
        vm.expectRevert("INVALID_RECIPIENT");
        nft.mintTo{value: 0.08 ether}(address(0));
    }

    function test_NewMintOwnerRegistered() public {
        nft.mintTo{value: 0.08 ether}(address(1));

        //call ownerOf function on the ERC721 contract with the tokenId as argument
        uint256 slotOfNewOwner = stdstore.target(address(nft)).sig(nft.ownerOf.selector).with_key(1).find();

        uint160 ownerOfTokenIdOne = uint160(uint256((vm.load(address(nft), bytes32(slotOfNewOwner)))));
        assertEq(address(ownerOfTokenIdOne), address(1));
    }

    function test_BalanceIncremented() public {
        nft.mintTo{value: 0.08 ether}(address(1));
        uint256 slotBalance = stdstore.target(address(nft)).sig(nft.balanceOf.selector).with_key(address(1)).find();

        uint256 balanceFirstMint = uint256(vm.load(address(nft), bytes32(slotBalance)));
        assertEq(balanceFirstMint, 1);

        nft.mintTo{value: 0.08 ether}(address(1));
        uint256 balanceSecondMint = uint256(vm.load(address(nft), bytes32(slotBalance)));
        assertEq(balanceSecondMint, 2);
    }

    function test_SafeContractReceiver() public {
        Receiver receiver = new Receiver();
        nft.mintTo{value: 0.08 ether}(address(receiver));
        uint256 slotBalance = stdstore
            .target(address(nft))
            .sig(nft.balanceOf.selector)
            .with_key(address(receiver))
            .find();

        uint256 balance = uint256(vm.load(address(nft), bytes32(slotBalance)));
        assertEq(balance, 1);
    }

    function test_RevertUnSafeContractReceiver() public {
        // Adress set to 10, because first 9 addresses are precompiles (special contracts at fixed addresses) => cannot use etch
        //set arbitrary bytecode to the contract at address 10 => does not include onERC721Received
        vm.etch(address(10), bytes("mock code"));
        vm.expectRevert(bytes(""));
        nft.mintTo{value: 0.08 ether}(address(10));
    }

    function test_WithdrawalWorksAsOwner() public {
        // Mint an NFT, sending eth to the contract
        Receiver receiver = new Receiver();
        address payable payee = payable(address(0x11111));
        uint256 priorPayeeBalance = payee.balance; //0

        nft.mintTo{value: nft.MINT_PRICE()}(address(receiver));
        assertEq(address(nft).balance, nft.MINT_PRICE());
        uint256 nftBalance = address(nft).balance;

        //console.log("Owner: ", nft.owner());

        // Withdraw the balance and assert it was transferred
        nft.withdrawPayments(payee);
        //console.log("Balance: ", priorPayeeBalance, nftBalance);
        assertEq(payee.balance, priorPayeeBalance + nftBalance); //0 + 0.08 ETH
    }

    function test_WithdrawalFailsAsNotOwner() public {
        Receiver receiver = new Receiver();
        nft.mintTo{value: nft.MINT_PRICE()}(address(receiver));
        assertEq(address(nft).balance, nft.MINT_PRICE());

        // Confirm that a non-owner cannot withdraw
        //console.log("Owner: ", address(this));
        //console.logBytes4(bytes4(OwnableUnauthorizedAccount.selector));
        vm.expectRevert(abi.encodeWithSelector(OwnableUnauthorizedAccount.selector, address(0xd3ad)));

        //vm.prank(address(0xd3ad));
        vm.startPrank(address(0xd3ad));
        nft.withdrawPayments(payable(address(0xd3ad)));
        vm.stopPrank();
    }
}

contract Receiver is ERC721TokenReceiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 id,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}

//forge test --match-contract NFTTest --gas-report -vv
//forge test --match-contract NFTTest --match-test test_RevertMintWithoutValue --gas-report -vv
