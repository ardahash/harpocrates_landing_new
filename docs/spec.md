# Harpocrates Spec v0

## Product Intent & Value
- Confidential AI inference: process encrypted prompts inside TEEs with ZK-backed attestations so developers can use AI without exposing plaintext to providers.
- Settlement currently in ETH on Horizen L3 (ZEN migration when live) for on-chain metering and receipts.
- Developer-facing SDKs (JS/Python) promise client-side encryption helpers, attestation verification, and deterministic billing.

## User Roles & Core Flows
- **Developers**: obtain API key, encrypt prompt locally, call `infer`, decrypt output, optionally verify attestation and on-chain receipt, and pay per usage in ETH on Horizen L3.
- **Operators** (future): manage pricing, monitor usage, publish attestations/receipts, and operate billing contracts/indexer.

## Tech Stack (current code)
- Frontend: Next.js 16 (App Router), React 19, TailwindCSS 4, Shadcn/Radix UI, lucide icons.
- Docs/marketing only; no backend logic, wallets, or crypto libraries implemented.
- Chain target (docs): Horizen Base/L3, settlement in ETH on Horizen L3; TEEs (SGX/SEV-SNP) and ZK attestations described conceptually.

## Existing Features vs Placeholders
- Implemented: Static marketing site and docs pages describing TEE+ZK inference, SDK usage, pricing, models, and production guidance.
- Not implemented: API routes, SDK runtime, encryption/attestation logic, wallet or contract integration, billing, dashboards, or indexers.

## Environment Variables & Secrets
- Referenced in docs only: `HARPOCRATES_API_KEY`, optional `network`, `timeout`. No runtime usage in code yet; no `.env` template.

## Build/Test/Deploy Commands
- `npm run dev` (Next dev), `npm run build` (Next build), `npm run start` (Next start), `npm run lint`. TypeScript errors are ignored in build; images unoptimized.

## Goals (v0)
- Deliver confidential inference UX where sensitive data is encrypted client-side, processed inside a TEE, and proven correct with attestations.
- Provide deterministic, on-chain metering/settlement in ETH on Horizen L3 with verifiable receipts.
- Ship clear docs and a demo flow for developers to try encryption → inference → decryption → verification.

## Non-Goals (v0)
- No model training or fine-tuning workflows.
- No marketplace/staking economics beyond basic pay-per-inference.
- No production wallet UX; funding flows can be stubbed/testnet-only.
- No anonymization or metadata-hiding guarantees beyond what TEEs/ZK cover (side-channel resistance limited).

## Threat Model & Privacy Goals
- Protect plaintext prompts/outputs from cloud operators, host OS, network observers, and Harpocrates staff via client-side encryption + TEE execution.
- Provide verifiable integrity: attest enclave measurement + computation correctness (TEE attestation + ZK proof).
- Limitations: side-channels (timing/size), CPU microarchitectural flaws, client compromise, and key theft are not fully mitigated.
- Observables allowed: metadata for billing/operations (timestamps, token counts, model ID, latency).

## On-Chain vs Off-Chain Components
- **On-chain (planned/minimal)**: Billing/receipt contract on Horizen L3 (ETH-denominated until ZEN live); optional attestation hash commitments.
- **Off-chain**: Encryption/attestation verification libraries (client), inference service running inside TEE, pricing/indexer service mirroring on-chain receipts, dashboards/docs.

## Data Flow & Privacy
1) Client encrypts prompt locally (keys stay client-side).
2) Encrypted payload sent over TLS to Harpocrates.
3) TEE enclave decrypts in-memory, runs model, produces output + attestation; re-encrypts output.
4) Attestation/ZK proof and usage metrics are returned; billing posted on-chain in ETH on Horizen L3.
5) Client decrypts output locally; may verify attestation and on-chain receipt.

## MVP Definition
- Frontend skeleton with landing, docs, and dashboard entry.
- Config for Horizen L3 endpoints and billing contract address (no hard dependency on wallet UX).
- Client-side encryption utility and sample flow that encrypts input, simulates enclave output, and decrypts it locally.
- Attestation placeholder structure with verification stub plus clear limits documented.
- Dev Health page showing build info, env status, and chain connectivity.
- Strict CSP applied; no inline/eval usage.
