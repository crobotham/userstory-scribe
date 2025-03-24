
// Export all functionality from specialized service files
export * from './services/storyGenerator';
export * from './services/storyStorage';
export * from './services/storyRetrieval';
// Re-export projectService but exclude getProjectById to avoid conflict
export { 
  createProject, 
  deleteProjectFromLocalStorage, 
  updateProjectInLocalStorage 
} from './services/projectService';
export * from './services/projectCreate';
export * from './services/projectDelete';
export * from './services/projectUpdate';
export * from './services/projectRetrieval';
export * from './services/projectStorage';
