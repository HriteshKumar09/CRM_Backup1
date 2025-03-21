import express from 'express';
import { 
    getNotifications, 
    createNotification, 
    markAsRead, 
    removeNotification 
} from '../controller/notificationsController.js';

const router = express.Router();

// Fetch Notifications
router.get('/:user_id', (req, res, next) => {
    console.log("🔍 Fetch Notifications called with user_id:", req.params.user_id);  // Log user_id
    next();  // Call the actual controller
}, getNotifications);

// Create Notification
router.post('/', (req, res, next) => {
    console.log("🔍 Create Notification called with data:", req.body);  // Log the body data coming in
    next();  // Call the actual controller
}, createNotification);

// Mark Notification as Read
router.patch('/:id', (req, res, next) => {
    console.log("🔍 Mark Notification as Read called with id:", req.params.id);  // Log the notification ID
    console.log("🔍 Data to mark as read:", req.body);  // Log the body data for userId
    next();  // Call the actual controller
}, markAsRead);

// Delete Notification
router.delete('/:id', (req, res, next) => {
    console.log("🔍 Delete Notification called with id:", req.params.id);  // Log the notification ID
    next();  // Call the actual controller
}, removeNotification);

export default router;
