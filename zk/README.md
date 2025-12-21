# Harpocrates ZK Billing

This folder contains the Circom circuit and scripts for the billing proof.

## Prerequisites
- `circom` installed and on your PATH
- `snarkjs` installed via `npm install`

## Scripts
- `npm run zk:build` — compile the circuit and generate keys/verifier
- `npm run zk:prove` — generate a sample proof using `zk/inputs/example.json`
- `npm run zk:test` — verify the generated proof off-chain

## Notes
- The circuit uses Poseidon hashes from `circomlib`.
- Public inputs are split into 128-bit limbs to fit within the field.
- `zk/scripts/utils.js` computes usageHash/nullifier and updates the input JSON in place.
