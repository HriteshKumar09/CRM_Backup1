import express from 'express';
import { getBlockedIPsController, removeFromBlacklistController } from '../controller/blockedIPs.controller.js';

const router = express.Router();

// Route to get all blocked IPs
router.get('/', getBlockedIPsController);

// Route to remove IP from blacklist
router.delete('/:ipAddress', removeFromBlacklistController);

export default router; 