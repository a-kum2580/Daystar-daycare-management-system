import React from "react";
import { Header } from "components/Header";
import { Footer } from "components/Footer";
import { HeroSection } from "components/HeroSection";
import { AboutSection } from "components/AboutSection";
import { FeaturesSection } from "components/FeaturesSection";
import { BenefitsSection } from "components/BenefitsSection";
import { CTASection } from "components/CTASection";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <BenefitsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
