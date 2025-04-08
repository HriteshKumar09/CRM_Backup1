import { 
  createProject as createProjectModel, 
  getAllProjects as getAllProjectsModel, 
  getProjectById as getProjectByIdModel, 
  updateProject as updateProjectModel, 
  deleteProject as deleteProjectModel,
  getProjectsByClientId as getProjectsByClientIdModel, // New function 
  createProjectStatus,
  getAllProjectStatuses,
  updateProjectStatus,
  deleteProjectStatus,
  createProjectTime,
  getProjectTimeById,
  getProjectTimeByProjectId,
  updateProjectTime,
  deleteProjectTime,
  getTotalTimeForProject,
  getHoursByTaskForProject,
  getUserTotalHoursOnProject
} from '../model/project.model.js';
import { createNotification } from '../controller/notificationsController.js'; // Assuming the notification function is imported
// Create a new project
export const createProject = async (req, res) => {
  const projectData = req.body;  // Assuming data is sent in the body of the request

  // Basic validation of project data
  if (!projectData.title || !projectData.description || !projectData.client_id) {
    return res.status(400).json({ success: false, message: 'Title, description, and client_id are required' });
  }

  try {
    const result = await createProjectModel(projectData);  // Call the model function directly

    // Log the client ID before sending the notification
    console.log("🔍 The id sent to is ", projectData.client_id);

    // Sending notifications after project creation
    const notificationData = {
      user_id: projectData.created_by,  // Assuming the project creator is the user to notify
      description: `A new project titled "${projectData.title}" has been created.`,
      notify_to: projectData.client_id, // Notify the client
      event: 'Project Created',
      project_id: result.data.id
    };

    // Create the notification
    await createNotification(notificationData);

    res.status(201).json({ 
      success: true, 
      data: result, 
      message: 'Project created successfully. Notification sent to the client.' 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Error creating project', error: err.message });
  }
};

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await getAllProjectsModel();  // Call the model function directly
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Error fetching projects', error: err.message });
  }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
  const { projectId } = req.params;  // Assuming the project ID is passed as a route parameter

  try {
    const project = await getProjectByIdModel(projectId);  // Call the model function directly
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Error fetching project', error: err.message });
  }
};

// Update a project by ID
export const updateProject = async (req, res) => {
  const { projectId } = req.params;  // Get project ID from route parameters
  const updatedData = req.body;  // Get updated data from request body

  // Basic validation of updated project data
  if (!updatedData.title || !updatedData.description || !updatedData.client_id) {
    return res.status(400).json({ success: false, message: 'Title, description, and client_id are required' });
  }
  
  try {
    const result = await updateProjectModel(projectId, updatedData);  // Call the model function directly
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Sending notifications after project update
    const notificationData = {
      user_id: updatedData.created_by,  // Assuming the project updater is the user to notify
      description: `The project titled "${updatedData.title}" has been updated.`,
      notify_to: updatedData.client_id, // Notify the client
      event: 'Project Updated',
      project_id: projectId
    };

    // Create the notification
    await createNotification(notificationData);

    res.status(200).json({ 
      success: true, 
      message: 'Project updated successfully. Notification sent to the client.' 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Error updating project', error: err.message });
  }
};

// Soft delete a project (set deleted = 1)
export const deleteProject = async (req, res) => {
  const { projectId } = req.params;  // Get project ID from route parameters

  try {
    const result = await deleteProjectModel(projectId);  // Call the model function directly
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Sending notifications after project deletion (soft delete)
    const project = await getProjectByIdModel(projectId);  // Fetch project details to use in the notification

    const notificationData = {
      user_id: project.created_by,  // Assuming the project creator is the user to notify
      description: `The project titled "${project.title}" has been deleted and is no longer active.`,
      notify_to: project.client_id, // Notify the client
      event: 'Project Deleted',
      project_id: projectId
    };

    // Create the notification
    await createNotification(notificationData);

    res.status(200).json({ 
      success: true, 
      message: 'Project deleted successfully. Notification sent to the client.' 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Error deleting project', error: err.message });
  }
};

// ✅ Get all projects for a specific client
export const getProjectsByClientId = async (req, res) => {
  const { clientId } = req.params; // Extract client ID from URL

  try {
    const projects = await getProjectsByClientIdModel(clientId);
    if (!projects.length) {
      return res.status(404).json({ success: false, message: 'No projects found for this client' });
    }
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    console.error('Error fetching projects by client ID:', err);
    res.status(500).json({ success: false, message: 'Database error', error: err.message });
  }
};

// Project Status Controllers

// Create a new project status
export const createProjectStatusController = async (req, res) => {
  try {
    const statusData = req.body;
    
    if (!statusData.title || !statusData.title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Status title is required'
      });
    }

    const result = await createProjectStatus(statusData);
    
    res.status(201).json({
      success: true,
      message: 'Project status created successfully',
      statusId: result.statusId
    });
  } catch (error) {
    console.error('Error in createProjectStatusController:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create project status'
    });
  }
};

// Get all project statuses
export const getAllProjectStatusesController = async (req, res) => {
  try {
    const result = await getAllProjectStatuses();
    
    res.status(200).json({
      success: true,
      statuses: result.data
    });
  } catch (error) {
    console.error('Error in getAllProjectStatusesController:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch project statuses'
    });
  }
};

