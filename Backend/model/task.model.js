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
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    // Directly accessing taskData properties here
    const values = [
      taskData.title || '',
      taskData.description || '',
      taskData.project_id,
      taskData.milestone_id || 0,
      taskData.assigned_to,
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
      taskData.created_date || new Date().toISOString().split('T')[0], // Only date in YYYY-MM-DD format
      taskData.blocking || '',
      taskData.blocked_by || '',
      taskData.parent_task_id || 0,
      taskData.next_recurring_date || null,
      taskData.reminder_date || null,
      taskData.ticket_id || 0,
      taskData.status_changed_at || null,
      taskData.deleted || 0,
      taskData.client_id || 0,
      taskData.context || 'project'
    ];

    // // Log for debugging
    // console.log('Executing SQL query:', query);
    // console.log('With values:', values);

    // Execute the query to insert the task
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Database query failed:', err); // Log the error for debugging
        return reject({
          success: false,
          message: 'Database error: Unable to create task.',
          error: err
        });
      }
      
      console.log('Task successfully created with ID:', result.insertId); // Log successful insertion
      resolve({
        success: true,
        message: 'Task created successfully.',
        taskId: result.insertId,
        data: taskData
      });
    });
  });
};





  export const getTasks = (limit = 10, offset = 0) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                t.*, 
                u.first_name AS assigned_user_first_name, 
                u.last_name AS assigned_user_last_name
            FROM _tasks t
            LEFT JOIN _users u ON t.assigned_to = u.id
            WHERE t.deleted = 0
            LIMIT ? OFFSET ?`;

        db.query(query, [limit, offset], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};


// Function to get a single task by id
export const getTaskById = (taskId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                t.*, 
                u.first_name AS assigned_user_first_name, 
                u.last_name AS assigned_user_last_name
            FROM _tasks t
            LEFT JOIN _users u ON t.assigned_to = u.id
            WHERE t.id = ? AND t.deleted = 0`;

        db.query(query, [taskId], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]); // Return the task if found
        });
    });
};

export const updateTask = (taskId, taskData) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE _tasks 
                       SET title = ?, description = ?, project_id = ?, milestone_id = ?, assigned_to = ?, 
                           deadline = ?, labels = ?, points = ?, status = ?, status_id = ?, priority_id = ?, 
                           start_date = ?, collaborators = ?, sort = ?, recurring = ?, repeat_every = ?, 
                           repeat_type = ?, no_of_cycles = ?, recurring_task_id = ?, no_of_cycles_completed = ?, 
                           created_date = ?, blocking = ?, blocked_by = ?, parent_task_id = ?, 
                           next_recurring_date = ?, reminder_date = ?, ticket_id = ?, 
                           status_changed_at = ?, deleted = ?, client_id = ?, context = ? 
                       WHERE id = ?`;

        db.query(query, [
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
            taskData.created_date || new Date(),
            taskData.blocking, 
            taskData.blocked_by, 
            taskData.parent_task_id, 
            taskData.next_recurring_date, 
            taskData.reminder_date, 
            taskData.ticket_id, 
            taskData.status_changed_at, 
            taskData.deleted, 
            taskData.client_id, 
            taskData.context, 
            taskId
        ], (err, result) => {
            if (err) return reject(err);
            resolve(result);
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
