import { 
  createProject as createProjectModel, 
  getAllProjects as getAllProjectsModel, 
  getProjectById as getProjectByIdModel, 
  updateProject as updateProjectModel, 
  deleteProject as deleteProjectModel,
  getProjectsByClientId as getProjectsByClientIdModel // New function 
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
