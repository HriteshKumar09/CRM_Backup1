import express from 'express';
import { addEmployee,
     createJobInfoController,
     deleteJobInfoController,
     //addTeamMember,
     deleteTeamMember,getJobInfoController,getPreferences,getRolesController,
     getTeamMembers,
     updateJobInfoController,
     updatePreferences,
     updateTeamMember } from '../controller/team.controller.js';

const router = express.Router();

import { authenticate } from "../middleware/authenticate.js"; 
// TeamMember-Section

// Route to fetch all team members
router.get('/get-members', getTeamMembers);

// Route to add a new team member
router.post('/add-members', addEmployee);

// Route to update a team member by ID
// Here we should pass `id` as a URL parameter (i.e., /update-members/:id)
router.put('/update-members/:id', updateTeamMember);

// Route to delete a team member by ID
router.delete('/delete-members/:id', deleteTeamMember);


// Route to fetch roles
router.get('/roles', getRolesController);


// Job Info Section
// Route to create job info
router.post('/jobinfo',authenticate,createJobInfoController);

// Route to get job info by userId
router.get('/jobinfo/:userId',authenticate, getJobInfoController);

// Route to update job info by userId
router.put('/jobinfo/:userId',authenticate, updateJobInfoController);

// Route to delete job info by userId
router.delete('/jobinfo/:userId',authenticate,deleteJobInfoController);

// Fetch user preferences
router.get("/preferences", authenticate, getPreferences);

// Update user preferences
router.put("/preferences", authenticate, updatePreferences);

export default router; // Use default export