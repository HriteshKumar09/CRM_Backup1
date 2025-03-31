import express from 'express';
import { 
    getGeneralSettingsController, 
    updateSettingsController, 
    uploadFileController,
    getLocalizationSettingsController,
    updateLocalizationSettingsController,
    getEmailSettingsController,
    updateEmailSettingsController,
    sendTestEmailController
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

// Localization routes
router.get('/localization', authenticate, getLocalizationSettingsController);
router.post('/localization', authenticate, authorizeRoles('admin'), updateLocalizationSettingsController);

// Email settings routes
router.get('/email', authenticate, getEmailSettingsController);
router.put('/email', authenticate, authorizeRoles('admin'), updateEmailSettingsController);
router.post('/email/test', authenticate, authorizeRoles('admin'), sendTestEmailController);

export default router; 