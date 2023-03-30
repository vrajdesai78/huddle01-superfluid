// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RoomRates {
    
    struct Room {
        address sender;
        address receiver;
        uint256 ratePerSecond;
    }
    
    mapping (string => Room) public rooms;
    
    function setRoomRate(string memory roomId, address sender, address receiver, uint256 ratePerSecond) public {
        rooms[roomId] = Room(sender, receiver, ratePerSecond);
    }
    
    function getRoomRate(string memory roomId) public view returns (address, address, uint256) {
        Room storage room = rooms[roomId];
        return (room.sender, room.receiver, room.ratePerSecond);
    }
}