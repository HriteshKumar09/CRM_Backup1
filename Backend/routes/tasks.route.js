import express from 'express';
import { 
  createTaskController, 
  deleteTaskController, 
  getTaskByIdController, 
  getTasksByClientIdController, 
  getTasksController, 
  updateTaskController,
  getTaskCommentsController,
  addCommentController,
  getTaskTimeController,
  getAllTaskPrioritiesController,
  getTaskPriorityByIdController,
  getAllTaskStatusesController,
  getTaskStatusByIdController
} from '../controller/taskController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Create a task
router.post('/', authenticate, createTaskController);

// Get all tasks
router.get('/', authenticate, getTasksController);

// Get task by ID
router.get('/:id', authenticate, getTaskByIdController);

// Get tasks by client ID
router.get('/client/:clientId', authenticate, getTasksByClientIdController);

// Update task
router.put('/:id', authenticate, updateTaskController);

// Delete task
router.delete('/:id', authenticate, deleteTaskController);

// Get task comments
router.get('/:taskId/comments', authenticate, getTaskCommentsController);

// Add comment to task
router.post('/:taskId/comments', authenticate, addCommentController);

// Get task time
router.get('/:taskId/time', authenticate, getTaskTimeController);

// Task Priority Routes
router.get('/task-priorities', authenticate, getAllTaskPrioritiesController);
router.get('/task-priorities/:id', authenticate, getTaskPriorityByIdController);

// Task Status Routes
router.get('/task-statuses', authenticate, getAllTaskStatusesController);
router.get('/task-statuses/:id', authenticate, getTaskStatusByIdController);

export default router;
