import express from 'express';
import { createTaskController, deleteTaskController, getTaskByIdController, getTasksByClientIdController, getTasksController, updateTaskController } from '../controller/taskController.js';


const router = express.Router();

// Create a task
router.post('/', createTaskController);

// Get all tasks
router.get('/', getTasksController);

// Get task by ID
router.get('/:id', getTaskByIdController);

// ✅ Get tasks related to a client's projects
router.get('/client/:clientId', getTasksByClientIdController);

// Update task
router.put('/:id', updateTaskController);

// Soft delete task
router.delete('/:id', deleteTaskController);

export default router;
