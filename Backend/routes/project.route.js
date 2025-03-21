import express from 'express';  // Import Express
import { 
  createProject, 
  getAllProjects, 
  getProjectById, 
  updateProject, 
  deleteProject 
} from '../controller/project.controller.js';  // Import controller functions
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();  // Create an instance of Router

// Route to create a new project
router.post('/projects',authenticate,createProject);

// Route to get all projects
router.get('/projects', getAllProjects);

// Route to get a specific project by ID
router.get('/projects/:projectId', getProjectById);

// Route to update a project by ID
router.put('/projects/:projectId', updateProject);

// Route to soft delete a project (set deleted = 1)
router.delete('/projects/:projectId', deleteProject);

export default router;  // Export the router so it can be used in the main app
