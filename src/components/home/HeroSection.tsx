
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AnimatedStoryDisplay from "./AnimatedStoryDisplay";

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1">User Story Creator</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Tell your user stories with clarity
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Create better product user stories and acceptance criteria in seconds! Clear, comprehensive, and ready for your backlog.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="gap-2" asChild>
                <Link to="/pricing">
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Learn more
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-100 aspect-square md:aspect-auto md:h-[550px] flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatedStoryDisplay />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
