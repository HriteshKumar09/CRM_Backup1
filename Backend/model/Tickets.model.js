import db from "../config/db.js";  // Import MySQL connection

// Function to create a new ticket
export const createTicket = (ticketData) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO _tickets (client_id, project_id, ticket_type_id, title, 
            created_by, requested_by, created_at, status, last_activity_at, assigned_to, 
            creator_name, creator_email, labels, task_id, closed_at, merged_with_ticket_id, deleted)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
        `;
        const values = [
            ticketData.client_id,
            ticketData.project_id,
            ticketData.ticket_type_id,
            ticketData.title,
            ticketData.created_by,
            ticketData.requested_by,
            ticketData.created_at,
            ticketData.status,
            ticketData.last_activity_at,
            ticketData.assigned_to,
            ticketData.creator_name,
            ticketData.creator_email,
            ticketData.labels,
            ticketData.task_id,
            ticketData.closed_at || new Date(),
            ticketData.merged_with_ticket_id,
            ticketData.deleted,
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ Error creating ticket:", err);
                return reject({ message: "Database error", error: err });
            }
            resolve({ success: true, message: "Ticket created successfully", ticketId: result.insertId });
        });
    });
};


// Function to fetch all tickets
export const getAllTickets = () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM _tickets WHERE deleted = 0";  // Ensure only non-deleted tickets are fetched
        db.query(query, (err, result) => {
            if (err) {
                console.error("❌ Error fetching tickets:", err);
                return reject({ message: "Database error", error: err });
            }

            resolve({ success: true, tickets: result });  // Return the tickets from the database
        });
    });
};

// Function to get a ticket by ID
export const getTicketById = (ticketId) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM _tickets WHERE id = ? AND deleted = 0";  // Ensure deleted flag is 0
        db.query(query, [ticketId], (err, result) => {
            if (err) {
                console.error("❌ Error fetching ticket:", err);
                return reject({ message: "Database error", error: err });
            }

            if (result.length === 0) {
                return reject({ message: "Ticket not found or deleted" });
            }

            resolve({ success: true, ticket: result[0] });
        });
    });
};

// Function to update ticket status (e.g., from 'new' to 'open' or 'closed')
export const updateTicketStatus = (ticketId, status) => {
    return new Promise((resolve, reject) => {
        const query = "UPDATE _tickets SET status = ?, last_activity_at = ? WHERE id = ?";
        const values = [status, new Date(), ticketId];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ Error updating ticket status:", err);
                return reject({ message: "Database error", error: err });
            }

            if (result.affectedRows === 0) {
                return reject({ message: "Ticket not found or status update failed" });
            }

            resolve({ success: true, message: "Ticket status updated successfully" });
        });
    });
};

// Function to assign a ticket to an admin/employee
export const assignTicket = (ticketId, assignedTo) => {
    return new Promise((resolve, reject) => {
        const query = "UPDATE _tickets SET assigned_to = ?, last_activity_at = ? WHERE id = ?";
        const values = [assignedTo, new Date(), ticketId];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ Error assigning ticket:", err);
                return reject({ message: "Database error", error: err });
            }

            if (result.affectedRows === 0) {
                return reject({ message: "Ticket not found or assignment failed" });
            }

            resolve({ success: true, message: "Ticket assigned successfully" });
        });
    });
};

// Function to delete a ticket (soft delete by setting 'deleted' to 1)
export const deleteTicket = (ticketId) => {
    return new Promise((resolve, reject) => {
        const query = "UPDATE _tickets SET deleted = 1 WHERE id = ?";
        const values = [ticketId];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ Error deleting ticket:", err);
                return reject({ message: "Database error", error: err });
            }

            if (result.affectedRows === 0) {
                return reject({ message: "Ticket not found or failed to delete" });
            }

            resolve({ success: true, message: "Ticket deleted successfully" });
        });
    });
};


// Function to edit ticket details dynamically based on provided fields
export const editTicket = (ticketId, updatedData) => {
    return new Promise((resolve, reject) => {
        // Prepare query and values dynamically
        let setClause = [];
        let values = [];

        // Check which fields are provided in the request body and add them to the query
        if (updatedData.title) {
            setClause.push("title = ?");
            values.push(updatedData.title);
        }
        if (updatedData.status) {
            setClause.push("status = ?");
            values.push(updatedData.status);
        }
        if (updatedData.assigned_to !== undefined) {
            setClause.push("assigned_to = ?");
            values.push(updatedData.assigned_to);
        }
        if (updatedData.labels) {
            setClause.push("labels = ?");
            values.push(updatedData.labels);
        }

        // Always update 'last_activity_at' field (this is assumed to always be updated)
        setClause.push("last_activity_at = ?");
        values.push(new Date()); // Set 'last_activity_at' to the current date and time

        // Add the ticket ID to the 'WHERE' clause
        values.push(ticketId);

        // Build the SQL query
        const query = `UPDATE _tickets SET ${setClause.join(", ")} WHERE id = ?`;

        // Execute the query with the dynamically generated values
        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ Error editing ticket:", err);
                return reject({ message: "Database error", error: err });
            }

            if (result.affectedRows === 0) {
                return reject({ message: "Ticket not found or edit failed" });
            }

            resolve({ success: true, message: "Ticket updated successfully" });
        });
    });
};



// Function to mark a ticket as closed
export const closeTicket = (ticketId) => {
    return new Promise((resolve, reject) => {
        const query = "UPDATE _tickets SET status = 'closed', closed_at = ?, last_activity_at = ? WHERE id = ?";
        const values = [new Date(), new Date(), ticketId];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ Error closing ticket:", err);
                return reject({ message: "Database error", error: err });
            }

            if (result.affectedRows === 0) {
                return reject({ message: "Ticket not found or failed to close" });
            }

            resolve({ success: true, message: "Ticket marked as closed" });
        });
    });
};


{/*Ticket Comments */}
// Function to add a comment to a ticket
export const addComment = (commentData) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO _ticket_comments (created_by, created_at, description, ticket_id, files, is_note, deleted)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            commentData.created_by,
            commentData.created_at,
            commentData.description,
            commentData.ticket_id,
            commentData.files || null,
            commentData.is_note || 0,
            commentData.deleted || 0
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ Error adding comment:", err);
                return reject({ message: "Database error", error: err });
            }

            resolve({ success: true, message: "Comment added successfully", commentId: result.insertId });
        });
    });
};

// Function to get all comments related to a ticket
export const getCommentsByTicketId = (ticketId) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM _ticket_comments WHERE ticket_id = ? AND deleted = 0"; // Ensure not deleted
        db.query(query, [ticketId], (err, result) => {
            if (err) {
                console.error("❌ Error fetching comments:", err);
                return reject({ message: "Database error", error: err });
            }

            resolve({ success: true, comments: result });
        });
    });
};


{/*Ticket Templates */}
// Function to create a new ticket template
export const createTemplate = (templateData) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO _ticket_templates (title, description, ticket_type_id, private, created_by, created_at, deleted)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            templateData.title,
            templateData.description,
            templateData.ticket_type_id,
            templateData.private,
            templateData.created_by,
            new Date(),
            templateData.deleted || 0
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ Error creating template:", err);
                return reject({ message: "Database error", error: err });
            }

            resolve({ success: true, message: "Template created successfully", templateId: result.insertId });
        });
    });
};

// Function to get all ticket templates
export const getAllTemplates = () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM _ticket_templates WHERE deleted = 0"; // Ensure templates are not deleted
        db.query(query, (err, result) => {
            if (err) {
                console.error("❌ Error fetching templates:", err);
                return reject({ message: "Database error", error: err });
            }

            resolve({ success: true, templates: result });
        });
    });
};


{/*Ticket Types */}
// Function to get all ticket types
export const getAllTicketTypes = () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM _ticket_types WHERE deleted = 0"; // Ensure ticket types are not deleted
        db.query(query, (err, result) => {
            if (err) {
                console.error("❌ Error fetching ticket types:", err);
                return reject({ message: "Database error", error: err });
            }

            resolve({ success: true, ticketTypes: result });
        });
    });
};
