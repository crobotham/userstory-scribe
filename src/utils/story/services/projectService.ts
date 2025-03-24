
import { Project } from '../types';
import { getProjectsFromLocalStorage } from './projectRetrieval';
import { createProject } from './projectCreate';
import { deleteProjectFromLocalStorage } from './projectDelete';
import { updateProjectInLocalStorage } from './projectUpdate';

// Export the functions for use elsewhere
export { createProject, deleteProjectFromLocalStorage, updateProjectInLocalStorage };
