<!-- PORTFOLIO PROJECT PROFILE: maintained by the repository owner -->

# Skycoin Stable Release

**Skycoin-Stable-Release** is a public engineering component of the **SkyCoin4444** ecosystem spanning TypeScript/React, AI, blockchain, education, commerce, social modules, and real-time infrastructure.

> **Status: production-gate engineering branch — NOT a production deployment.** Source code, CI configuration, and manifests are not evidence that external protocols, wallets, ZKML verifiers, or contracts have been deployed.

## Universal Ecosystem Federation

This branch connects the integration boundaries for:

- **SkyLanguage** — language sessions and reputation rewards
- **SkyDating** — privacy-preserving personhood/match workflows
- **SkyShop** — agent-discoverable commerce and settlement
- **SkySchool** — credentials and learn-to-earn reward boundaries
- **SkyGaming** — real-time multiplayer/session transport

### Protocol layer

- `/.well-known/ucp` — UCP-style merchant and capability discovery
- `server/ecosystemMaxFederation.ts` — mandate envelope and payload validation
- `contracts/SkyEcosystemMaxVault.sol` — authorized-agent + ZK verifier settlement boundary
- `contracts/SkyEcosystemUltimateVault.sol` — upgraded universal settlement boundary
- `client/src/components/LiveEcosystemTriadPortal.tsx` — Social-Fi/commerce control portal

The AP2 boundary is intentionally represented as a mandate envelope rather than a fake cryptographic implementation. Real AP2/EIP-712 signing, credential validation, key custody, replay policy, and verifier deployment remain required before production authorization.

## Real-time infrastructure

- `cmd/skygaming-ws/main.go` — hardened Go WebSocket service
- Origin access is deny-by-default through `SKY_WS_ALLOWED_ORIGINS`.
- Connection read limits, deadlines, ping/pong keepalive, write deadlines, health checks, and graceful shutdown are implemented.
- `go.mod` pins the Go module boundary to Gorilla WebSocket.

## Container deployment boundary

- `Dockerfile.go` — minimal non-root Go runtime image
- `Dockerfile.frontend` — production Node application build
- `Dockerfile.zkml` — fail-closed ZKML verifier adapter
- `docker-compose.yml` — application, real-time engine, and verifier-adapter mesh with health-gated dependencies
- `deploy/zkml-worker.mjs` — intentionally fails closed until a real audited ZKML verifier is configured

## Automated production gate

`.github/workflows/production-gate.yml` now gates the branch with:

1. frozen pnpm install
2. TypeScript type checking
3. Vitest test execution
4. production application build
5. Go tests, vet, and build
6. Docker Compose configuration validation
7. Go and verifier-adapter image builds
8. Foundry Solidity build/test when a Foundry project is present

### Production authorization checklist

The system must not be labeled production-ready until all of the following have evidence:

- CI checks pass on the exact release commit.
- Solidity contract tests and independent security/static analysis pass.
- Real AP2/EIP-712 signing and credential validation are integrated.
- A deployed, audited ZKML verifier is configured.
- Production RPC/network, contract addresses, wallets, limits, and secrets are configured securely.
- Authenticated end-to-end tests cover SkyGaming, SkySchool, SkyShop, SkyLanguage, and SkyDating.
- TLS, DNS, monitoring, backups, rollback, and incident procedures are verified.
- Deployment smoke tests pass against the actual production environment.

## Verification record

The integration work is committed to the public GitHub repository on `feature/universal-ecosystem-federation`. GitHub-side file verification confirms the federation sources, UCP manifest, CI gate, Go service, and deployment artifacts are present on the branch.

**Do not confuse “code committed” with “production deployed.”** The final merge/deploy gate is intentionally evidence-based.

## Technology Stack

- TypeScript / React / Vite
- Solidity `^0.8.24`
- Go / Gorilla WebSocket
- Node.js
- REST / MCP / A2A integration boundaries
- UCP-style discovery
- AP2-style intent boundary
- ZK proof verifier interface
- Docker Compose
- GitHub Actions / Foundry gate

## Author

**Skyler Blue Spillers** — Software Engineer & Founder

---
*Powered by SkyCoin4444*
