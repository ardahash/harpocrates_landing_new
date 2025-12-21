// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


interface IVerifier {
    function verifyProof(
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[12] calldata input
    ) external view returns (bool);
}

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
    event VerifierUpdated(address indexed newVerifier);
    event ZkOnlyUpdated(bool enabled);

    address public owner;
    address public billingRole;
    address public verifier;
    bool public zkOnly;

    mapping(address => uint256) public balances;
    mapping(bytes32 => uint256) public pricePerTokenWei;
    mapping(bytes32 => bool) public nullifierUsed;

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

    function setVerifier(address v) external onlyOwner {
        verifier = v;
        emit VerifierUpdated(v);
    }

    function setZkOnly(bool enabled) external onlyOwner {
        zkOnly = enabled;
        emit ZkOnlyUpdated(enabled);
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
        require(!zkOnly, "zk only");
        uint256 price = pricePerTokenWei[modelId];
        require(price > 0, "price not set");
        uint256 totalTokens = inputTokens + outputTokens;
        uint256 cost = totalTokens * price;
        require(balances[user] >= cost, "insufficient balance");

        balances[user] -= cost;
        emit UserCharged(user, modelId, inputTokens, outputTokens, cost, usageHash);
    }

    /**
     * @notice Charge with a ZK proof that binds to usageHash and nullifier.
     */
    function chargeWithProof(
        address user,
        bytes32 modelId,
        uint256 pricePerTokenWeiInput,
        uint256 costWei,
        bytes32 usageHash,
        bytes32 nullifier,
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c
    ) external onlyBilling {
        require(pricePerTokenWeiInput == pricePerTokenWei[modelId], "price mismatch");
        require(!nullifierUsed[nullifier], "nullifier used");
        require(verifier != address(0), "verifier not set");

        uint256[12] memory inputs = _buildPublicInputs(
            user,
            modelId,
            pricePerTokenWeiInput,
            costWei,
            usageHash,
            nullifier
        );

        require(IVerifier(verifier).verifyProof(a, b, c, inputs), "invalid proof");
        require(balances[user] >= costWei, "insufficient balance");

        balances[user] -= costWei;
        nullifierUsed[nullifier] = true;
        emit UserCharged(user, modelId, 0, 0, costWei, usageHash);
    }

    function _buildPublicInputs(
        address user,
        bytes32 modelId,
        uint256 pricePerTokenWeiInput,
        uint256 costWei,
        bytes32 usageHash,
        bytes32 nullifier
    ) internal pure returns (uint256[12] memory) {
        (uint256 userLo, uint256 userHi) = _splitAddress(user);
        (uint256 modelLo, uint256 modelHi) = _splitBytes32(modelId);
        (uint256 priceLo, uint256 priceHi) = _splitUint256(pricePerTokenWeiInput);
        (uint256 costLo, uint256 costHi) = _splitUint256(costWei);
        (uint256 usageLo, uint256 usageHi) = _splitBytes32(usageHash);
        (uint256 nullLo, uint256 nullHi) = _splitBytes32(nullifier);

        uint256[12] memory inputs;
        inputs[0] = userLo;
        inputs[1] = userHi;
        inputs[2] = modelLo;
        inputs[3] = modelHi;
        inputs[4] = priceLo;
        inputs[5] = priceHi;
        inputs[6] = costLo;
        inputs[7] = costHi;
        inputs[8] = usageLo;
        inputs[9] = usageHi;
        inputs[10] = nullLo;
        inputs[11] = nullHi;
        return inputs;
    }

    function _splitAddress(address user) internal pure returns (uint256 lo, uint256 hi) {
        uint256 value = uint256(uint160(user));
        lo = uint256(uint128(value));
        hi = uint256(uint128(value >> 128));
    }

    function _splitBytes32(bytes32 value) internal pure returns (uint256 lo, uint256 hi) {
        uint256 v = uint256(value);
        lo = uint256(uint128(v));
        hi = uint256(uint128(v >> 128));
    }

    function _splitUint256(uint256 value) internal pure returns (uint256 lo, uint256 hi) {
        lo = uint256(uint128(value));
        hi = uint256(uint128(value >> 128));
    }
}
