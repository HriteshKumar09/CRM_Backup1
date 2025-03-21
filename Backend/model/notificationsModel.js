import db from '../config/db.js';

// Helper function to get current date-time for MySQL
const getCurrentDateTime = () => {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
};

// 1. Fetch Notifications (✅ safe & correct)
export const fetchNotifications = (user_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM _notifications 
            WHERE FIND_IN_SET(?, notify_to) > 0 
            AND deleted = 0 
            ORDER BY created_at DESC`;

        db.query(query, [user_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// 2. Create Notification (✅ auto-handles created_at & safe fields)
export const addNotification = (data) => {
    return new Promise((resolve, reject) => {
        const notificationData = {
            user_id: data.user_id || 0,                       // default to 0 if missing
            description: data.description || '',
            notify_to: data.notify_to || '',
            read_by: data.read_by || '',
            event: data.event || '',
            project_id: data.project_id || 0,
            task_id: data.task_id || 0,
            project_comment_id: data.project_comment_id || 0,
            ticket_id: data.ticket_id || 0,
            ticket_comment_id: data.ticket_comment_id || 0,
            project_file_id: data.project_file_id || 0,
            leave_id: data.leave_id || 0,
            post_id: data.post_id || 0,
            to_user_id: data.to_user_id || 0,
            activity_log_id: data.activity_log_id || 0,
            client_id: data.client_id || 0,
            lead_id: data.lead_id || 0,
            invoice_payment_id: data.invoice_payment_id || 0,
            invoice_id: data.invoice_id || 0,
            estimate_id: data.estimate_id || 0,
            contract_id: data.contract_id || 0,
            order_id: data.order_id || 0,
            estimate_request_id: data.estimate_request_id || 0,
            actual_message_id: data.actual_message_id || 0,
            parent_message_id: data.parent_message_id || 0,
            event_id: data.event_id || 0,
            announcement_id: data.announcement_id || 0,
            proposal_id: data.proposal_id || 0,
            estimate_comment_id: data.estimate_comment_id || 0,
            subscription_id: data.subscription_id || 0,
            expense_id: data.expense_id || 0,
            plugin_zoom_meeting_id: data.plugin_zoom_meeting_id || 0,
            inventory_goods_receiving_id: data.inventory_goods_receiving_id || 0,
            inventory_goods_delivery_id: data.inventory_goods_delivery_id || 0,
            packing_list_id: data.packing_list_id || 0,
            internal_delivery_note_id: data.internal_delivery_note_id || 0,
            loss_adjustment_is: data.loss_adjustment_is || 0,
            receiving_exporting_return_order_id: data.receiving_exporting_return_order_id || 0,
            pur_request_id: data.pur_request_id || 0,
            pur_quotation_id: data.pur_quotation_id || 0,
            pur_order_id: data.pur_order_id || 0,
            pur_payment_id: data.pur_payment_id || 0,
            deleted: data.deleted || 0,
            created_at: getCurrentDateTime()  // auto set this
        };

        const query = `INSERT INTO _notifications SET ?`;
        db.query(query, [notificationData], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// 3. Mark Notification as Read (✅ safe & same)
export const markNotificationRead = (id, userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE _notifications 
            SET read_by = 
                CASE 
                    WHEN read_by = '' THEN ?
                    WHEN read_by IS NULL THEN ?
                    ELSE CONCAT(read_by, ',', ?)
                END
            WHERE id = ?`;

        db.query(query, [userId, userId, userId, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// 4. Delete Notification (✅ soft delete if needed)
export const deleteNotification = (notificationId, softDelete = true) => {
    return new Promise((resolve, reject) => {
        const query = softDelete 
            ? `UPDATE _notifications SET deleted = 1 WHERE id = ?`
            : `DELETE FROM _notifications WHERE id = ?`;

        db.query(query, [notificationId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
