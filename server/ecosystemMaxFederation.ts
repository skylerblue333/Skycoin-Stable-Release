import { createHash, randomBytes } from "node:crypto";

export type EcosystemModule =
  | "skylanguage"
  | "skydating"
  | "skyshop"
  | "skyschool"
  | "skygaming";

export interface FederationPayload {
  moduleSource: EcosystemModule;
  agentId: string;
  actionIntent: string;
  valueWei: string;
  zkmlProofHash: string;
}

export interface FederatedMandate {
  mandateId: string;
  nonce: string;
  payload: FederationPayload;
  createdAt: number;
}

/**
 * Creates a deterministic mandate identifier plus a unique nonce.
 * This is an envelope builder, not a replacement for AP2/EIP-712 signing.
 * A production signer must sign the canonical payload with an authorized key.
 */
export function createFederatedMandate(payload: FederationPayload): FederatedMandate {
  const createdAt = Date.now();
  const nonce = randomBytes(16).toString("hex");
  const canonical = JSON.stringify({ ...payload, createdAt, nonce });
  const mandateId = createHash("sha256").update(canonical).digest("hex");

  return { mandateId, nonce, payload, createdAt };
}

/**
 * Validates the local shape of a federation request before it reaches the
 * on-chain verifier. Network authorization, signature recovery, replay
 * protection and ZK verification remain explicit downstream responsibilities.
 */
export function validateFederationPayload(payload: FederationPayload): void {
  if (!payload.agentId.trim()) throw new Error("agentId is required");
  if (!payload.actionIntent.trim()) throw new Error("actionIntent is required");
  if (!/^[0-9]+$/.test(payload.valueWei)) throw new Error("valueWei must be an integer string");
  if (!/^[0-9a-f]{64}$/i.test(payload.zkmlProofHash)) {
    throw new Error("zkmlProofHash must be a SHA-256 hex digest");
  }
}
