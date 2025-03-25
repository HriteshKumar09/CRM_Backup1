// import {
//     createLead,
//     getAllLeads,
//     getLeadById,
//     updateLead,
//     deleteLead
// } from "../model/leadModel.js";

import {
    createLead, deleteLead, getAllLeads, getLeadById, updateLead,
    createLeadSource, getAllLeadSources, updateLeadSource, deleteLeadSource,
    createLeadStatus, getAllLeadStatuses, updateLeadStatus, deleteLeadStatus
} from "../model/leadModel.js";

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

// Lead Source Controllers
export const addLeadSource = async (req, res) => {
    try {
        const newSource = await createLeadSource(req.body);
        res.status(201).json({ 
            success: true, 
            message: "Lead source created successfully", 
            source: newSource 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error creating lead source", 
            error: error.message 
        });
    }
};

export const fetchLeadSources = async (req, res) => {
    try {
        const sources = await getAllLeadSources();
        res.status(200).json({ 
            success: true, 
            sources: sources.data 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error fetching lead sources", 
            error: error.message 
        });
    }
};

export const updateLeadSourceDetails = async (req, res) => {
    try {
        const updatedSource = await updateLeadSource(req.params.id, req.body);
        if (updatedSource.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Lead source not found" 
            });
        }
        res.status(200).json({ 
            success: true, 
            message: "Lead source updated successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error updating lead source", 
            error: error.message 
        });
    }
};

export const removeLeadSource = async (req, res) => {
    try {
        const result = await deleteLeadSource(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Lead source not found" 
            });
        }
        res.status(200).json({ 
            success: true, 
            message: "Lead source deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error deleting lead source", 
            error: error.message 
        });
    }
};

// Lead Status Controllers
export const addLeadStatus = async (req, res) => {
    try {
        const newStatus = await createLeadStatus(req.body);
        res.status(201).json({ 
            success: true, 
            message: "Lead status created successfully", 
            status: newStatus 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error creating lead status", 
            error: error.message 
        });
    }
};

export const fetchLeadStatuses = async (req, res) => {
    try {
        const statuses = await getAllLeadStatuses();
        res.status(200).json({ 
            success: true, 
            statuses: statuses.data 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error fetching lead statuses", 
            error: error.message 
        });
    }
};

export const updateLeadStatusDetails = async (req, res) => {
    try {
        const updatedStatus = await updateLeadStatus(req.params.id, req.body);
        if (updatedStatus.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Lead status not found" 
            });
        }
        res.status(200).json({ 
            success: true, 
            message: "Lead status updated successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error updating lead status", 
            error: error.message 
        });
    }
};

export const removeLeadStatus = async (req, res) => {
    try {
        const result = await deleteLeadStatus(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Lead status not found" 
            });
        }
        res.status(200).json({ 
            success: true, 
            message: "Lead status deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error deleting lead status", 
            error: error.message 
        });
    }
};
