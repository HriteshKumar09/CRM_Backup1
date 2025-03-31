import { 
    createTicket, 
    getTicketById, 
    updateTicketStatus, 
    assignTicket, 
    deleteTicket, 
    editTicket, 
    closeTicket, 
    addComment,
    getCommentsByTicketId,
    createTemplate,
    getAllTemplates,
    getAllTicketTypes,
    createTicketType,
    updateTicketType,
    deleteTicketType,
    getProjectsByClientId
} from "../model/Tickets.model.js"; // Import the model functions

// ✅ **Create a new ticket**
export const createTicketController = async (req, res) => {
    try {
        const ticketData = req.body; // Get ticket data from the request body

        const result = await createTicket(ticketData); // Call model function to create the ticket
        res.status(201).json({ 
            success: true, 
            message: result.message, 
            ticketId: result.ticketId 
        });
    } catch (error) {
        console.error("❌ Error creating ticket:", error);
        res.status(500).json({ message: "Failed to create ticket", error: error.message });
    }
};

// ✅ **Get ticket by ID**
export const getTicketController = async (req, res) => {
    try {
        const ticketId = req.params.ticketId; // Get the ticket ID from the URL parameter

        const result = await getTicketById(ticketId); // Fetch ticket details from the model
        res.status(200).json({ 
            success: true, 
            ticket: result.ticket 
        });
    } catch (error) {
        console.error("❌ Error fetching ticket:", error);
        res.status(500).json({ message: "Failed to fetch ticket", error: error.message });
    }
};

import { getAllTickets } from "../model/Tickets.model.js"; // Import the model function

// ✅ **Get all tickets**
export const getAllTicketsController = async (req, res) => {
    try {
        const result = await getAllTickets();  // Fetch tickets using the model function
        res.status(200).json({ 
            success: true, 
            tickets: result.tickets  // Send the tickets in the response
        });
    } catch (error) {
        console.error("❌ Error fetching tickets:", error);
        res.status(500).json({ message: "Failed to fetch tickets", error: error.message });
    }
};


// ✅ **Update ticket status**
export const updateTicketStatusController = async (req, res) => {
    try {
        const ticketId = req.params.ticketId; // Get the ticket ID from the URL parameter
        const { status } = req.body; // Get the new status from the request body

        const result = await updateTicketStatus(ticketId, status); // Update ticket status in the model
        res.status(200).json({ 
            success: true, 
            message: result.message 
        });
    } catch (error) {
        console.error("❌ Error updating ticket status:", error);
        res.status(500).json({ message: "Failed to update ticket status", error: error.message });
    }
};

// ✅ **Assign ticket to a user**
export const assignTicketController = async (req, res) => {
    try {
        const ticketId = req.params.ticketId; // Get the ticket ID from the URL parameter
        const { assignedTo } = req.body; // Get the assigned user from the request body

        const result = await assignTicket(ticketId, assignedTo); // Assign ticket to the user in the model
        res.status(200).json({ 
            success: true, 
            message: result.message 
        });
    } catch (error) {
        console.error("❌ Error assigning ticket:", error);
        res.status(500).json({ message: "Failed to assign ticket", error: error.message });
    }
};

// ✅ **Soft delete a ticket**
export const deleteTicketController = async (req, res) => {
    try {
        const ticketId = req.params.ticketId; // Get the ticket ID from the URL parameter

        const result = await deleteTicket(ticketId); // Delete ticket by setting 'deleted' to 1 in the model
        res.status(200).json({ 
            success: true, 
            message: result.message 
        });
    } catch (error) {
        console.error("❌ Error deleting ticket:", error);
        res.status(500).json({ message: "Failed to delete ticket", error: error.message });
    }
};


// ✅ **Edit ticket details dynamically**
export const editTicketController = async (req, res) => {
    try {
        const ticketId = req.params.ticketId; // Get the ticket ID from the URL parameter
        const updatedData = req.body; // Get the updated data from the request body

        // Ensure only valid fields are passed to the model
        const result = await editTicket(ticketId, updatedData); // Edit ticket in the model
        res.status(200).json({ 
            success: true, 
            message: result.message 
        });
    } catch (error) {
        console.error("❌ Error editing ticket:", error);
        res.status(500).json({ message: "Failed to edit ticket", error: error.message });
    }
};


