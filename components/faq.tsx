import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does Harpocrates protect my data?",
    answer:
      "Harpocrates uses a combination of client-side encryption, trusted execution environments (TEEs), and zero-knowledge proofs. Your data is encrypted before leaving your system, processed inside a secure hardware enclave that prevents any external access, and verified cryptographically without revealing the underlying data.",
  },
  {
    question: "What is a TEE and how is it used?",
    answer:
      "A Trusted Execution Environment (TEE) is a secure area of a processor that guarantees code and data loaded inside are protected with respect to confidentiality and integrity. We use TEEs to run AI inference on encrypted data, ensuring that even the infrastructure provider cannot access your prompts or outputs.",
  },
  {
    question: "Do you see my prompts or outputs?",
    answer:
      "No. Your prompts are encrypted client-side before transmission, processed inside a secure enclave that we cannot access, and outputs are delivered encrypted back to you. The only thing we see is encrypted ciphertext and cryptographic proofs of correct execution.",
  },
  {
    question: "Which models will be supported at launch?",
    answer:
      "At testnet launch, we'll support a curated set of open-weight models optimized for confidential inference (7B-13B parameter range). Post-mainnet, we'll expand to a marketplace model where third-party providers can offer their own models with privacy guarantees.",
  },
  {
    question: "How is ZEN used in the protocol?",
    answer:
      "ZEN serves as the native settlement and gas token on Horizen Base. All inference costs are metered and billed in ZEN, proofs are verified on-chain, and future staking and marketplace transactions will also use ZEN. It provides transparent, on-chain billing and settlement.",
  },
]

export function FAQ() {
  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently asked questions</h2>
          <p className="text-lg text-muted-foreground">Everything you need to know about Harpocrates</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="rounded-xl border border-border bg-card px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
