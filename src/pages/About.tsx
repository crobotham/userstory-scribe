
import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <div className="flex flex-col gap-2 items-center text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Learn more about our user story generation platform
            </p>
          </div>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-muted-foreground">
              We believe that great user stories are the foundation of successful software development. 
              Our platform helps teams create clear, detailed, and actionable user stories to improve 
              communication and deliver better products.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">How It Works</h2>
            <p className="text-muted-foreground">
              Our AI-powered questionnaire guides you through the process of creating well-structured 
              user stories. By answering a few simple questions, you'll generate user stories that capture 
              user needs, acceptance criteria, and business value.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">The Team</h2>
            <p className="text-muted-foreground">
              We're a team of passionate developers, product managers, and designers who understand 
              the challenges of capturing requirements effectively. With decades of combined experience 
              in agile methodologies, we've built this tool to solve real problems we've faced in our careers.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p className="text-muted-foreground">
              Have questions or feedback? We'd love to hear from you! Visit our 
              <Link to="/contact" className="text-primary hover:underline ml-1">contact page</Link> to get in touch.
            </p>
          </section>
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="max-w-5xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Crafted with simplicity and elegance in mind</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
