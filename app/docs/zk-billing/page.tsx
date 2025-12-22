import { DocHeading } from "@/components/docs/doc-heading"
import { DocSection } from "@/components/docs/doc-section"
import { Callout } from "@/components/docs/callout"

export default function ZkBillingPage() {
  return (
    <div className="max-w-4xl">
      <DocHeading level={1}>ZK Billing Proofs</DocHeading>

      <DocSection>
        <DocHeading level={2} id="overview">
          Overview
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Harpocrates uses a Groth16 proof to authorize charges on-chain without revealing token counts. The proof shows
          that the cost was computed correctly from private usage data and binds that usage to a public commitment.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Settlement stays ETH-denominated on Horizen L3 while ZEN is not yet available on that network.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="circuit">
          Circuit Semantics
        </DocHeading>
        <ul className="space-y-2 text-muted-foreground">
          <li>
            <span className="text-foreground font-medium">Private inputs:</span> inputTokens, outputTokens, userSecret,
            nonce.
          </li>
          <li>
            <span className="text-foreground font-medium">Public inputs:</span> user, modelId, pricePerTokenWei, costWei,
            usageHash, nullifier (split into 128-bit limbs).
          </li>
          <li>
            <span className="text-foreground font-medium">Constraints:</span> cost = (input + output) * price,
            usageHash = Poseidon(user, modelId, inputTokens, outputTokens, nonce), nullifier = Poseidon(userSecret,
            usageHash).
          </li>
        </ul>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="flow">
          On-Chain Flow
        </DocHeading>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>Fetch pricePerTokenWei for the model from the billing contract.</li>
          <li>Generate a proof with private token counts and a random nonce.</li>
          <li>Submit chargeWithProof with the proof, usageHash, and nullifier.</li>
          <li>The verifier checks the proof; the billing contract checks price and replay protection.</li>
          <li>Balances are debited in ETH and the receipt event is emitted.</li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-4">
          The demo server submits chargeWithProof using a billing signer (BILLING_PRIVATE_KEY). Keep this key server-side
          and do not expose it to clients.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="replay">
          Replay Protection
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed">
          Each proof includes a nullifier derived from a user secret and the usageHash. The contract stores
          nullifierUsed to prevent double charges from the same proof.
        </p>
      </DocSection>

      <Callout type="info">
        This proof hides token counts on-chain, but the modelId, price, and total cost remain public for settlement.
        Metadata such as timing and model selection are not hidden.
      </Callout>
    </div>
  )
}
