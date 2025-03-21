import db from "../config/db.js";


// Creating a new project
export const createProject = (projectData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _projects (
        title, description, project_type, start_date, deadline, client_id, 
        created_date, created_by, status, status_id, labels, price, starred_by, estimate_id, order_id, deleted
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?,?)`;

    const values = [
      projectData.title || '',  // Title cannot be null
      projectData.description || null,  // Nullable field
      projectData.project_type || 'client_project',  // Default value for project_type
      projectData.start_date || null,  // Nullable field
      projectData.deadline || null,  // Nullable field
      projectData.client_id,  // Cannot be null
      projectData.created_by || 1,  // Default to 1 if not provided
      projectData.status || 'open',  // Default to 'open'
      projectData.status_id || 1,  // Default to 1
      projectData.labels || null,  // Nullable field
      projectData.price || 0,  // Default to 0
      projectData.starred_by || '[]',  // Default to empty array in JSON format
      projectData.estimate_id || 0,  // Ensure it's not NULL, using 0 as placeholder
      projectData.order_id || 0,  // Ensure it's not NULL, using 0 as placeholder
      0  // Default for deleted (soft delete flag)
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("❌ Error creating project:", err);
        return reject(err);
      }

      resolve({
        success: true,
        data: {
          id: result.insertId,
          ...projectData
        }
      });
    });
  });
};




// Get all projects
export const getAllProjects = (limit = 10, offset = 0) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM _projects WHERE deleted = 0 LIMIT ? OFFSET ?`;
    db.query(query, [limit, offset], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Get a specific project by ID
export const getProjectById = (projectId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM _projects WHERE id = ? AND deleted = 0`;
    db.query(query, [projectId], (err, result) => {
      if (err) return reject(err);
      if (!result.length) {
        return reject(new Error('Project not found'));
      }
      resolve(result[0]); // Return the project if found
    });
  });
};

// Update a project
export const updateProject = (projectId, projectData) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _projects SET 
        title = ?, description = ?, project_type = ?, start_date = ?, deadline = ?, 
        client_id = ?, created_date = ?, created_by = ?, status = ?, status_id = ?, 
        labels = ?, price = ?, starred_by = ?, estimate_id = ?, order_id = ?, deleted = ? 
      WHERE id = ?`;

    const values = [
      projectData.title || '',  // Title cannot be null
      projectData.description || null,  // Nullable field
      projectData.project_type || 'client_project',  // Default value for project_type
      projectData.start_date || null,  // Nullable field
      projectData.deadline || null,  // Nullable field
      projectData.client_id,  // Cannot be null
      projectData.created_date || new Date(),  // Use new date if not provided
      projectData.created_by || 1,  // Default to 1 if not provided
      projectData.status || 'open',  // Default to 'open'
      projectData.status_id || 1,  // Default to 1
      projectData.labels || null,  // Nullable field
      projectData.price || 0,  // Default to 0
      projectData.starred_by || '[]',  // Default to empty array in JSON format
      projectData.estimate_id || 0,  // Ensure it's not NULL, using 0 as placeholder
      projectData.order_id || 0,  // Ensure it's not NULL, using 0 as placeholder
      projectData.deleted || 0,  // Default to 0 for deleted (soft delete flag)
      projectId  // The project ID to update
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error updating project:', err);
        return reject(err);
      }
      resolve(result);
    });
  });
};


// Soft delete a project (set deleted = 1)
export const deleteProject = (projectId) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE _projects SET deleted = 1 WHERE id = ?`;
    db.query(query, [projectId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};



///////////////
{/* Get projects by Client id */}
// Get all projects for a specific client
export const getProjectsByClientId = (clientId, limit = 10, offset = 0) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM _projects 
      WHERE client_id = ? AND deleted = 0 
      LIMIT ? OFFSET ?`;

    db.query(query, [clientId, limit, offset], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
