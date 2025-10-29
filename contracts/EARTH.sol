// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title EarthClickGame
 * @dev Click/Tap game where users represent countries and earn EARTH tokens
 */
contract EarthClickGame is Ownable, ERC20 {
    // Constants
    uint256 public constant SUBMIT_FEE = 66600000000000000; // 0.0666 ETH in wei
    uint256 public constant POINTS_PER_CLICK = 1; // 1 EARTH token = 1 point
    
    // User struct
    struct User {
        string username;
        string country;
        uint256 totalPoints;
        uint256 lastSubmitTimestamp;
        bool registered;
    }
    
    // Country stats
    struct CountryStats {
        string name;
        uint256 totalPoints;
        uint256 totalPlayers;
    }
    
    // Mappings
    mapping(address => User) public users;
    mapping(string => CountryStats) public countries; // country code -> stats
    mapping(address => uint256) public pendingPoints; // Points chưa submit
    
    // Arrays for leaderboards
    address[] public allUsers;
    string[] public allCountries;
    
    // Events
    event UserRegistered(address indexed user, string username, string country);
    event PointsSubmitted(address indexed user, uint256 points, string country);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    constructor() Ownable(msg.sender) ERC20("EARTH", "EARTH") {}
    
    /**
     * @dev Register user with username and country
     */
    function register(string memory username, string memory country) external {
        require(!users[msg.sender].registered, "Already registered");
        require(bytes(username).length > 0, "Username required");
        require(bytes(country).length > 0, "Country required");
        
        users[msg.sender] = User({
            username: username,
            country: country,
            totalPoints: 0,
            lastSubmitTimestamp: 0,
            registered: true
        });
        
        allUsers.push(msg.sender);
        
        // Update country stats
        if (countries[country].totalPlayers == 0) {
            allCountries.push(country);
        }
        countries[country].name = country;
        countries[country].totalPlayers++;
        
        emit UserRegistered(msg.sender, username, country);
    }
    
    /**
     * @dev Submit pending points (charges 0.0666 ETH fee)
     */
    function submitPoints(uint256 points) external payable {
        require(users[msg.sender].registered, "Not registered");
        require(msg.value >= SUBMIT_FEE, "Insufficient fee");
        require(points > 0, "No points to submit");
        
        // Update user points
        users[msg.sender].totalPoints += points;
        users[msg.sender].lastSubmitTimestamp = block.timestamp;
        
        // Update country points
        string memory userCountry = users[msg.sender].country;
        countries[userCountry].totalPoints += points;
        
        // Mint EARTH tokens to the user (1 point = 1 EARTH with 18 decimals)
        _mint(msg.sender, points * 1e18);
        
        // Clear pending points for this user
        pendingPoints[msg.sender] = 0;
        
        // Refund excess ETH
        if (msg.value > SUBMIT_FEE) {
            payable(msg.sender).transfer(msg.value - SUBMIT_FEE);
        }
        
        emit PointsSubmitted(msg.sender, points, userCountry);
    }
    
    /**
     * @dev Set pending points (called off-chain, tracked until submit)
     */
    function setPendingPoints(address user, uint256 points) external {
        // This can be called by frontend or off-chain service
        // Points are stored off-chain, only submitted on-chain
        pendingPoints[user] = points;
    }
    
    /**
     * @dev Get user info
     */
    function getUserInfo(address user) external view returns (
        string memory username,
        string memory country,
        uint256 totalPoints,
        uint256 pendingPointsCount,
        uint256 lastSubmitTimestamp
    ) {
        User memory u = users[user];
        return (
            u.username,
            u.country,
            u.totalPoints,
            pendingPoints[user],
            u.lastSubmitTimestamp
        );
    }
    
    /**
     * @dev Get country leaderboard (top N)
     */
    function getCountryLeaderboard(uint256 limit) external view returns (
        string[] memory countryNames,
        uint256[] memory countryPoints
    ) {
        // Sort countries by points (simple bubble sort for small data)
        uint256 count = allCountries.length < limit ? allCountries.length : limit;
        countryNames = new string[](count);
        countryPoints = new uint256[](count);
        
        // Create sorted list
        for (uint256 i = 0; i < count; i++) {
            uint256 maxIndex = i;
            for (uint256 j = i + 1; j < allCountries.length; j++) {
                if (countries[allCountries[j]].totalPoints > countries[allCountries[maxIndex]].totalPoints) {
                    maxIndex = j;
                }
            }
            countryNames[i] = allCountries[maxIndex];
            countryPoints[i] = countries[allCountries[maxIndex]].totalPoints;
        }
    }
    
    /**
     * @dev Get top players in a country
     */
    function getTopPlayersInCountry(string memory country, uint256 limit) external view returns (
        address[] memory playerAddresses,
        string[] memory usernames,
        uint256[] memory playerPoints
    ) {
        uint256 count = 0;
        address[] memory tempAddresses = new address[](allUsers.length);
        uint256[] memory tempPoints = new uint256[](allUsers.length);
        
        // Collect players from country
        for (uint256 i = 0; i < allUsers.length; i++) {
            if (keccak256(bytes(users[allUsers[i]].country)) == keccak256(bytes(country))) {
                tempAddresses[count] = allUsers[i];
                tempPoints[count] = users[allUsers[i]].totalPoints;
                count++;
            }
        }
        
        // Sort by points
        for (uint256 i = 0; i < count; i++) {
            for (uint256 j = i + 1; j < count; j++) {
                if (tempPoints[j] > tempPoints[i]) {
                    address tempAddr = tempAddresses[i];
                    uint256 tempPoint = tempPoints[i];
                    tempAddresses[i] = tempAddresses[j];
                    tempPoints[i] = tempPoints[j];
                    tempAddresses[j] = tempAddr;
                    tempPoints[j] = tempPoint;
                }
            }
        }
        
        // Return top N
        uint256 returnCount = count < limit ? count : limit;
        playerAddresses = new address[](returnCount);
        usernames = new string[](returnCount);
        playerPoints = new uint256[](returnCount);
        
        for (uint256 i = 0; i < returnCount; i++) {
            playerAddresses[i] = tempAddresses[i];
            usernames[i] = users[tempAddresses[i]].username;
            playerPoints[i] = tempPoints[i];
        }
    }
    
    /**
     * @dev Get all countries with stats
     */
    function getAllCountries() external view returns (
        string[] memory countryNames,
        uint256[] memory countryPoints,
        uint256[] memory countryPlayers
    ) {
        uint256 count = allCountries.length;
        countryNames = new string[](count);
        countryPoints = new uint256[](count);
        countryPlayers = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            countryNames[i] = allCountries[i];
            countryPoints[i] = countries[allCountries[i]].totalPoints;
            countryPlayers[i] = countries[allCountries[i]].totalPlayers;
        }
    }
    
    /**
     * @dev Owner withdraw collected fees
     */
    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(owner()).transfer(balance);
        
        emit FundsWithdrawn(owner(), balance);
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

