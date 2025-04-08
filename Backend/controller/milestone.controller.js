import {
  createMilestone,
  getMilestonesByProject,
  getMilestoneById,
  updateMilestone,
  deleteMilestone
} from '../model/milestone.model.js';

// Create a new milestone
export const createMilestoneController = async (req, res) => {
  try {
    const milestoneData = req.body;

    // Validate required fields
    if (!milestoneData.title || !milestoneData.project_id || !milestoneData.due_date) {
      return res.status(400).json({
        success: false,
        message: 'Title, project ID, and due date are required'
      });
    }

    const result = await createMilestone(milestoneData);
    res.status(201).json({
      success: true,
      message: 'Milestone created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in createMilestoneController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create milestone',
      error: error.message
    });
  }
};

// Get all milestones for a project
export const getMilestonesByProjectController = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    const milestones = await getMilestonesByProject(projectId);
    res.status(200).json({
      success: true,
      data: milestones
    });
  } catch (error) {
    console.error('Error in getMilestonesByProjectController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch milestones',
      error: error.message
    });
  }
};

// Get a single milestone
export const getMilestoneController = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Milestone ID is required'
      });
    }

    const milestone = await getMilestoneById(id);
    
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    res.status(200).json({
      success: true,
      data: milestone
    });
  } catch (error) {
    console.error('Error in getMilestoneController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch milestone',
      error: error.message
    });
  }
};

// Update a milestone
export const updateMilestoneController = async (req, res) => {
  try {
    const { id } = req.params;
    const milestoneData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Milestone ID is required'
      });
    }

    // Validate required fields
    if (!milestoneData.title || !milestoneData.project_id || !milestoneData.due_date) {
      return res.status(400).json({
        success: false,
        message: 'Title, project ID, and due date are required'
      });
    }

    const existingMilestone = await getMilestoneById(id);
    if (!existingMilestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    const result = await updateMilestone(id, milestoneData);
    res.status(200).json({
      success: true,
      message: 'Milestone updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in updateMilestoneController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update milestone',
      error: error.message
    });
  }
};

// Delete a milestone
export const deleteMilestoneController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Milestone ID is required'
      });
    }

    const existingMilestone = await getMilestoneById(id);
    if (!existingMilestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    await deleteMilestone(id);
    res.status(200).json({
      success: true,
      message: 'Milestone deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteMilestoneController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete milestone',
      error: error.message
    });
  }
}; 