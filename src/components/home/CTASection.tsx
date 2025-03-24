
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const CTASection = () => {
  const { user } = useAuth();
  
  return (
    <section className="py-16 px-4 bg-primary/5">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Ready to create better user stories?
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start generating comprehensive user stories for your agile projects in minutes,
          not hours. Your product backlog will thank you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="gap-2" asChild>
            <Link to={user ? "/dashboard" : "/signup"}>
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/pricing">
              View pricing
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
