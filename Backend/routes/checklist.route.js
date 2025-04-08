import express from 'express';
import {
  getTaskChecklistItemsController,
  addChecklistItemController,
  updateChecklistItemController,
  deleteChecklistItemController,
  getChecklistTemplatesController,
  addChecklistTemplateController,
  getChecklistGroupsController,
  addChecklistGroupController,
  updateChecklistGroupController,
  deleteChecklistGroupController
} from '../controller/checklistController.js';

const router = express.Router();

// Checklist items routes
router.get('/task/:taskId/items', getTaskChecklistItemsController);
router.post('/task/:taskId/items', addChecklistItemController);
router.put('/items/:itemId', updateChecklistItemController);
router.delete('/items/:itemId', deleteChecklistItemController);

// Checklist templates routes
router.get('/templates', getChecklistTemplatesController);
router.post('/templates', addChecklistTemplateController);

// Checklist groups routes
router.get('/groups', getChecklistGroupsController);
router.post('/groups', addChecklistGroupController);
router.put('/groups/:groupId', updateChecklistGroupController);
router.delete('/groups/:groupId', deleteChecklistGroupController);

export default router; 