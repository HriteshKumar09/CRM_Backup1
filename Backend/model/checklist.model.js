import db from "../config/db.js";

// Get checklist items for a task
export const getTaskChecklistItems = (taskId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM _checklist_items 
      WHERE task_id = ? AND deleted = 0 
      ORDER BY sort ASC
    `;
    db.query(query, [taskId], (err, result) => {
      if (err) {
        console.error('Error in getTaskChecklistItems:', err);
        return reject(err);
      }
      resolve({
        success: true,
        data: result
      });
    });
  });
};

// Add a new checklist item
export const addChecklistItem = (taskId, { title, is_checked, sort }) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _checklist_items (task_id, title, is_checked, sort)
      VALUES (?, ?, ?, ?)
    `;
    db.query(query, [taskId, title, is_checked || 0, sort || 0], (err, result) => {
      if (err) {
        console.error('Error in addChecklistItem:', err);
        return reject(err);
      }
      resolve({
        success: true,
        data: {
          id: result.insertId,
          task_id: taskId,
          title,
          is_checked: is_checked || 0,
          sort: sort || 0,
          deleted: 0
        }
      });
    });
  });
};

// Update a checklist item
export const updateChecklistItem = (itemId, { title, is_checked, sort }) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _checklist_items 
      SET title = ?, is_checked = ?, sort = ?
      WHERE id = ? AND deleted = 0
    `;
    db.query(query, [title, is_checked, sort, itemId], (err, result) => {
      if (err) {
        console.error('Error in updateChecklistItem:', err);
        return reject(err);
      }
      resolve({
        success: true,
        data: {
          id: itemId,
          title,
          is_checked,
          sort,
          deleted: 0
        }
      });
    });
  });
};

// Delete a checklist item (soft delete)
export const deleteChecklistItem = (itemId) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _checklist_items 
      SET deleted = 1 
      WHERE id = ? AND deleted = 0
    `;
    db.query(query, [itemId], (err, result) => {
      if (err) {
        console.error('Error in deleteChecklistItem:', err);
        return reject(err);
      }
      resolve({
        success: true,
        message: 'Checklist item deleted successfully'
      });
    });
  });
};

// Get all checklist templates
export const getChecklistTemplates = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM _checklist_template 
      WHERE deleted = 0
    `;
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error in getChecklistTemplates:', err);
        return reject(err);
      }
      resolve({
        success: true,
        data: result
      });
    });
  });
};

// Add a new checklist template
export const addChecklistTemplate = ({ title }) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _checklist_template (title)
      VALUES (?)
    `;
    db.query(query, [title], (err, result) => {
      if (err) {
        console.error('Error in addChecklistTemplate:', err);
        return reject(err);
      }
      resolve({
        success: true,
        data: {
          id: result.insertId,
          title,
          deleted: 0
        }
      });
    });
  });
};

// Get all checklist groups
export const getChecklistGroups = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM _checklist_groups 
      WHERE deleted = 0
    `;
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error in getChecklistGroups:', err);
        return reject(err);
      }
      resolve({
        success: true,
        data: result
      });
    });
  });
};

// Add a new checklist group
export const addChecklistGroup = ({ title, checklists }) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _checklist_groups (title, checklists)
      VALUES (?, ?)
    `;
    db.query(query, [title, JSON.stringify(checklists)], (err, result) => {
      if (err) {
        console.error('Error in addChecklistGroup:', err);
        return reject(err);
      }
      resolve({
        success: true,
        data: {
          id: result.insertId,
          title,
          checklists,
          deleted: 0
        }
      });
    });
  });
};

// Update a checklist group
export const updateChecklistGroup = (groupId, { title, checklists }) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _checklist_groups 
      SET title = ?, checklists = ?
      WHERE id = ? AND deleted = 0
    `;
    db.query(query, [title, JSON.stringify(checklists), groupId], (err, result) => {
      if (err) {
        console.error('Error in updateChecklistGroup:', err);
        return reject(err);
      }
      resolve({
        success: true,
        data: {
          id: groupId,
          title,
          checklists,
          deleted: 0
        }
      });
    });
  });
};

// Delete a checklist group (soft delete)
export const deleteChecklistGroup = (groupId) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _checklist_groups 
      SET deleted = 1 
      WHERE id = ? AND deleted = 0
    `;
    db.query(query, [groupId], (err, result) => {
      if (err) {
        console.error('Error in deleteChecklistGroup:', err);
        return reject(err);
      }
      resolve({
        success: true,
        message: 'Checklist group deleted successfully'
      });
    });
  });
}; 