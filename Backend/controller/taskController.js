import { createTask, deleteTask, getTaskById, getTasks, getTasksByClientId, updateTask } from "../model/task.model.js";

// ✅ Create a task
export const createTaskController = async (req, res) => {
  try {
    const taskData = req.body;
    const result = await createTask(taskData);
    res.status(201).json({ message: 'Task created successfully', taskId: result.data.id }); // ✅ Corrected insertId
  } catch (error) {
    console.error('❌ Error creating task:', error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// ✅ Get all tasks (with Pagination)
export const getTasksController = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;

    const tasks = await getTasks(limit, offset);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('❌ Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// ✅ Get a task by ID
export const getTaskByIdController = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) return res.status(400).json({ message: "Task ID is required" });

    const task = await getTaskById(taskId);
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('❌ Error fetching task:', error);
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

// ✅ Update a task
export const updateTaskController = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) return res.status(400).json({ message: "Task ID is required" });

    const taskData = req.body;
    const result = await updateTask(taskId, taskData);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Task updated successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('❌ Error updating task:', error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// ✅ Delete a task (soft delete)
export const deleteTaskController = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) return res.status(400).json({ message: "Task ID is required" });

    const result = await deleteTask(taskId);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('❌ Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};


// ✅ Get tasks related to a client's projects
export const getTasksByClientIdController = async (req, res) => {
  try {
    const { clientId } = req.params;
    if (!clientId) return res.status(400).json({ message: "Client ID is required" });

    const tasks = await getTasksByClientId(clientId); // Fetch all tasks for the client

    if (tasks.length > 0) {
      res.status(200).json({ success: true, data: tasks });
    } else {
      res.status(404).json({ success: false, message: "No tasks found for this client" });
    }
  } catch (error) {
    console.error("❌ Error fetching tasks for client:", error);
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};
