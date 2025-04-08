import db from "../config/db.js"; // Make sure you import your database configuration correctly.

// Function to create a task
export const createTask = (taskData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _tasks (
        title, description, project_id, milestone_id, assigned_to, deadline,
        labels, points, status, status_id, priority_id, start_date,
        collaborators, sort, recurring, repeat_every, repeat_type,
        no_of_cycles, recurring_task_id, no_of_cycles_completed, created_date,
        blocking, blocked_by, parent_task_id, next_recurring_date,
        reminder_date, ticket_id, status_changed_at, deleted, client_id, context
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    const values = [
      taskData.title || '',
      taskData.description || '',
      taskData.project_id || null,
      taskData.milestone_id || null,
      taskData.assigned_to || null,
      taskData.deadline || null,
      taskData.labels || '',
      taskData.points || 1,
      taskData.status || 'to_do',
      taskData.status_id || 1,
      taskData.priority_id || 1,
      taskData.start_date || null,
      taskData.collaborators || '',
      taskData.sort || 0,
      taskData.recurring || 0,
      taskData.repeat_every || 0,
      taskData.repeat_type || null,
      taskData.no_of_cycles || 0,
      taskData.recurring_task_id || 0,
      taskData.no_of_cycles_completed || 0,
      new Date().toISOString().split('T')[0],
      taskData.blocking || '',
      taskData.blocked_by || '',
      taskData.parent_task_id || 0,
      taskData.next_recurring_date || null,
      taskData.reminder_date || null,
      taskData.ticket_id || 0,
      taskData.status_changed_at || null,
      0,
      taskData.client_id || 0,
      taskData.context || 'project'
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to create task',
          error: err.message
        });
      }
      
      resolve({
        success: true,
        message: 'Task created successfully',
        data: {
          id: result.insertId,
          ...taskData
        }
      });
    });
  });
};

export const getTasks = (limit = 10, offset = 0) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        t.*,
        p.title as project_title,
        m.title as milestone_title,
        u.first_name,
        u.last_name,
        u.email as assigned_user_email
      FROM _tasks t
      LEFT JOIN _projects p ON t.project_id = p.id
      LEFT JOIN _milestones m ON t.milestone_id = m.id
      LEFT JOIN _users u ON t.assigned_to = u.id
      WHERE t.deleted = 0
      ORDER BY t.created_date DESC
      LIMIT ? OFFSET ?
    `;

    db.query(query, [limit, offset], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to fetch tasks',
          error: err.message
        });
      }
      resolve({
        success: true,
        data: result
      });
    });
  });
};

export const getTaskById = (taskId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        t.*,
        p.title as project_title,
        m.title as milestone_title,
        u.first_name,
        u.last_name,
        u.email as assigned_user_email
      FROM _tasks t
      LEFT JOIN _projects p ON t.project_id = p.id
      LEFT JOIN _milestones m ON t.milestone_id = m.id
      LEFT JOIN _users u ON t.assigned_to = u.id
      WHERE t.id = ? AND t.deleted = 0
    `;

    db.query(query, [taskId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to fetch task',
          error: err.message
        });
      }
      resolve({
        success: true,
        data: result[0]
      });
    });
  });
};

