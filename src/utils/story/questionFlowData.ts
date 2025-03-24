
// Questions for generating a user story
export const questionFlow = [
  {
    id: "role",
    question: "Who is the user?",
    placeholder: "e.g., marketing manager, customer, administrator",
    description: "Identify the specific role or type of user this story is for."
  },
  {
    id: "goal",
    question: "What do they want to accomplish?",
    placeholder: "e.g., export analytics data, review submitted forms",
    description: "Describe the action or feature they need to achieve their goal."
  },
  {
    id: "benefit",
    question: "Why do they need this?",
    placeholder: "e.g., track campaign performance, save time on review",
    description: "Explain the value or benefit they'll receive from this feature."
  },
  {
    id: "priority",
    question: "What priority would you assign to this?",
    type: "select",
    options: ["High", "Medium", "Low"],
    description: "Indicate how important this story is relative to others."
  },
  {
    id: "acceptanceCriteria",
    question: "What criteria must be met for this to be considered complete?",
    type: "multiline",
    placeholder: "e.g., User can select date range for export\nData is downloaded in CSV format",
    description: "List specific requirements that define when this feature is done."
  },
  {
    id: "additionalNotes",
    question: "Any additional context or notes?",
    type: "multiline",
    placeholder: "Any other relevant information",
    description: "Add any context, constraints, or notes that might be helpful.",
    isOptional: true
  }
];

// Default values for testing/examples
export const defaultUserStory = {
  role: "product manager",
  goal: "create user stories through a guided questionnaire",
  benefit: "I can efficiently document requirements without forgetting important details",
  priority: "Medium" as const,
  acceptanceCriteria: [
    "Each question appears one at a time",
    "Progress is visually indicated",
    "Generated user story follows standard format",
    "Story can be copied to clipboard in one click"
  ],
  additionalNotes: "This should work well on both desktop and mobile devices."
};