// Update a project status
export const updateProjectStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const statusData = req.body;
    
    if (!statusData.title || !statusData.title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Status title is required'
      });
    }

    const result = await updateProjectStatus(id, statusData);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project status not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project status updated successfully'
    });
  } catch (error) {
    console.error('Error in updateProjectStatusController:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update project status'
    });
  }
};

// Delete a project status
export const deleteProjectStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProjectStatus(id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project status not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project status deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteProjectStatusController:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete project status'
    });
  }
};

///////////////////////
// Project Time Controllers
//////////////////////

// ➕ Create new project time log
export const createTimeEntry = async (req, res) => {
  try {
    const result = await createProjectTime(req.body);
    res.status(201).json({ success: true, message: "Time entry created", id: result.id });
  } catch (err) {
    console.error("❌ Error creating time entry:", err);
    res.status(500).json({ success: false, message: "Failed to create time entry" });
  }
};

// 📥 Get time entry by ID
export const getTimeEntryById = async (req, res) => {
  try {
    const data = await getProjectTimeById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Time entry not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ Error fetching time entry:", err);
    res.status(500).json({ success: false, message: "Failed to fetch time entry" });
  }
};

// 📋 Get all time entries for a project
export const getTimeEntriesByProject = async (req, res) => {
  try {
    const data = await getProjectTimeByProjectId(req.params.projectId);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ Error fetching project time entries:", err);
    res.status(500).json({ success: false, message: "Failed to fetch time entries" });
  }
};

