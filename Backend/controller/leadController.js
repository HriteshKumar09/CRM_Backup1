// import {
//     createLead,
//     getAllLeads,
//     getLeadById,
//     updateLead,
//     deleteLead
// } from "../model/leadModel.js";

import { createLead, deleteLead, getAllLeads, getLeadById, updateLead } from "../model/leadModel.js";

// Create a new lead
export const addLead = async (req, res) => {
    try {
        const newLead = await createLead(req.body);
        res.status(201).json({ success: true, message: "Lead created successfully", lead: newLead });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating lead", error: error.message });
    }
};

// Get all leads
export const fetchLeads = async (req, res) => {
    try {
        const leads = await getAllLeads();
        res.status(200).json({ success: true, leads });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching leads", error: error.message });
    }
};

// Get lead by ID
export const fetchLeadById = async (req, res) => {
    try {
        const lead = await getLeadById(req.params.id);
        if (!lead) {
            return res.status(404).json({ success: false, message: "Lead not found" });
        }
        res.status(200).json({ success: true, lead });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching lead", error: error.message });
    }
};

// Update lead details
export const updateLeadDetails = async (req, res) => {
    try {
        const updatedLead = await updateLead(req.params.id, req.body);
        if (updatedLead.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Lead not found" });
        }
        res.status(200).json({ success: true, message: "Lead updated successfully", updatedLead });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating lead", error: error.message });
    }
};

// Soft delete a lead
export const removeLead = async (req, res) => {
    try {
        const result = await deleteLead(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Lead not found" });
        }
        res.status(200).json({ success: true, message: "Lead deleted successfully", result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting lead", error: error.message });
    }
};
