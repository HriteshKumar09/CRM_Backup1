import { createLeaveRequest, getAllLeaves, updateLeaveStatus } from "../model/leaves.model.js";

// Controller to fetch all leave requests
export const fetchAllLeaves = async (req, res) => {
    try {
      const leaves = await getAllLeaves();
      res.status(200).json(leaves);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching leaves', error: error.message });
    }
  };


    // Controller to update leave request status
  export const updateLeave = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!status || !["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid or missing status" });
    }
  
    try {
      const result = await updateLeaveStatus(id, status);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Leave request not found" });
      }
      res.status(200).json({ message: "Leave status updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating leave status", error: error.message });
    }
  };
     
  // Controller to create a new leave request
  export const createLeave = async (req, res) => {
    const { applicant, leave_type, date, duration, status } = req.body;
  
    if (!applicant || !leave_type || !date || !duration) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      const result = await createLeaveRequest(applicant, leave_type, date, duration, status || "Pending");
      res.status(201).json({ message: "Leave request created successfully", leaveId: result.insertId });
    } catch (error) {
      res.status(500).json({ message: "Error creating leave request", error: error.message });
    }
  };
  
  