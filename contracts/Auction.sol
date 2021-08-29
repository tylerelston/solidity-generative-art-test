// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Auction {
    uint256 totalInterested;
    mapping(address => bool) public peopleInterested;

    constructor() {
        console.log("Auction Contract!");
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
}
