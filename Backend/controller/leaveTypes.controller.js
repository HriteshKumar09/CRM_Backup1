import {
  getLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType
} from '../model/leaveTypes.model.js';

// Fetch all leave types
export const fetchLeaveTypesController = async (req, res) => {
  try {
    console.log('Fetching leave types...'); // Debug log
    const leaveTypes = await getLeaveTypes();
    console.log('Leave types fetched:', leaveTypes); // Debug log
    res.json({
      success: true,
      data: leaveTypes
    });
  } catch (error) {
    console.error('❌ Error in fetchLeaveTypesController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave types',
      error: error.message
    });
  }
};

// Create a new leave type
export const createLeaveTypeController = async (req, res) => {
  try {
    const { title, status, color, description } = req.body;

    // Validate required fields
    if (!title || !color) {
      return res.status(400).json({
        success: false,
        message: 'Title and color are required'
      });
    }

    // Validate color format
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(color)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid color format. Must be a valid hex color (e.g., #FF0000)'
      });
    }

    console.log('Creating leave type with data:', req.body); // Debug log

    const leaveType = await createLeaveType({
      title,
      status: status || 'active',
      color,
      description
    });

    console.log('Leave type created:', leaveType); // Debug log

    res.status(201).json({
      success: true,
      message: 'Leave type created successfully',
      data: leaveType
    });
  } catch (error) {
    console.error('❌ Error in createLeaveTypeController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create leave type',
      error: error.message
    });
  }
};

// Update a leave type
export const updateLeaveTypeController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, color, description } = req.body;

    // Validate required fields
    if (!title || !color) {
      return res.status(400).json({
        success: false,
        message: 'Title and color are required'
      });
    }

    // Validate color format
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(color)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid color format. Must be a valid hex color (e.g., #FF0000)'
      });
    }

    console.log(`Updating leave type ${id} with data:`, req.body); // Debug log

    const leaveType = await updateLeaveType(id, {
      title,
      status: status || 'active',
      color,
      description
    });

    console.log('Leave type updated:', leaveType); // Debug log

    res.json({
      success: true,
      message: 'Leave type updated successfully',
      data: leaveType
    });
  } catch (error) {
    console.error('❌ Error in updateLeaveTypeController:', error);
    if (error.message === 'Leave type not found') {
      return res.status(404).json({
        success: false,
        message: 'Leave type not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update leave type',
      error: error.message
    });
  }
};

// Delete a leave type
export const deleteLeaveTypeController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting leave type ${id}`); // Debug log

    await deleteLeaveType(id);

    res.json({
      success: true,
      message: 'Leave type deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error in deleteLeaveTypeController:', error);
    if (error.message === 'Leave type not found') {
      return res.status(404).json({
        success: false,
        message: 'Leave type not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to delete leave type',
      error: error.message
    });
  }
}; 