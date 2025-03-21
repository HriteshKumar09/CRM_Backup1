import express from 'express';
import {
  createJobInfoController,
  getJobInfoController,
  updateJobInfoController,
  deleteJobInfoController
} from '../controller/team.controller.js';

const router = express.Router();

// Define job info routes
router.get('/:userId', getJobInfoController);  // Fetch job info by user ID
router.post('/', createJobInfoController);  // Create job info
router.put('/:userId', updateJobInfoController);  // Update job info by user ID
router.delete('/:userId', deleteJobInfoController);  // Delete job info by user ID

export default router;
