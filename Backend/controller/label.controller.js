import {
    getLabelsByContext,
    getLabelsByAdmin,
    createLabel,
    updateLabel,
    deleteLabel,
  } from "../model/label.model.js";
  

  /**
   * 🔹 Fetch labels based on context (For Users & Admins)
   */
  export const getLabels = async (req, res) => {
    try {
      const { context } = req.query;
      if (!context) return res.status(400).json({ success: false, message: "Context is required" });
      
      const labels = await getLabelsByContext(context);
      res.status(200).json({ success: true, labels });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching labels" });
    }
  };
  

  /**
   * 🔹 Fetch labels created by the admin (For Admins)
   */
  export const getAdminLabels = async (req, res) => {
    try {
      const adminId = req.user.id; // Admin ID from authentication
      const labels = await getLabelsByAdmin(adminId);
      res.status(200).json({ success: true, labels });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching labels" });
    }
  };
  

  /**
   * 🔹 Create a new label (Admin Only)
   */
  export const createNewLabel = async (req, res) => {
    try {
      const { title, color, context } = req.body;
      const adminId = req.user.id; // Admin ID from authentication
  
      if (!title || !color || !context) {
        return res.status(400).json({ success: false, message: "Title, color, and context are required" });
      }
  
      const labelId = await createLabel(title, color, context, adminId);
      res.status(201).json({ success: true, message: "Label created", labelId });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error creating label" });
    }
  };
  

  /**
   * 🔹 Update a label (Admin Only)
   */
  export const modifyLabel = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, color, context } = req.body;
  
      if (!title && !color && !context) {
        return res.status(400).json({ success: false, message: "At least one field is required for update" });
      }
  
      const updated = await updateLabel(id, title, color, context);
      res.status(200).json({ success: true, message: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error updating label" });
    }
  };
  
  
  /**
   * 🔹 Soft delete a label (Admin Only)
   */
  export const removeLabel = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleted = await deleteLabel(id);
      res.status(200).json({ success: true, message: deleted });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error deleting label" });
    }
  };
  