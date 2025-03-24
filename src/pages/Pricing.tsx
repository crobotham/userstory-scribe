
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, CreditCard, ArrowRight, BadgeDollarSign, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";

const PricingCard = ({ 
  title, 
  price, 
  period, 
  description, 
  features, 
  buttonText, 
  popular = false 
}: { 
  title: string; 
  price: string; 
  period: string; 
  description: string; 
  features: string[]; 
  buttonText: string; 
  popular?: boolean; 
}) => (
  <Card className={`flex flex-col h-full ${popular ? 'border-primary shadow-lg' : 'border-border'}`}>
    {popular && (
      <div className="bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-t-md w-full text-center">
        Most Popular
      </div>
    )}
    <CardHeader className={`${popular ? 'pt-4' : 'pt-6'}`}>
      <CardTitle className="text-xl">{title}</CardTitle>
      <div className="mt-2">
        <span className="text-3xl font-bold">{price}</span>
        {period && <span className="text-muted-foreground ml-1">{period}</span>}
      </div>
      <CardDescription className="mt-2">{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex">
            <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button className="w-full" variant={popular ? "default" : "outline"} asChild>
        <Link to="/signup">{buttonText}</Link>
      </Button>
    </CardFooter>
  </Card>
);

const FeatureRow = ({ 
  feature, 
  basic, 
  standard, 
  premium,
  category = false
}: { 
  feature: string; 
  basic: boolean | string; 
  standard: boolean | string; 
  premium: boolean | string;
  category?: boolean;
}) => (
  <TableRow className={category ? "bg-muted/50" : ""}>
    <TableCell className={category ? "font-semibold" : ""}>
      {feature}
    </TableCell>
    <TableCell className="text-center">
      {typeof basic === "boolean" ? (
        basic ? <Check className="h-5 w-5 text-primary mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
      ) : (
        <span>{basic}</span>
      )}
    </TableCell>
    <TableCell className="text-center">
      {typeof standard === "boolean" ? (
        standard ? <Check className="h-5 w-5 text-primary mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
      ) : (
        <span>{standard}</span>
      )}
    </TableCell>
    <TableCell className="text-center">
      {typeof premium === "boolean" ? (
        premium ? <Check className="h-5 w-5 text-primary mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
      ) : (
        <span>{premium}</span>
      )}
    </TableCell>
  </TableRow>
);

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");

  const basicFeatures = [
    "Free Online Store with SSL",
    "Unlimited products",
    "Basic analytics",
    "Mobile app for iOS and Android",
    "Email support"
  ];

  const standardFeatures = [
    "Everything in Basic, plus:",
    "Advanced analytics and reporting",
    "Priority support",
    "Customer loyalty program",
    "Custom domain",
    "Social media integration"
  ];

  const premiumFeatures = [
    "Everything in Standard, plus:",
    "Dedicated account manager",
    "Advanced API access",
    "Multiple user accounts",
    "Abandoned cart recovery",
    "Custom integrations",
    "24/7 phone support"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Choose the plan that works best for your business needs. No hidden fees, no contracts.
            </p>
            
            <Tabs 
              defaultValue="monthly" 
              value={billingPeriod}
              onValueChange={(value) => setBillingPeriod(value as "monthly" | "annually")}
              className="mx-auto w-fit mb-12"
            >
              <TabsList className="grid w-[300px] grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annually">Annually <span className="ml-1 text-xs bg-green-100 text-green-800 py-0.5 px-1.5 rounded-full">Save 20%</span></TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <PricingCard
                title="Basic"
                price={billingPeriod === "monthly" ? "$9" : "$7"}
                period="/month"
                description="Perfect for startups and small businesses"
                features={basicFeatures}
                buttonText="Get Started"
              />
              
              <PricingCard
                title="Standard"
                price={billingPeriod === "monthly" ? "$29" : "$23"}
                period="/month"
                description="Great for growing businesses"
                features={standardFeatures}
                buttonText="Get Started"
                popular={true}
              />
              
              <PricingCard
                title="Premium"
                price={billingPeriod === "monthly" ? "$79" : "$63"}
                period="/month"
                description="For businesses with advanced needs"
                features={premiumFeatures}
                buttonText="Get Started"
              />
            </div>
          </div>
        </section>
        
        {/* Feature Comparison Table */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Compare Plans</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See which plan is right for your business with our detailed feature comparison.
              </p>
            </div>
            
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="w-[350px]">Features</TableHead>
                    <TableHead className="text-center">Basic</TableHead>
                    <TableHead className="text-center bg-primary/5">Standard</TableHead>
                    <TableHead className="text-center">Premium</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <FeatureRow 
                    feature="Core Features" 
                    basic={true}
                    standard={true}
                    premium={true}
                    category={true}
                  />
                  <FeatureRow 
                    feature="Online Store with SSL" 
                    basic={true}
                    standard={true}
                    premium={true}
                  />
                  <FeatureRow 
                    feature="Product Limit" 
                    basic="500 products"
                    standard="Unlimited"
                    premium="Unlimited"
                  />
                  <FeatureRow 
                    feature="Mobile App Access" 
                    basic={true}
                    standard={true}
                    premium={true}
                  />
                  <FeatureRow 
                    feature="Custom Domain" 
                    basic={false}
                    standard={true}
                    premium={true}
                  />
                  
                  <FeatureRow 
                    feature="Analytics & Reporting" 
                    basic={true}
                    standard={true}
                    premium={true}
                    category={true}
                  />
                  <FeatureRow 
                    feature="Basic Analytics" 
                    basic={true}
                    standard={true}
                    premium={true}
                  />
                  <FeatureRow 
                    feature="Advanced Analytics" 
                    basic={false}
                    standard={true}
                    premium={true}
                  />
                  <FeatureRow 
                    feature="Custom Reports" 
                    basic={false}
                    standard={false}
                    premium={true}
                  />
                  <FeatureRow 
                    feature="Export Data" 
                    basic="CSV only"
                    standard="CSV, Excel"
                    premium="All formats"
                  />
                  
                  <FeatureRow 
                    feature="Marketing Tools" 
                    basic={true}
                    standard={true}
                    premium={true}
                    category={true}
                  />
                  <FeatureRow 
                    feature="Social Media Integration" 
                    basic={false}
                    standard={true}
                    premium={true}
                  />
                  <FeatureRow 
                    feature="Loyalty Program" 
                    basic={false}
                    standard={true}
                    premium={true}
                  />
                  <FeatureRow 
                    feature="Abandoned Cart Recovery" 
                    basic={false}
                    standard={false}
                    premium={true}
                  />
                  <FeatureRow 
                    feature="Email Marketing" 
                    basic="Basic"
                    standard="Advanced"
                    premium="Premium"
                  />
                  
                  <FeatureRow 
                    feature="Support" 
                    basic={true}
                    standard={true}
                    premium={true}
                    category={true}
                  />
                  <FeatureRow 
                    feature="Email Support" 
                    basic="5 day response"
                    standard="48h response"
                    premium="24h response"
                  />
                  <FeatureRow 
                    feature="Live Chat" 
                    basic={false}
                    standard={true}
                    premium={true}
                  />
                  <FeatureRow 
                    feature="Phone Support" 
                    basic={false}
                    standard={false}
                    premium={true}
                  />
                  <FeatureRow 
                    feature="Dedicated Account Manager" 
                    basic={false}
                    standard={false}
                    premium={true}
                  />
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary/5">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Choose the plan that works for you and start creating better user stories today.
                  </p>
                  <Button size="lg" className="gap-2" asChild>
                    <Link to="/signup">
                      Start your free trial <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <CreditCard className="h-10 w-10 text-primary" />
                    <div>
                      <h3 className="font-medium">No credit card required</h3>
                      <p className="text-sm text-muted-foreground">Try it free for 14 days</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Get full access to all features during your trial. No credit card required. Cancel anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-slate-50 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Every plan includes</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                All the essential tools you need to create better user stories, no matter which plan you choose.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <BadgeDollarSign className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">No hidden fees</h3>
                <p className="text-muted-foreground">
                  Transparent pricing with no surprise charges. What you see is what you pay.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Zap className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">Fast onboarding</h3>
                <p className="text-muted-foreground">
                  Get started quickly with our intuitive interface and helpful onboarding.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Shield className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">Security included</h3>
                <p className="text-muted-foreground">
                  Enterprise-grade security to keep your data safe and secure.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently asked questions</h2>
              <p className="text-lg text-muted-foreground">
                Have questions? We're here to help.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Can I change plans later?</h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Is there a free trial?</h3>
                <p className="text-muted-foreground">
                  Yes, we offer a 14-day free trial for all plans. No credit card required.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-medium">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers for annual plans.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Can I cancel my subscription?</h3>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time from your account settings. No long-term contracts.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <footer className="py-8 border-t">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary">Features</Link></li>
                  <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link></li>
                  <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary">Templates</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary">Blog</Link></li>
                  <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary">Guides</Link></li>
                  <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About us</Link></li>
                  <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
                  <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link></li>
                  <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary">Terms</Link></li>
                  <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} User Stories. All rights reserved.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Pricing;
