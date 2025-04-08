import {
  getTaskChecklistItems,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  getChecklistTemplates,
  addChecklistTemplate,
  getChecklistGroups,
  addChecklistGroup,
  updateChecklistGroup,
  deleteChecklistGroup
} from '../model/checklist.model.js';

// Get checklist items for a task
export const getTaskChecklistItemsController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await getTaskChecklistItems(taskId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getTaskChecklistItemsController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch checklist items',
      error: error.message
    });
  }
};

// Add a new checklist item
export const addChecklistItemController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, is_checked, sort } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const result = await addChecklistItem(taskId, { title, is_checked, sort });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in addChecklistItemController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add checklist item',
      error: error.message
    });
  }
};

// Update a checklist item
export const updateChecklistItemController = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { title, is_checked, sort } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const result = await updateChecklistItem(itemId, { title, is_checked, sort });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in updateChecklistItemController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update checklist item',
      error: error.message
    });
  }
};

// Delete a checklist item
export const deleteChecklistItemController = async (req, res) => {
  try {
    const { itemId } = req.params;
    const result = await deleteChecklistItem(itemId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in deleteChecklistItemController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete checklist item',
      error: error.message
    });
  }
};

// Get all checklist templates
export const getChecklistTemplatesController = async (req, res) => {
  try {
    const result = await getChecklistTemplates();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getChecklistTemplatesController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch checklist templates',
      error: error.message
    });
  }
};

// Add a new checklist template
export const addChecklistTemplateController = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const result = await addChecklistTemplate({ title });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in addChecklistTemplateController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add checklist template',
      error: error.message
    });
  }
};

// Get all checklist groups
export const getChecklistGroupsController = async (req, res) => {
  try {
    const result = await getChecklistGroups();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getChecklistGroupsController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch checklist groups',
      error: error.message
    });
  }
};

// Add a new checklist group
export const addChecklistGroupController = async (req, res) => {
  try {
    const { title, checklists } = req.body;

    if (!title || !checklists) {
      return res.status(400).json({
        success: false,
        message: 'Title and checklists are required'
      });
    }

    const result = await addChecklistGroup({ title, checklists });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in addChecklistGroupController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add checklist group',
      error: error.message
    });
  }
};

// Update a checklist group
export const updateChecklistGroupController = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { title, checklists } = req.body;

    if (!title || !checklists) {
      return res.status(400).json({
        success: false,
        message: 'Title and checklists are required'
      });
    }

    const result = await updateChecklistGroup(groupId, { title, checklists });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in updateChecklistGroupController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update checklist group',
      error: error.message
    });
  }
};

// Delete a checklist group
export const deleteChecklistGroupController = async (req, res) => {
  try {
    const { groupId } = req.params;
    const result = await deleteChecklistGroup(groupId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in deleteChecklistGroupController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete checklist group',
      error: error.message
    });
  }
}; 