
import React from "react";
import { ScrollText, PenTool, Book, Users, ArrowRight } from "lucide-react";
import FeatureCard from "./FeatureCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-slate-50 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-3 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
            What We Offer
          </div>
          <h2 className="text-4xl font-bold mb-4">Everything you need for better user stories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform guides you through creating comprehensive user stories that drive development
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={ScrollText}
            title="Structured Format"
            description="Guided questions ensure you create complete and clear user stories every time"
          />
          <FeatureCard 
            icon={PenTool}
            title="Rich Formatting"
            description="Add acceptance criteria and notes to make your stories more comprehensive"
          />
          <FeatureCard 
            icon={Book}
            title="Story Management"
            description="Track and organize your user stories in one centralized location"
          />
          <FeatureCard 
            icon={Users}
            title="Team Collaboration"
            description="Share and collaborate on user stories with your entire team"
          />
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/dashboard">
            <Button variant="outline" className="group">
              Start Creating Stories
              <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
