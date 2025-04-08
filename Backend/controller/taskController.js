import { createTask, deleteTask, getTaskById, getTasks, getTasksByClientId, updateTask, getAllTaskPriorities, getTaskPriorityById, getAllTaskStatuses, getTaskStatusById } from "../model/task.model.js";

// ✅ Create a task
export const createTaskController = async (req, res) => {
  try {
    const taskData = req.body;
    const result = await createTask(taskData);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
};

// ✅ Get all tasks (with Pagination)
export const getTasksController = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;

    const result = await getTasks(limit, offset);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

// ✅ Get a task by ID
export const getTaskByIdController = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required"
      });
    }

    const result = await getTaskById(taskId);
    
    if (result.success) {
      if (result.data) {
        res.status(200).json({
          success: true,
          data: result.data
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
};

// ✅ Update a task
export const updateTaskController = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required"
      });
    }

    const taskData = req.body;
    const result = await updateTask(taskId, taskData);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

// ✅ Delete a task (soft delete)
export const deleteTaskController = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required"
      });
    }

    const result = await deleteTask(taskId);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};

// ✅ Get tasks related to a client's projects
export const getTasksByClientIdController = async (req, res) => {
  try {
    const { clientId } = req.params;
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required"
      });
    }

    const result = await getTasksByClientId(clientId);
    
    if (result.success) {
      if (result.data.length > 0) {
        res.status(200).json({
          success: true,
          data: result.data
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No tasks found for this client"
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error("Error fetching tasks for client:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message
    });
  }
};

// Checklist Controllers
export const getTaskChecklistController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const checklist = await taskModel.getTaskChecklist(taskId);
    res.json({
      success: true,
      data: checklist
    });
  } catch (error) {
    console.error('Error fetching task checklist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task checklist',
      error: error.message
    });
  }
};

export const addChecklistItemController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text, completed } = req.body;
    const newItem = await taskModel.addChecklistItem(taskId, { text, completed });
    res.json({
      success: true,
      data: newItem
    });
  } catch (error) {
    console.error('Error adding checklist item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add checklist item',
      error: error.message
    });
  }
};

export const updateChecklistItemController = async (req, res) => {
  try {
    const { taskId, itemId } = req.params;
    const { completed } = req.body;
    const updatedItem = await taskModel.updateChecklistItem(taskId, itemId, completed);
    res.json({
      success: true,
      data: updatedItem
    });
  } catch (error) {
    console.error('Error updating checklist item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update checklist item',
      error: error.message
    });
  }
};

// Comments Controllers
export const getTaskCommentsController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const comments = await taskModel.getTaskComments(taskId);
    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('Error fetching task comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task comments',
      error: error.message
    });
  }
};

export const addCommentController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content, user_id } = req.body;
    const newComment = await taskModel.addComment(taskId, { content, user_id });
    res.json({
      success: true,
      data: newComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
};

// Time Tracking Controller
export const getTaskTimeController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const timeData = await taskModel.getTaskTime(taskId);
    res.json({
      success: true,
      data: timeData
    });
  } catch (error) {
    console.error('Error fetching task time:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task time',
      error: error.message
    });
  }
};

// Get all task priorities
export const getAllTaskPrioritiesController = async (req, res) => {
  try {
    const result = await getAllTaskPriorities();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error fetching task priorities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task priorities',
      error: error.message
    });
  }
};

// Get task priority by ID
export const getTaskPriorityByIdController = async (req, res) => {
  try {
    const priorityId = req.params.id;
    if (!priorityId) {
      return res.status(400).json({
        success: false,
        message: "Priority ID is required"
      });
    }

    const result = await getTaskPriorityById(priorityId);
    
    if (result.success) {
      if (result.data) {
        res.status(200).json({
          success: true,
          data: result.data
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Task priority not found'
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error fetching task priority:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task priority',
      error: error.message
    });
  }
};

// Get all task statuses
export const getAllTaskStatusesController = async (req, res) => {
  try {
    const result = await getAllTaskStatuses();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error fetching task statuses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task statuses',
      error: error.message
    });
  }
};

// Get task status by ID
export const getTaskStatusByIdController = async (req, res) => {
  try {
    const statusId = req.params.id;
    if (!statusId) {
      return res.status(400).json({
        success: false,
        message: "Status ID is required"
      });
    }

    const result = await getTaskStatusById(statusId);
    
    if (result.success) {
      if (result.data) {
        res.status(200).json({
          success: true,
          data: result.data
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Task status not found'
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error fetching task status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task status',
      error: error.message
    });
  }
};
