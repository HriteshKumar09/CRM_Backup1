import express from 'express';
import { fetchTaxesController } from '../controller/taxes.controller.js'; // Use the correct controller

const router = express.Router();

// Route to fetch taxes (this will be prefixed with /api due to app.use in index.js)
router.get('/taxes', fetchTaxesController);  // This will be available at /api/taxes

export default router;
