import express from "express";
import { 
    createTicketController, 
    getTicketController, 
    updateTicketStatusController, 
    assignTicketController, 
    deleteTicketController, 
    editTicketController, 
    closeTicketController, 
    addCommentController,
    getCommentsController,
    createTemplateController,
    getTemplatesController,
    getTicketTypesController,
    getAllTicketsController
} from "../controller/Tickets.controller.js";

const router = express.Router();

// Ticket Routes
router.post("/tickets", createTicketController);               // Create a new ticket
router.get("/tickets", getAllTicketsController);  
router.get("/tickets/:ticketId", getTicketController);         // Get ticket by ID
router.put("/tickets/:ticketId/status", updateTicketStatusController); // Update ticket status
router.put("/tickets/:ticketId/assign", assignTicketController);  // Assign ticket to a user
router.delete("/tickets/:ticketId", deleteTicketController);  // Soft delete ticket
router.put("/tickets/:ticketId", editTicketController);       // Edit ticket details
router.put("/tickets/:ticketId/close", closeTicketController); // Close the ticket

// Ticket Comments Routes
router.post("/tickets/:ticketId/comments", addCommentController);   // Add comment to a ticket
router.get("/tickets/:ticketId/comments", getCommentsController);   // Get comments for a ticket

// Ticket Templates Routes
router.post("/ticket-templates", createTemplateController); // Create a new template
router.get("/ticket-templates", getTemplatesController);    // Get all ticket templates

// Ticket Types Routes
router.get("/ticket-types", getTicketTypesController);      // Get all ticket types

export default router;
