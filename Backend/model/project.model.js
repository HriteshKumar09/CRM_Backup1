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



// Project Status CRUD Operations
// Create a new project status
export const createProjectStatus = (statusData) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO _project_status (title, title_language_key, key_name, icon) VALUES (?, ?, ?, ?)';
    
    db.query(query, [
      statusData.title,
      statusData.title_language_key || statusData.title.toLowerCase(),
      statusData.key_name || statusData.title.toLowerCase(),
      statusData.icon || 'grid'
    ], (err, result) => {
      if (err) {
        console.error('Error creating project status:', err);
        reject(err);
      } else {
        resolve({
          success: true,
          statusId: result.insertId
        });
      }
    });
  });
};

// Get all project statuses
export const getAllProjectStatuses = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM _project_status WHERE deleted = 0 ORDER BY id DESC';
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching project statuses:', err);
        reject(err);
      } else {
        resolve({
          success: true,
          data: results
        });
      }
    });
  });
};

// Update a project status
export const updateProjectStatus = (statusId, statusData) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE _project_status SET title = ?, title_language_key = ?, key_name = ?, icon = ? WHERE id = ? AND deleted = 0';
    
    db.query(query, [
      statusData.title,
      statusData.title_language_key || statusData.title.toLowerCase(),
      statusData.key_name || statusData.title.toLowerCase(),
      statusData.icon || 'grid',
      statusId
    ], (err, result) => {
      if (err) {
        console.error('Error updating project status:', err);
        reject(err);
      } else {
        resolve({
          success: true,
          affectedRows: result.affectedRows
        });
      }
    });
  });
};

// Delete a project status (soft delete)
export const deleteProjectStatus = (statusId) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE _project_status SET deleted = 1 WHERE id = ?';
    
    db.query(query, [statusId], (err, result) => {
      if (err) {
        console.error('Error deleting project status:', err);
        reject(err);
      } else {
        resolve({
          success: true,
          affectedRows: result.affectedRows
        });
      }
    });
  });
};



/////////////////
//project Time
/////////////////

// ⏱️ Create a new time log
export const createProjectTime = (timeData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _project_time (
        project_id, user_id, start_time, end_time, hours, status, note, task_id, deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;

    const values = [
      timeData.project_id,
      timeData.user_id,
      timeData.start_time,
      timeData.end_time || null,
      timeData.hours || 0,
      timeData.status || 'logged',
      timeData.note || '',
      timeData.task_id || 0
    ];

    db.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve({ success: true, id: result.insertId });
    });
  });
};

// 📥 Get time log by ID
export const getProjectTimeById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM _project_time WHERE id = ? AND deleted = 0`;
    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0] || null);
    });
  });
};


// 📋 Get all time logs for a project
export const getProjectTimeByProjectId = (projectId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM _project_time WHERE project_id = ? AND deleted = 0`;
    db.query(query, [projectId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};


// ✏️ Update a time log
export const updateProjectTime = (id, timeData) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _project_time SET 
        start_time = ?, end_time = ?, hours = ?, status = ?, note = ?, task_id = ?
      WHERE id = ? AND deleted = 0
    `;

    const values = [
      timeData.start_time,
      timeData.end_time || null,
      timeData.hours || 0,
      timeData.status || 'logged',
      timeData.note || '',
      timeData.task_id || 0,
      id
    ];

    db.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve({ success: true });
    });
  });
};

// 🗑️ Soft delete a time log
export const deleteProjectTime = (id) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE _project_time SET deleted = 1 WHERE id = ?`;
    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve({ success: true });
    });
  });
};


//////////////////////
//project time calculation
///////////////////////

// Get total time spent on a project
export const getTotalTimeForProject = (projectId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT SUM(hours) AS total_hours 
      FROM _project_time 
      WHERE project_id = ? AND deleted = 0 AND status = 'logged'
    `;
    db.query(query, [projectId], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]); // { total_hours: 5.5 }
    });
  });
};

// ✅ Get total hours grouped by task for a given project
export const getHoursByTaskForProject = (projectId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT t.id AS task_id, t.title AS task_title, IFNULL(SUM(pt.hours), 0) AS total_hours
      FROM _tasks t
      LEFT JOIN _project_time pt ON pt.task_id = t.id AND pt.deleted = 0
      WHERE t.project_id = ? AND t.deleted = 0
      GROUP BY t.id
    `;
    db.query(query, [projectId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// ✅ Get total hours a user has spent on a project
export const getUserTotalHoursOnProject = (projectId, userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT IFNULL(SUM(hours), 0) AS total_hours
      FROM _project_time
      WHERE project_id = ? AND user_id = ? AND deleted = 0
    `;
    db.query(query, [projectId, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};