export const updateTask = (taskId, taskData) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _tasks 
      SET title = ?, 
          description = ?, 
          project_id = ?, 
          milestone_id = ?, 
          assigned_to = ?, 
          deadline = ?, 
          labels = ?, 
          points = ?, 
          status = ?, 
          status_id = ?, 
          priority_id = ?, 
          start_date = ?, 
          collaborators = ?, 
          sort = ?, 
          recurring = ?, 
          repeat_every = ?, 
          repeat_type = ?, 
          no_of_cycles = ?, 
          recurring_task_id = ?, 
          no_of_cycles_completed = ?, 
          blocking = ?, 
          blocked_by = ?, 
          parent_task_id = ?, 
          next_recurring_date = ?, 
          reminder_date = ?, 
          ticket_id = ?, 
          status_changed_at = ?, 
          client_id = ?, 
          context = ? 
      WHERE id = ?
    `;

    const values = [
      taskData.title,
      taskData.description,
      taskData.project_id,
      taskData.milestone_id,
      taskData.assigned_to,
      taskData.deadline,
      taskData.labels,
      taskData.points,
      taskData.status,
      taskData.status_id,
      taskData.priority_id,
      taskData.start_date,
      taskData.collaborators,
      taskData.sort,
      taskData.recurring,
      taskData.repeat_every,
      taskData.repeat_type,
      taskData.no_of_cycles,
      taskData.recurring_task_id,
      taskData.no_of_cycles_completed,
      taskData.blocking,
      taskData.blocked_by,
      taskData.parent_task_id,
      taskData.next_recurring_date,
      taskData.reminder_date,
      taskData.ticket_id,
      taskData.status_changed_at,
      taskData.client_id,
      taskData.context,
      taskId
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to update task',
          error: err.message
        });
      }
      resolve({
        success: true,
        message: 'Task updated successfully',
        data: {
          id: taskId,
          ...taskData
        }
      });
    });
  });
};

// Function to delete a task (soft delete)
export const deleteTask = (taskId) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE _tasks SET deleted = 1 WHERE id = ?`; // Soft delete the task
        db.query(query, [taskId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

//////////
// ✅ Fetch tasks for a specific project
/////////
// ✅ Fetch tasks for projects that belong to a specific client
// ✅ Fetch tasks for projects that belong to a specific client
export const getTasksByClientId = (clientId) => {
  return new Promise((resolve, reject) => {
      const projectQuery = `SELECT id FROM _projects WHERE client_id = ? AND deleted = 0`;

      db.query(projectQuery, [clientId], (err, projectResults) => {
          if (err) return reject(err);

          if (projectResults.length === 0) {
              return resolve([]); // No projects found for this client
          }

          const projectIds = projectResults.map((p) => p.id);

          // Fetch tasks related to these projects
          const taskQuery = `
              SELECT 
                  t.*
              FROM _tasks t
              WHERE t.project_id IN (?) AND t.deleted = 0`;

          db.query(taskQuery, [projectIds], (err, taskResults) => {
              if (err) return reject(err);
              resolve(taskResults); // Resolve with all tasks
          });
      });
  });
};

// Checklist Model Functions
export const getTaskChecklist = async (taskId) => {
  try {
    const query = `
      SELECT * FROM _task_checklist 
      WHERE task_id = ? AND is_deleted = 0 
      ORDER BY created_at ASC
    `;
    const [rows] = await pool.query(query, [taskId]);
    return rows;
  } catch (error) {
    console.error('Error in getTaskChecklist:', error);
    throw error;
  }
};

export const addChecklistItem = async (taskId, { text, completed }) => {
  try {
    const query = `
      INSERT INTO _task_checklist (task_id, text, completed, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    const [result] = await pool.query(query, [taskId, text, completed]);
    const [newItem] = await pool.query(
      'SELECT * FROM _task_checklist WHERE id = ?',
      [result.insertId]
    );
    return newItem[0];
  } catch (error) {
    console.error('Error in addChecklistItem:', error);
    throw error;
  }
};

export const updateChecklistItem = async (taskId, itemId, completed) => {
  try {
    const query = `
      UPDATE _task_checklist 
      SET completed = ?, updated_at = NOW()
      WHERE id = ? AND task_id = ? AND is_deleted = 0
    `;
    await pool.query(query, [completed, itemId, taskId]);
    const [updatedItem] = await pool.query(
      'SELECT * FROM _task_checklist WHERE id = ?',
      [itemId]
    );
    return updatedItem[0];
  } catch (error) {
    console.error('Error in updateChecklistItem:', error);
    throw error;
  }
};

// Comments Model Functions
export const getTaskComments = async (taskId) => {
  try {
    const query = `
      SELECT c.*, u.email as user_email, u.first_name, u.last_name
      FROM _task_comments c
      LEFT JOIN _users u ON c.user_id = u.id
      WHERE c.task_id = ? AND c.is_deleted = 0
      ORDER BY c.created_at DESC
    `;
    const [rows] = await pool.query(query, [taskId]);
    return rows;
  } catch (error) {
    console.error('Error in getTaskComments:', error);
    throw error;
  }
};

export const addComment = async (taskId, { content, user_id }) => {
  try {
    const query = `
      INSERT INTO _task_comments (task_id, user_id, content, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    const [result] = await pool.query(query, [taskId, user_id, content]);
    const [newComment] = await pool.query(
      `SELECT c.*, u.email as user_email, u.first_name, u.last_name
       FROM _task_comments c
       LEFT JOIN _users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );
    return newComment[0];
  } catch (error) {
    console.error('Error in addComment:', error);
    throw error;
  }
};

// Time Tracking Model Functions
export const getTaskTime = async (taskId) => {
  try {
    const query = `
      SELECT 
        COALESCE(SUM(duration), 0) as total_seconds,
        COUNT(*) as total_entries
      FROM _project_time
      WHERE task_id = ? AND status = 'stopped'
    `;
    const [rows] = await pool.query(query, [taskId]);
    return rows[0];
  } catch (error) {
    console.error('Error in getTaskTime:', error);
    throw error;
  }
};

// Get all task priorities
export const getAllTaskPriorities = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM _task_priority 
      WHERE deleted = 0 
      ORDER BY id ASC
    `;

    db.query(query, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to fetch task priorities',
          error: err.message
        });
      }
      
      resolve({
        success: true,
        data: result
      });
    });
  });
};

// Get task priority by ID
export const getTaskPriorityById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM _task_priority 
      WHERE id = ? AND deleted = 0
    `;

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to fetch task priority',
          error: err.message
        });
      }
      
      if (result.length === 0) {
        return resolve({
          success: false,
          message: 'Task priority not found'
        });
      }
      
      resolve({
        success: true,
        data: result[0]
      });
    });
  });
};

// Get all task statuses
export const getAllTaskStatuses = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM _task_status 
      WHERE deleted = 0 
      ORDER BY sort ASC
    `;

    db.query(query, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to fetch task statuses',
          error: err.message
        });
      }
      
      resolve({
        success: true,
        data: result
      });
    });
  });
};

// Get task status by ID
export const getTaskStatusById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM _task_status 
      WHERE id = ? AND deleted = 0
    `;

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to fetch task status',
          error: err.message
        });
      }
      
      if (result.length === 0) {
        return resolve({
          success: false,
          message: 'Task status not found'
        });
      }
      
      resolve({
        success: true,
        data: result[0]
      });
    });
  });
};
