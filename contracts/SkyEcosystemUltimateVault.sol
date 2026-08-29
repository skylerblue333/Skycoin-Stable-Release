// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IZKMLVerifierCore {
    function verifyProof(bytes calldata proof, uint256[] calldata publicInputs) external view returns (bool);
}

contract SkyEcosystemUltimateVault {
    address public immutable owner;
    IZKMLVerifierCore public immutable zkVerifier;
    mapping(bytes32 => bool) public executedMandates;
    mapping(address => uint256) public globalReputationXP;
    mapping(address => bool) public authorizedAgents;

    event AgentAuthorizationChanged(address indexed agent, bool authorized);
    event EcosystemSettled(bytes32 indexed mandateHash, address indexed agent, string moduleTag, address indexed recipient, uint256 amount, uint256 reputationXP);

    modifier onlyOwner() { require(msg.sender == owner, "not owner"); _; }
    modifier onlyAuthorizedAgent() { require(authorizedAgents[msg.sender], "agent not authorized"); _; }

    constructor(address verifier) {
        require(verifier != address(0), "invalid verifier");
        owner = msg.sender;
        zkVerifier = IZKMLVerifierCore(verifier);
    }

    function setAuthorizedAgent(address agent, bool authorized) external onlyOwner {
        require(agent != address(0), "invalid agent");
        authorizedAgents[agent] = authorized;
        emit AgentAuthorizationChanged(agent, authorized);
    }

    function executeUniversalAgenticAction(
        bytes32 mandateHash,
        bytes calldata ap2IntentMandate,
        bytes calldata zkmlProof,
        uint256[] calldata publicInputs,
        string calldata moduleTag,
        address payable recipient,
        uint256 amount,
        uint256 reputationReward
    ) external payable onlyAuthorizedAgent {
        require(mandateHash != bytes32(0), "invalid mandate");
        require(ap2IntentMandate.length != 0, "missing mandate");
        require(recipient != address(0), "invalid recipient");
        require(bytes(moduleTag).length != 0, "missing module");
        require(!executedMandates[mandateHash], "mandate already executed");
        require(msg.value == amount, "incorrect settlement value");
        require(zkVerifier.verifyProof(zkmlProof, publicInputs), "invalid zk proof");
        executedMandates[mandateHash] = true;
        globalReputationXP[msg.sender] += reputationReward;
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "settlement failed");
        emit EcosystemSettled(mandateHash, msg.sender, moduleTag, recipient, amount, reputationReward);
    }

    receive() external payable {}
}
