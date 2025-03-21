import { addNotification, deleteNotification, fetchNotifications, markNotificationRead } from "../model/notificationsModel.js";

// Fetch Notifications for a User
export const getNotifications = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const notifications = await fetchNotifications(user_id);
        res.status(200).json({ success: true, data: notifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
};

// // Create a New Notification
// export const createNotification = async (req, res) => {
//     const data = req.body;
//     const { notify_to, description, event, leave_id } = data;

//     if (!notify_to || !description || !event || !leave_id) {
//         return res.status(400).json({ success: false, message: 'Missing required fields' });
//     }

//     try {
//         const result = await addNotification(data);
//         res.status(201).json({ success: true, message: 'Notification added successfully', result });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: 'Failed to create notification' });
//     }
// };


// Create a New Notification
export const createNotification = async (data) => {
    const { user_id, description, notify_to, event, leave_id } = data;

    console.log("🔍 Notification Data to be Inserted:", data);

    if (!user_id || !description || !notify_to || !event || !leave_id) {
        return { success: false, message: 'Missing required fields for notification' };
    }

    try {
        const result = await addNotification(data);
        return result;
    } catch (err) {
        console.error("Error creating notification:", err);
        throw new Error("Failed to create notification");
    }
};

// Mark Notification as Read
export const markAsRead = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required to mark as read' });
    }

    try {
        const result = await markNotificationRead(id, userId);
        res.status(200).json({ success: true, message: 'Notification marked as read', result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
    }
};

// Remove (Soft Delete) a Notification
export const removeNotification = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await deleteNotification(id);
        res.status(200).json({ success: true, message: 'Notification deleted successfully', result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to delete notification' });
    }
};

// Notify Employee when their leave is approved
export const notifyEmployeeLeaveApproval = async (employeeId, leaveDetails) => {
    const message = `Your leave request from ${leaveDetails.start_date} to ${leaveDetails.end_date} has been approved.`;
    try {
        await addNotification({
            user_id: employeeId,
            description: message,
            notify_to: employeeId,
            event: 'Leave Approval',
            leave_id: leaveDetails.id,
        });
    } catch (err) {
        console.error("Error notifying employee:", err);
    }
};

// Notify Admin when they approve an employee's leave
export const notifyAdminLeaveApproval = async (adminId, employeeId, leaveDetails) => {
    const message = `You have approved the leave request for employee ${employeeId} from ${leaveDetails.start_date} to ${leaveDetails.end_date}.`;
    try {
        await addNotification({
            user_id: adminId,
            description: message,
            notify_to: adminId,
            event: 'Admin Leave Approval',
            leave_id: leaveDetails.id,
        });
    } catch (err) {
        console.error("Error notifying admin:", err);
    }
};
