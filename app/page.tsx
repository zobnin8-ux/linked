import { Hero } from "@/components/hero";
import { WhatWeFind } from "@/components/what-we-find";
import { HowItWorks } from "@/components/how-it-works";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { getCompletedAuditsCount } from "@/lib/audits-count";

export default async function Home() {
  const auditsCount = await getCompletedAuditsCount();

  return (
    <div className="min-h-screen bg-[#0E0B08]">
      <Hero auditsCount={auditsCount} />
      <WhatWeFind />
      <HowItWorks />
      <Faq />
      <Footer />
    </div>
  );
}
