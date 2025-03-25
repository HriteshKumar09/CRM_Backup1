import express from "express";
import {
    addLead,
    fetchLeads,
    fetchLeadById,
    updateLeadDetails,
    removeLead,
    addLeadSource,
    fetchLeadSources,
    updateLeadSourceDetails,
    removeLeadSource,
    addLeadStatus,
    fetchLeadStatuses,
    updateLeadStatusDetails,
    removeLeadStatus
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

// Lead Source routes
router.post("/lead-sources", addLeadSource);
router.get("/lead-sources", fetchLeadSources);
router.put("/lead-sources/:id", updateLeadSourceDetails);
router.delete("/lead-sources/:id", removeLeadSource);

// Lead Status routes
router.post("/lead-statuses", addLeadStatus);
router.get("/lead-statuses", fetchLeadStatuses);
router.put("/lead-statuses/:id", updateLeadStatusDetails);
router.delete("/lead-statuses/:id", removeLeadStatus);

export default router;
