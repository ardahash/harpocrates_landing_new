# Reviewer Demo (5 minutes)

## Goal
Show that Harpocrates encrypts sensitive data client-side, keeps keys local, and posts a real ZK billing proof that
settles in ETH on Horizen L3.

## Setup (1 minute)
1) Open `/dashboard` in the browser.
2) If in development, toggle **Demo Mode** on (top-right). This preloads data and auto-runs the privacy demo.
3) Confirm network config in the **Network** card (Horizen L3 + billing contract).
4) Optional: set `NEXT_PUBLIC_DEMO_USER_ADDRESS` to auto-fill a funded address for the proof demo.

## Privacy Demo Walkthrough (2 minutes)
1) In the **Privacy Demo** section, note the plaintext input.
2) Click **Run full demo** (one click).
3) Observe:
   - **Request ciphertext** and IV appear (this is what would be sent over the network).
   - **Attestation (demo)** appears, indicating simulated enclave measurement and receipt.
   - **Decrypted output** appears locally (keys never leave the page).

## ZK Billing Proof Demo (2 minutes)
1) Ensure the demo user address is funded and the model price is set on-chain.
2) In **ZK Billing Proof**, keep the default token counts.
3) Click **Generate proof + settle**.
4) Observe:
   - Usage hash and nullifier are displayed.
   - **Proof verified: On-chain** appears with a transaction link.

## Optional: On-Chain Receipt (1 minute)
If a funding transaction exists:
1) Run the chunked indexer (`node scripts/chunked-indexer.js`).
2) Open `scripts/billing-events.jsonl` to show `UserFunded` / `UserCharged` events tied to the billing contract.

## Notes
- The enclave execution is simulated for the UI demo; the billing proof is a real Groth16 proof verified on-chain.
- The contract address and RPC are configurable via `.env` and visible in **Dev Health**.
