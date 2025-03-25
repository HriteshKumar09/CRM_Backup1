import express from 'express';
import { fetchTaxesController, createTaxController } from '../controller/taxes.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = express.Router();

// Route to fetch taxes (this will be prefixed with /api due to app.use in index.js)
router.get('/taxes', authenticate, fetchTaxesController);  // This will be available at /api/taxes

// Route to create a new tax
router.post('/taxes', authenticate, authorizeRoles('admin'), createTaxController);

export default router;
