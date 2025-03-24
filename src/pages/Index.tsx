
import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";
import FooterSection from "@/components/home/FooterSection";

const Index = () => {
  console.log("Index page rendering");
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        
        {/* Debug section - verify routing */}
        <section className="py-12 px-4 bg-gray-100">
          <div className="max-w-5xl mx-auto space-y-8 text-center">
            <h2 className="text-3xl font-bold">Debug Navigation</h2>
            <div className="flex justify-center gap-4">
              <Link to="/auth" className="px-4 py-2 bg-primary text-white rounded-md">
                Go to Auth Page
              </Link>
              <Link to="/dashboard" className="px-4 py-2 bg-secondary text-foreground rounded-md">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default Index;
