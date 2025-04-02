
import { jsPDF } from "jspdf";
import { UserStory } from './types';

// Export a single story to PDF
export const exportStoryToPdf = (story: UserStory): void => {
  const doc = new jsPDF();
  
  // Set up the document
  doc.setFontSize(16);
  doc.text("User Story", 20, 20);
  
  // Add story text
  doc.setFontSize(12);
  doc.text(`${story.storyText}`, 20, 30);
  
  // Add priority
  doc.setFontSize(10);
  doc.text(`Priority: ${story.priority}`, 20, 40);
  
  // Add project info if available
  if (story.projectName) {
    doc.text(`Project: ${story.projectName}`, 20, 50);
  }
  
  // Add creation date
  doc.text(`Created: ${new Date(story.createdAt).toLocaleString()}`, 20, 60);
  
  // Add acceptance criteria
  doc.setFontSize(12);
  doc.text("Acceptance Criteria:", 20, 75);
  doc.setFontSize(10);
  
  let yPosition = 85;
  story.acceptanceCriteria.forEach((criterion, index) => {
    doc.text(`${index + 1}. ${criterion}`, 25, yPosition);
    yPosition += 10;
  });
  
  // Add additional notes if available
  if (story.additionalNotes) {
    yPosition += 5;
    doc.setFontSize(12);
    doc.text("Additional Notes:", 20, yPosition);
    yPosition += 10;
    doc.setFontSize(10);
    doc.text(story.additionalNotes, 25, yPosition);
  }
  
  // Save the PDF
  doc.save(`user-story-${story.id}.pdf`);
};

// Export multiple stories to PDF
export const exportStoriesToPdf = (stories: UserStory[], projectName?: string): void => {
  if (stories.length === 0) return;
  
  const doc = new jsPDF();
  let pageCount = 1;
  let yPosition = 20;
  
  // Add title
  doc.setFontSize(16);
  doc.text(projectName ? `${projectName} - User Stories` : "User Stories", 20, yPosition);
  yPosition += 15;
  
  // Add stories
  stories.forEach((story, storyIndex) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      pageCount++;
      yPosition = 20;
    }
    
    // Add story text
    doc.setFontSize(12);
    doc.text(`Story ${storyIndex + 1}: ${story.storyText}`, 20, yPosition);
    yPosition += 10;
    
    // Add priority
    doc.setFontSize(10);
    doc.text(`Priority: ${story.priority}`, 25, yPosition);
    yPosition += 10;
    
    // Add acceptance criteria
    doc.text("Acceptance Criteria:", 25, yPosition);
    yPosition += 7;
    
    story.acceptanceCriteria.forEach((criterion, index) => {
      doc.text(`- ${criterion}`, 30, yPosition);
      yPosition += 7;
      
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        pageCount++;
        yPosition = 20;
      }
    });
    
    // Add separator
    yPosition += 10;
    
    // Check if we need a new page for the next story
    if (yPosition > 230 && storyIndex < stories.length - 1) {
      doc.addPage();
      pageCount++;
      yPosition = 20;
    }
  });
  
  // Save the PDF
  const filename = projectName 
    ? `${projectName.toLowerCase().replace(/\s+/g, '-')}-stories.pdf` 
    : 'user-stories.pdf';
    
  doc.save(filename);
};
