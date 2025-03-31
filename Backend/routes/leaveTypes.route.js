import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import {
  fetchLeaveTypesController,
  createLeaveTypeController,
  updateLeaveTypeController,
  deleteLeaveTypeController
} from '../controller/leaveTypes.controller.js';

const router = express.Router();

// Get all leave types
router.get('/', authenticate, fetchLeaveTypesController);

// Create a new leave type (admin only)
router.post('/', authenticate, createLeaveTypeController);

// Update a leave type (admin only)
router.put('/:id', authenticate, updateLeaveTypeController);

// Delete a leave type (admin only)
router.delete('/:id', authenticate, deleteLeaveTypeController);

export default router; 