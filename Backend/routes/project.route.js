import express from 'express';  // Import Express
import { 
  createProject, 
  getAllProjects, 
  getProjectById, 
  updateProject, 
  deleteProject,
  createProjectStatusController,
  getAllProjectStatusesController,
  updateProjectStatusController,
  deleteProjectStatusController
} from '../controller/project.controller.js';  // Import controller functions
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();  // Create an instance of Router

// Project Routes
router.post('/projects',authenticate,createProject);
router.get('/projects', getAllProjects);
router.get('/projects/:projectId', getProjectById);
router.put('/projects/:projectId', updateProject);
router.delete('/projects/:projectId', deleteProject);

// Project Status Routes
router.post('/project-status', createProjectStatusController);
router.get('/project-status', getAllProjectStatusesController);
router.put('/project-status/:id', updateProjectStatusController);
router.delete('/project-status/:id', deleteProjectStatusController);

export default router;  // Export the router so it can be used in the main app
