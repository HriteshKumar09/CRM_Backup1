import express from 'express';
// import { applyForLeave, approveLeaveApplication, rejectLeaveApplication, getLeaveApplications } from '../controllers/leave.controller.js';
import { authenticate } from "../middleware/authenticate.js"; // Authentication Middleware
import { authorizeRoles } from "../middleware/authorizeRoles.js"; // Role-Based Middleware
import { applyForLeave, approveLeaveApplication, getLeaveApplications, rejectLeaveApplication } from '../controller/team.controller.js';

const router = express.Router();

// Route to apply for leave (only available for employees)
router.post('/apply',authenticate, applyForLeave);

// Route to approve leave (only admins can approve leave)
router.put('/approve/:leaveId',authenticate, authorizeRoles('admin'), approveLeaveApplication);

// Route to reject leave (only admins can reject leave)
router.put('/reject/:leaveId',authenticate, authorizeRoles('admin'), rejectLeaveApplication);

// Route to fetch leave applications (admins can fetch all, employees can fetch their own)
router.get('/applications/:userId',authenticate, authorizeRoles('admin', 'staff'), getLeaveApplications);

export default router;
