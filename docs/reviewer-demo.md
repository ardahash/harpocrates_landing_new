# Reviewer Demo (5 minutes)

## Goal
Show that Harpocrates encrypts sensitive data client-side, keeps keys local, and returns encrypted outputs with verifiable receipts.

## Setup (1 minute)
1) Open `/dashboard` in the browser.
2) If in development, toggle **Demo Mode** on (top-right). This preloads data and auto-runs the privacy demo.
3) Confirm network config in the “Network” card (Horizen L3 + billing contract).

## Privacy Demo Walkthrough (2 minutes)
1) In the **Privacy Demo** section, note the plaintext input.
2) Click **Run full demo** (one click).
3) Observe:
   - **Request ciphertext** and IV appear (this is what would be sent over the network).
   - **Attestation (demo)** appears, indicating simulated enclave measurement and receipt.
   - **Decrypted output** appears locally (keys never leave the page).

## What This Proves (1 minute)
- Sensitive prompts are encrypted before any network transfer.
- Only ciphertext is shared outside the browser.
- Decryption happens locally after simulated attestation/receipt checks.

## Optional: On-Chain Receipt (1 minute)
If a funding transaction exists:
1) Run the chunked indexer (`node scripts/chunked-indexer.js`).
2) Open `scripts/billing-events.jsonl` to show `UserFunded` / `UserCharged` events tied to the billing contract.

## Notes
- The enclave and ZK proof are simulated in this demo to make the privacy property obvious without backend dependencies.
- The contract address and RPC are configurable via `.env` and visible in **Dev Health**.
