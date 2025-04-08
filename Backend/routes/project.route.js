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
  deleteProjectStatusController,
  startTimerController,
   stopTimerController,
  createTimeEntry,
  getTimeEntryById,
  getTimeEntriesByProject,
  updateTimeEntry,
  deleteTimeEntry,
  getProjectsByClientId,
  getTotalHoursForProjectController,
  getHoursByTaskForProjectController,
  getUserTotalHoursOnProjectController,
  getActiveTimerController
} from '../controller/project.controller.js';  // Import controller functions

import { authenticate } from '../middleware/authenticate.js';  // Import authentication middleware

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

// ✅ Route to get projects by client ID
router.get("/projects/client/:clientId", getProjectsByClientId);


// ⏱️ Project Time Routes
router.post("/projecttime", authenticate, createTimeEntry); // ➕ Create
router.get("/projecttime/:id", authenticate, getTimeEntryById); // 📥 By ID
router.get("/project/:projectId", authenticate, getTimeEntriesByProject); // 📋 By Project
router.put("/projecttime/:id", authenticate, updateTimeEntry); // ✏️ Update
router.delete("/projecttime/:id", authenticate, deleteTimeEntry); // 🗑️ Delete



// ⏱️ Timer Workflow Routes
router.post("/projecttime/start", authenticate, startTimerController);  // Start Timer
router.put("/projecttime/stop/:id", authenticate, stopTimerController); // Stop Timer
router.get("/projecttime/active/:taskId", authenticate, getActiveTimerController); // Get Active Timer

// Time Tracking Routes
router.get("/projecttime/by-task/project/:projectId", authenticate, async (req, res) => {
  try {
    const { projectId } = req.params;
    const query = `
      SELECT 
        task_id,
        SUM(hours) as total_hours
      FROM _project_time
      WHERE project_id = ? AND status = 'logged' AND deleted = 0
      GROUP BY task_id
    `;

    db.query(query, [projectId], (err, result) => {
      if (err) {
        console.error('Error fetching task time:', err);
        return res.status(500).json({ success: false, message: 'Failed to fetch task time' });
      }

      res.json({
        success: true,
        data: result
      });
    });
  } catch (error) {
    console.error('Error fetching task time:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 📊 Project Time Analysis Routes
// 🔢 Total time spent on a project
router.get('/projecttime/total/project/:projectId', authenticate, getTotalHoursForProjectController);

// 📊 Time spent per task under a project
router.get('/projecttime/by-task/project/:projectId', authenticate, getHoursByTaskForProjectController);

// 👨‍💻 Time a user spent on a project
router.get('/projecttime/user/:userId/project/:projectId', authenticate, getUserTotalHoursOnProjectController);

export default router;  // Export the router so it can be used in the main app
