// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title HarpocratesBilling
 * @notice Minimal ETH-denominated metering and settlement contract for Horizen L3.
 *         Charges are posted by an authorized billing role. Users pre-fund balances in ETH.
 */
contract HarpocratesBilling {
    event UserFunded(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event UserCharged(
        address indexed user,
        bytes32 indexed modelId,
        uint256 inputTokens,
        uint256 outputTokens,
        uint256 costWei,
        bytes32 usageHash
    );
    event PriceUpdated(bytes32 indexed modelId, uint256 pricePerTokenWei);
    event BillingRoleUpdated(address indexed newBilling);

    address public owner;
    address public billingRole;

    mapping(address => uint256) public balances;
    mapping(bytes32 => uint256) public pricePerTokenWei;

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier onlyBilling() {
        require(msg.sender == billingRole, "not billing");
        _;
    }

    constructor(address _billingRole) {
        owner = msg.sender;
        billingRole = _billingRole;
    }

    function setBillingRole(address _billingRole) external onlyOwner {
        billingRole = _billingRole;
        emit BillingRoleUpdated(_billingRole);
    }

    function setPrice(bytes32 modelId, uint256 priceWei) external onlyOwner {
        pricePerTokenWei[modelId] = priceWei;
        emit PriceUpdated(modelId, priceWei);
    }

    function fund() external payable {
        require(msg.value > 0, "no value");
        balances[msg.sender] += msg.value;
        emit UserFunded(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "insufficient");
        balances[msg.sender] -= amount;
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "transfer failed");
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @notice Charge a user for usage, authorized by billing role.
     * @param user The account being charged.
     * @param modelId Identifier for the model used.
     * @param inputTokens Input token count.
     * @param outputTokens Output token count.
     * @param usageHash Commitment to usage/attestation data (e.g., attestation hash or merkle leaf).
     */
    function charge(
        address user,
        bytes32 modelId,
        uint256 inputTokens,
        uint256 outputTokens,
        bytes32 usageHash
    ) external onlyBilling {
        uint256 price = pricePerTokenWei[modelId];
        require(price > 0, "price not set");
        uint256 totalTokens = inputTokens + outputTokens;
        uint256 cost = totalTokens * price;
        require(balances[user] >= cost, "insufficient balance");

        balances[user] -= cost;
        emit UserCharged(user, modelId, inputTokens, outputTokens, cost, usageHash);
    }
}
