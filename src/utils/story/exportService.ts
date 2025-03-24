
import { UserStory } from './types';

// Export stories to Excel file
export const exportStoriesToExcel = (stories: UserStory[]): void => {
  // Prepare data for Excel
  const headers = [
    'ID', 'Story Text', 'Role', 'Goal', 'Benefit', 
    'Priority', 'Acceptance Criteria', 'Additional Notes', 'Project', 'Created At'
  ];
  
  const data = stories.map(story => [
    story.id,
    story.storyText,
    story.role,
    story.goal,
    story.benefit,
    story.priority,
    story.acceptanceCriteria.join('\n'),
    story.additionalNotes || '',
    story.projectName || 'No Project',
    new Date(story.createdAt).toLocaleString()
  ]);
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  data.forEach(row => {
    // Handle commas and newlines in the data by quoting
    const processedRow = row.map(cell => {
      // Convert to string if not already
      const cellStr = String(cell);
      // If the cell contains commas, quotes, or newlines, wrap it in quotes and escape existing quotes
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    });
    csvContent += processedRow.join(',') + '\n';
  });
  
  // Create a Blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'user_stories.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
