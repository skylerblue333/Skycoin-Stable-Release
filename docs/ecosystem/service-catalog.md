# SKYCOIN4444 Ecosystem Service Catalog

This document defines how the repository portfolio fits together without deleting or replacing existing implementations.

## Canonical layers

1. **Core / Platform** — canonical application, shared contracts, configuration, and release integration.
2. **Skycoin protocol/core** — protocol, chain, transaction, wallet primitives, and compatibility layers.
3. **ShadowChat** — realtime messaging, presence, media, moderation, and communication services.
4. **Production builds** — release candidates, deployment packaging, migrations, smoke tests, and operational evidence.
5. **Frontend** — shared UI primitives, route/page implementations, dashboards, and product surfaces.
6. **Wallet / Finance / Marketplace** — balances, portfolios, payments, exchange/market workflows, NFTs, and commerce.
7. **AI / HopeAI** — model adapters, agent orchestration, inference, retrieval, evaluation, and AI governance.
8. **SkySchool** — courses, quizzes, certifications, progress, and learning services.
9. **Security / Infrastructure** — identity, authorization, secrets boundaries, observability, networking, CI/CD, backups, and reliability.
10. **Focused services** — small repositories remain independently testable services/libraries when they provide a distinct reusable capability.

## Integration rules

- Preserve existing working code before replacing anything.
- Prefer mature open-source dependencies and upstream projects over custom reimplementation.
- Do not copy third-party repositories wholesale into SKYCOIN4444. Record upstream project, license, version, and integration boundary when adopting code.
- Every service should expose a documented health/readiness contract and explicit inputs/outputs where applicable.
- Shared contracts belong in canonical documentation/types; product-specific behavior stays with its owning service.
- A repository is not considered production-ready merely because it builds. CI, tests, dependency health, secrets handling, observability, and deployment evidence must agree.
- Duplicate implementations are compared first; useful behavior is preserved and the canonical implementation is selected before consolidation.

## Service ownership convention

Each focused repository should contain:

- `README.md` — purpose, ownership boundary, integration points, and local run instructions.
- dependency manifest/lockfile appropriate to its language.
- `/healthz` or an equivalent health contract for long-running services.
- tests for its public behavior.
- a short `ECOSYSTEM.md` section describing upstream/downstream dependencies.

## Current consolidation direction

The portfolio is being treated as one ecosystem with explicit boundaries rather than 244 unrelated applications. Consolidation means **integrating capability and contracts**, not deleting history or throwing away useful implementations.
