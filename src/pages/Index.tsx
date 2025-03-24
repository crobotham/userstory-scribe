import React from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";
import FooterSection from "@/components/home/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        
        {/* Question Flow and Story History will appear after login */}
        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* Import and reuse the existing components */}
          </div>
        </section>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default Index;
