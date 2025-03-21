import express from 'express';
import { 
    getGeneralSettingsController, 
    updateSettingsController, 
    uploadFileController 
} from '../controller/settings.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = express.Router();

// Get general settings
router.get('/general', authenticate, getGeneralSettingsController);

// Update settings
router.post('/general', authenticate, authorizeRoles('admin'), updateSettingsController);

// Upload file (logo, favicon, background)
router.post('/upload', authenticate, authorizeRoles('admin'), uploadFileController);

export default router; 