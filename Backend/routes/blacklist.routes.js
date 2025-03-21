import express from 'express';
import { blockIPController, checkBlockedIPController } from '../controller/blacklist.controller.js';

const router = express.Router();

// Route to block an IP address
router.post('/block-ip', blockIPController);

// Route to check if an IP address is blocked
router.post('/check-blocked-ip', checkBlockedIPController);

export default router;
