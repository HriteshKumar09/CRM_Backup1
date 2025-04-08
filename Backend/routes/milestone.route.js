import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  createMilestoneController,
  getMilestonesByProjectController,
  getMilestoneController,
  updateMilestoneController,
  deleteMilestoneController
} from '../controller/milestone.controller.js';

const router = express.Router();

// Create a new milestone
router.post('/milestones', authenticate, createMilestoneController);

// Get all milestones for a project
router.get('/milestones/project/:projectId', authenticate, getMilestonesByProjectController);

// Get a single milestone
router.get('/milestones/:id', authenticate, getMilestoneController);

// Update a milestone
router.put('/milestones/:id', authenticate, updateMilestoneController);

// Delete a milestone
router.delete('/milestones/:id', authenticate, deleteMilestoneController);

export default router; 