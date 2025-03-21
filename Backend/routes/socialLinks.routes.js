import express from 'express'; // Import express
const router = express.Router(); // Create an express router

import { 
  createSocialLinksController, 
  deleteSocialLinksController, 
  getSocialLinks, 
  updateSocialLinksController 
} from '../controller/team.controller.js'; // Import controller functions

import { authenticate } from '../middleware/authenticate.js';

// Routes for social links

// Get social links for a user by user ID (requires authentication)
router.get('/:id', authenticate, getSocialLinks); // Fetch social links by user ID

// Create social links for a user (requires authentication)
router.post('/', authenticate, createSocialLinksController); // Create new social links for a user

// Update social links for a user by user ID (requires authentication)
router.put('/:id', authenticate, updateSocialLinksController); // Update social links by user ID

// Delete social links for a user by user ID (requires authentication)
router.delete('/:id', authenticate, deleteSocialLinksController); // Delete social links for a user

export default router; // Export the router to be used in the main app