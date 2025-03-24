
import React, { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

interface StoryContent {
  type: string;
  content: string;
}

const AnimatedStoryDisplay = () => {
  const storyExamples: StoryContent[] = [
    {
      type: "Example User Story",
      content: "As a product manager, I want to create clear user stories so that my development team understands requirements better."
    },
    {
      type: "Example Acceptance Criteria",
      content: "Given I'm on the story creation page, when I fill out all required fields and click submit, then a complete user story is generated in standard format."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % storyExamples.length);
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg w-11/12 sm:w-10/12 h-auto min-h-[220px] overflow-hidden flex items-center">
      <Carousel>
        <CarouselContent className="-ml-1">
          {storyExamples.map((item, index) => (
            <CarouselItem 
              key={index} 
              className={`pl-1 transition-opacity duration-500 ${index === activeIndex ? 'opacity-100' : 'opacity-0 absolute'}`}
            >
              <div className="text-sm text-muted-foreground mb-2">{item.type}</div>
              <div className="text-lg font-medium leading-relaxed">{item.content}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default AnimatedStoryDisplay;
