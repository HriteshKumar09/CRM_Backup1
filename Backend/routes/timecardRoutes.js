import express from 'express';
import { 
  clockIn, 
  clockOut, 
  getMyAttendance, 
  addNote, 
  updateAttendanceStatusByAdmin, 
  deleteAttendanceByAdmin 
} from '../controller/timecards.controller.js';

import { authenticate } from '../middleware/authenticate.js'; // Authentication Middleware
import { authorizeRoles } from '../middleware/authorizeRoles.js'; // Role-based Authorization Middleware

const router = express.Router();

// Route for clocking in (available for both Admin and User)
router.post('/clock-in', authenticate, clockIn);

// Route for clocking out (available for both Admin and User)
router.post('/clock-out', authenticate, clockOut);

// Route to get the attendance (timecard) of the logged-in user
router.get('/my-timecard', authenticate, getMyAttendance);

// Route for adding notes to attendance (can be added by Admin or user for their own record)
router.post('/add-note/:attendanceId', authenticate, addNote);

// Admin can update the status (approve/reject) of any timecard
router.put('/update-status', authenticate, authorizeRoles('admin'), updateAttendanceStatusByAdmin);

// Admin can delete any attendance record (soft delete)
router.delete('/delete/:attendanceId', authenticate, authorizeRoles('admin'), deleteAttendanceByAdmin);

export default router;
