import express from "express";
import {
    addLead,
    fetchLeads,
    fetchLeadById,
    updateLeadDetails,
    removeLead
} from "../controller/leadController.js";

const router = express.Router();

// Create a new lead
router.post("/leads", addLead);

// Get all leads
router.get("/leads", fetchLeads);

// Get a lead by ID
router.get("/leads/:id", fetchLeadById);

// Update lead details (general lead update)
router.put("/leads/:id", updateLeadDetails);

// Soft delete a lead
router.delete("/leads/:id", removeLead);

export default router;