// ✅ **Close ticket**
export const closeTicketController = async (req, res) => {
    try {
        const ticketId = req.params.ticketId; // Get the ticket ID from the URL parameter

        const result = await closeTicket(ticketId); // Close the ticket in the model
        res.status(200).json({ 
            success: true, 
            message: result.message 
        });
    } catch (error) {
        console.error("❌ Error closing ticket:", error);
        res.status(500).json({ message: "Failed to close ticket", error: error.message });
    }
};

{/*Tickeets Comments*/}
// ✅ **Add a comment to a ticket**
export const addCommentController = async (req, res) => {
    try {
        const commentData = req.body; // Get the comment data from the request body
        commentData.created_at = new Date(); // Ensure timestamp is set

        const result = await addComment(commentData); // Call the model function to add a comment
        res.status(201).json({ 
            success: true, 
            message: result.message, 
            commentId: result.commentId 
        });
    } catch (error) {
        console.error("❌ Error adding comment:", error);
        res.status(500).json({ message: "Failed to add comment", error: error.message });
    }
};

// ✅ **Get all comments for a specific ticket**
export const getCommentsController = async (req, res) => {
    try {
        const ticketId = req.params.ticketId; // Get the ticket ID from the URL parameter

        const result = await getCommentsByTicketId(ticketId); // Fetch comments from the model
        res.status(200).json({ 
            success: true, 
            comments: result.comments 
        });
    } catch (error) {
        console.error("❌ Error fetching comments:", error);
        res.status(500).json({ message: "Failed to fetch comments", error: error.message });
    }
};

{/*Ticket Templates*/}
// ✅ **Create a new ticket template**
export const createTemplateController = async (req, res) => {
    try {
        const templateData = req.body; // Get template data from the request body

        const result = await createTemplate(templateData); // Create the template via the model
        res.status(201).json({ 
            success: true, 
            message: result.message, 
            templateId: result.templateId 
        });
    } catch (error) {
        console.error("❌ Error creating template:", error);
        res.status(500).json({ message: "Failed to create template", error: error.message });
    }
};

// ✅ **Get all ticket templates**
export const getTemplatesController = async (req, res) => {
    try {
        const result = await getAllTemplates(); // Fetch all templates via the model
        res.status(200).json({ 
            success: true, 
            templates: result.templates 
        });
    } catch (error) {
        console.error("❌ Error fetching templates:", error);
        res.status(500).json({ message: "Failed to fetch templates", error: error.message });
    }
};

{/*Ticket Types*/}
// Get all ticket types
export const getTicketTypesController = async (req, res) => {
    try {
        const result = await getAllTicketTypes();
        res.status(200).json({ 
            success: true, 
            data: result.ticketTypes
        });
    } catch (error) {
        console.error("❌ Error fetching ticket types:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch ticket types", 
            error: error.message 
        });
    }
};

// Create a new ticket type
export const createTicketTypeController = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const result = await createTicketType({ title });
        res.status(201).json({
            success: true,
            message: "Ticket type created successfully",
            data: result.ticketType
        });
    } catch (error) {
        console.error("❌ Error creating ticket type:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create ticket type",
            error: error.message
        });
    }
};

// Update a ticket type
export const updateTicketTypeController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const result = await updateTicketType(id, { title });
        res.status(200).json({
            success: true,
            message: "Ticket type updated successfully",
            data: result.ticketType
        });
    } catch (error) {
        console.error("❌ Error updating ticket type:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update ticket type",
            error: error.message
        });
    }
};

// Delete a ticket type
export const deleteTicketTypeController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteTicketType(id);
        res.status(200).json({
            success: true,
            message: "Ticket type deleted successfully"
        });
    } catch (error) {
        console.error("❌ Error deleting ticket type:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete ticket type",
            error: error.message
        });
    }
};

// Add new controller for getting projects by client ID
export const getProjectsByClientIdController = async (req, res) => {
    try {
        const { clientId } = req.params;

        if (!clientId) {
            return res.status(400).json({ 
                success: false, 
                message: "Client ID is required" 
            });
        }

        const result = await getProjectsByClientId(clientId);
        return res.status(200).json({ 
            success: true, 
            projects: result.projects 
        });
    } catch (error) {
        console.error("❌ Error fetching projects:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch projects", 
            error: error.message 
        });
    }
};