// ✏️ Update time entry
export const updateTimeEntry = async (req, res) => {
  try {
    await updateProjectTime(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Time entry updated" });
  } catch (err) {
    console.error("❌ Error updating time entry:", err);
    res.status(500).json({ success: false, message: "Failed to update time entry" });
  }
};

// 🗑️ Soft delete time entry
export const deleteTimeEntry = async (req, res) => {
  try {
    await deleteProjectTime(req.params.id);
    res.status(200).json({ success: true, message: "Time entry deleted" });
  } catch (err) {
    console.error("❌ Error deleting time entry:", err);
    res.status(500).json({ success: false, message: "Failed to delete time entry" });
  }
};



////////////////////
// Project Time calculator  Controllers
////////////////////
// 🕒 Total hours for a project
export const getTotalHoursForProjectController = async (req, res) => {
  const { projectId } = req.params;
  try {
    const result = await getTotalTimeForProject(projectId);
    res.status(200).json({ success: true, total_hours: result.total_hours });
  } catch (err) {
    console.error("Error fetching total hours:", err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// 🧩 Hours grouped by task
export const getHoursByTaskForProjectController = async (req, res) => {
  const { projectId } = req.params;
  try {
    const result = await getHoursByTaskForProject(projectId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("Error fetching hours by task:", err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// 👤 Total user hours on a project
export const getUserTotalHoursOnProjectController = async (req, res) => {
  const { projectId, userId } = req.params;
  try {
    const result = await getUserTotalHoursOnProject(projectId, userId);
    res.status(200).json({ success: true, total_hours: result.total_hours });
  } catch (err) {
    console.error("Error fetching user hours on project:", err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

////////////////////
// ⏱️ Timer Workflow Controllers
/////////////////////
  // ✅ Start Timer
  export const startTimerController = async (req, res) => {
    try {
      const { project_id, task_id } = req.body;
      const user_id = req.user.id; // From JWT

      // First check if there's any active timer for this user
      const checkQuery = `
        SELECT id FROM _project_time 
        WHERE user_id = ? AND status = 'open' AND deleted = 0
      `;

      db.query(checkQuery, [user_id], async (err, activeTimers) => {
        if (err) {
          console.error("Error checking active timers:", err);
          return res.status(500).json({ success: false, message: "Failed to check active timers" });
        }

        if (activeTimers.length > 0) {
          return res.status(400).json({ 
            success: false, 
            message: "You already have an active timer. Please stop it before starting a new one." 
          });
        }

        // If no active timer, create new one
        const newTimer = {
          project_id,
          task_id,
          user_id,
          start_time: new Date(),
          end_time: null,
          hours: 0,
          status: "open",
          note: "Timer started",
          deleted: 0
        };

        const insertQuery = `
          INSERT INTO _project_time (
            project_id, task_id, user_id, start_time, 
            end_time, hours, status, note, deleted
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          newTimer.project_id,
          newTimer.task_id,
          newTimer.user_id,
          newTimer.start_time,
          newTimer.end_time,
          newTimer.hours,
          newTimer.status,
          newTimer.note,
          newTimer.deleted
        ];

        db.query(insertQuery, values, (err, result) => {
          if (err) {
            console.error("Error starting timer:", err);
            return res.status(500).json({ success: false, message: "Failed to start timer" });
          }

          res.status(201).json({ 
            success: true, 
            message: "Timer started successfully",
            id: result.insertId 
          });
        });
      });
    } catch (err) {
      console.error("Error in startTimerController:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  // ✅ Stop Timer
  export const stopTimerController = async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      // First check if timer exists and belongs to user
      const checkQuery = `
        SELECT * FROM _project_time 
        WHERE id = ? AND user_id = ? AND status = 'open' AND deleted = 0
      `;

      db.query(checkQuery, [id, user_id], (err, timers) => {
        if (err) {
          console.error("Error checking timer:", err);
          return res.status(500).json({ success: false, message: "Failed to check timer" });
        }

        if (timers.length === 0) {
          return res.status(404).json({ 
            success: false, 
            message: "No active timer found or timer doesn't belong to you" 
          });
        }

        const timer = timers[0];
        const end_time = new Date();
        const start_time = new Date(timer.start_time);
        const hours = Math.abs(end_time - start_time) / 36e5; // Convert to hours

        const updateQuery = `
          UPDATE _project_time 
          SET end_time = ?, hours = ?, status = ?, note = ? 
          WHERE id = ? AND user_id = ?
        `;

        const values = [
          end_time,
          hours,
          'logged',
          'Timer stopped',
          id,
          user_id
        ];

        db.query(updateQuery, values, (err, result) => {
          if (err) {
            console.error("Error stopping timer:", err);
            return res.status(500).json({ success: false, message: "Failed to stop timer" });
          }

          res.status(200).json({ 
            success: true, 
            message: "Timer stopped successfully",
            hours: hours
          });
        });
      });
    } catch (err) {
      console.error("Error in stopTimerController:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  // ✅ Get Active Timer
  export const getActiveTimerController = async (req, res) => {
    try {
      const { taskId } = req.params;
      const user_id = req.user.id;

      const query = `
        SELECT * FROM _project_time 
        WHERE task_id = ? AND user_id = ? AND status = 'open' AND deleted = 0 
        ORDER BY start_time DESC LIMIT 1
      `;

      db.query(query, [taskId, user_id], (err, result) => {
        if (err) {
          console.error('Error checking active timer:', err);
          return res.status(500).json({ success: false, message: 'Failed to check active timer' });
        }

        res.json({
          success: true,
          data: result[0] || null
        });
      });
    } catch (err) {
      console.error("Error in getActiveTimerController:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  