// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Auction {
    uint totalInterested;
    uint private seed;
    mapping(address => bool) public peopleInterested;
    mapping(address => uint) public lastClaimedAt;

    event NewInterested(address indexed from, uint timestamp, string message);

    struct Message {
        address sender;
        string message;
        uint timestamp;
    }

    Message[] messages;

    constructor() payable {
        console.log("Auction Contract!");
    }

    function message(string memory _message) public {
        console.log("%s says", msg.sender, _message);
        messages.push(Message(msg.sender, _message, block.timestamp));
        emit NewInterested(msg.sender, block.timestamp, _message);
    }

    function getAllMessages() view public returns (Message[] memory){
        return messages;
    }

    function interested() public {
        if (!peopleInterested[msg.sender]) {
            totalInterested += 1;
            peopleInterested[msg.sender] = true;
            console.log("%s is now interested", msg.sender);
        } else {
            console.log("%s is already interested", msg.sender);
        }
    }

    function notInterested() public {
        if (peopleInterested[msg.sender]) {
            totalInterested -= 1;
            peopleInterested[msg.sender] = false;
            console.log("%s is no longer interested", msg.sender);
        } else {
            console.log("%s is already not interested", msg.sender);
        }
    }

    function getInterested() public view returns (uint256) {
        console.log("There are %d people interested", totalInterested);
        return totalInterested;
    }

    function claim() public {
        require(lastClaimedAt[msg.sender] + 5 minutes < block.timestamp, "You can only claim once every 5 minutes");

        uint randomNum = (block.difficulty + block.timestamp + seed) % 100;
        seed = randomNum;

        if (randomNum < 50){
            uint prize = 0.0001 ether;
            console.log("You won:", prize);
            require(prize <= address(this).balance, "Insufficient contract funds");
            (bool success,) = (msg.sender).call{value: prize}("");
            require(success, "Failed to withdraw from contract");
        }
    }
}
