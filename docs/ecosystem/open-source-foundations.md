# Open-source foundations policy

SKYCOIN4444 uses a reuse-first engineering model.

## Preferred categories

- **Web/API:** FastAPI, Express, Go HTTP/gRPC, GraphQL/Apollo where the interface requires it.
- **Realtime:** Socket.IO/WebSocket-compatible infrastructure.
- **Jobs/events:** BullMQ/Redis, Celery, Kafka/NATS-style systems where scale requires them.
- **Workflow/orchestration:** Prefect/Temporal-style durable workflow patterns where appropriate.
- **Observability:** OpenTelemetry-compatible traces, metrics, and logs.
- **Identity:** standards-based OAuth/OIDC/JWT components; avoid rolling cryptography.
- **Data:** established SQL/ORM/migration tooling and mature analytical engines.
- **Blockchain:** established chain SDKs and audited primitives instead of custom cryptography.
- **Frontend:** React/Next.js/Vite ecosystem components instead of custom framework replacements.

## Adoption requirements

Before importing or adapting external code:

1. Verify the upstream repository is public and its license permits the intended use.
2. Prefer maintained, widely used projects with active security processes.
3. Record the upstream project and version in the owning repository.
4. Keep SKYCOIN4444-specific code in an adapter/service boundary so upstream updates remain possible.
5. Never commit credentials, private keys, production tokens, or generated secrets.
6. Preserve existing SKYCOIN4444 functionality unless an integration is verified to be equivalent or better.

The goal is to make the ecosystem **more complete, interoperable, maintainable, and valuable without destroying existing work**.
