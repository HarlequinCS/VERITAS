import { HeroSection } from "@/components/hero-section";
import { FeaturePillars } from "@/components/feature-pillars";
import { ProductPreview } from "@/components/product-preview";
import { HowItWorks } from "@/components/how-it-works";
import { SocialProof } from "@/components/social-proof";
import { CtaBanner } from "@/components/cta-banner";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      <main>
        <HeroSection />
        <FeaturePillars />
        <ProductPreview />
        <HowItWorks />
        <SocialProof />
        <CtaBanner />
      </main>
      <SiteFooter />
    </div>
  );
}
