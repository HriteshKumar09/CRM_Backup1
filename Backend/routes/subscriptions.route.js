import express from 'express';
import {
  createSubscriptionController,
  getSubscriptionsController,
  getSubscriptionByIdController,
  updateSubscriptionController,
  deleteSubscriptionController,
  getSubscriptionItemsController,
  addSubscriptionItemController,
  updateSubscriptionItemController,
  deleteSubscriptionItemController
} from '../controller/subscriptionController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Subscription items routes
router.get('/:subscriptionId/items', authenticate, getSubscriptionItemsController);
router.post('/:subscriptionId/items', authenticate, addSubscriptionItemController);
router.put('/items/:itemId', authenticate, updateSubscriptionItemController);
router.delete('/items/:itemId', authenticate, deleteSubscriptionItemController);

// Subscription routes
router.post('/', authenticate, createSubscriptionController);
router.get('/', authenticate, getSubscriptionsController);
router.get('/:id', authenticate, getSubscriptionByIdController);
router.put('/:id', authenticate, updateSubscriptionController);
router.delete('/:id', authenticate, deleteSubscriptionController);



export default router; 