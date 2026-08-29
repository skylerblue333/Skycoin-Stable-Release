// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Minimal verifier interface for a deployed ZK proof verifier.
interface IZKVerifier {
    function verifyProof(bytes calldata proof, uint256[] calldata publicInputs) external view returns (bool);
}

/// @notice Reference settlement boundary for SkyLanguage, SkyDating, SkyShop,
///         SkySchool and SkyGaming. Production deployment requires an audited
///         mandate/signature scheme and a real verifier contract.
contract SkyEcosystemMaxVault {
    address public immutable owner;
    IZKVerifier public immutable zkVerifier;

    mapping(bytes32 => bool) public executedMandates;
    mapping(address => uint256) public globalUserReputation;
    mapping(address => bool) public authorizedAgents;

    event AgentAuthorizationChanged(address indexed agent, bool authorized);
    event EcosystemActionSettled(
        bytes32 indexed mandateId,
        address indexed actor,
        string moduleTag,
        address indexed recipient,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier onlyAuthorizedAgent() {
        require(authorizedAgents[msg.sender], "agent not authorized");
        _;
    }

    constructor(address verifier) {
        require(verifier != address(0), "invalid verifier");
        owner = msg.sender;
        zkVerifier = IZKVerifier(verifier);
    }

    function setAuthorizedAgent(address agent, bool authorized) external onlyOwner {
        require(agent != address(0), "invalid agent");
        authorizedAgents[agent] = authorized;
        emit AgentAuthorizationChanged(agent, authorized);
    }

    function executeUniversalAction(
        bytes32 mandateId,
        bytes calldata mandateEnvelope,
        bytes calldata zkmlProof,
        uint256[] calldata publicInputs,
        string calldata moduleTag,
        address payable recipient,
        uint256 amount,
        address reputationUser,
        uint256 reputationReward
    ) external payable onlyAuthorizedAgent {
        require(mandateId != bytes32(0), "invalid mandate");
        require(recipient != address(0), "invalid recipient");
        require(reputationUser != address(0), "invalid reputation user");
        require(!executedMandates[mandateId], "mandate already executed");
        require(msg.value == amount, "incorrect value");
        require(mandateEnvelope.length != 0, "missing mandate");
        require(zkVerifier.verifyProof(zkmlProof, publicInputs), "invalid zk proof");

        executedMandates[mandateId] = true;
        globalUserReputation[reputationUser] += reputationReward;

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "settlement failed");

        emit EcosystemActionSettled(
            mandateId,
            msg.sender,
            moduleTag,
            recipient,
            amount
        );
    }

    receive() external payable {}
}
