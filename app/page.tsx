import { Hero } from "@/components/hero"
import { WhyPrivacy } from "@/components/why-privacy"
import { HowItWorks } from "@/components/how-it-works"
import { Features } from "@/components/features"
import { ForDevelopers } from "@/components/for-developers"
import { BuiltOnHorizen } from "@/components/built-on-horizen"
import { UseCases } from "@/components/use-cases"
import { TokenEconomics } from "@/components/token-economics"
import { Roadmap } from "@/components/roadmap"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <WhyPrivacy />
      <HowItWorks />
      <Features />
      <ForDevelopers />
      <BuiltOnHorizen />
      <UseCases />
      <TokenEconomics />
      <Roadmap />
      <FAQ />
      <Footer />
    </main>
  )
}
