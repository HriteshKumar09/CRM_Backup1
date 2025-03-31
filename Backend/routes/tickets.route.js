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
    createTicketTypeController,
    updateTicketTypeController,
    deleteTicketTypeController,
    getAllTicketsController,
    getProjectsByClientIdController
} from "../controller/Tickets.controller.js";
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = express.Router();

// Ticket Routes
router.post("/tickets", createTicketController);               
router.get("/tickets", getAllTicketsController);  
router.get("/tickets/:ticketId", getTicketController);         
router.put("/tickets/:ticketId/status", updateTicketStatusController); 
router.put("/tickets/:ticketId/assign", assignTicketController);  
router.delete("/tickets/:ticketId", deleteTicketController);  
router.put("/tickets/:ticketId", editTicketController);       
router.put("/tickets/:ticketId/close", closeTicketController); 

// Ticket Comments Routes
router.post("/tickets/:ticketId/comments", addCommentController);   
router.get("/tickets/:ticketId/comments", getCommentsController);   

// Ticket Templates Routes
router.post("/ticket-templates", createTemplateController); 
router.get("/ticket-templates", getTemplatesController);    

// Ticket Types Routes
router.get("/ticket-types", authenticate, getTicketTypesController);            // Get all ticket types
router.post("/ticket-types", authenticate, createTicketTypeController);       // Create new ticket type
router.put("/ticket-types/:id", authenticate, updateTicketTypeController);     // Update ticket type
router.delete("/ticket-types/:id", authenticate, deleteTicketTypeController);  // Delete ticket type

// Add new route for getting projects by client ID
router.get("/client/:clientId/projects", getProjectsByClientIdController);

export default router;
