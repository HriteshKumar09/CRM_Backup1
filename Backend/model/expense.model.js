import db from "../config/db.js";
import moment from 'moment';

export const createExpense = (expenseData) => {
  return new Promise((resolve, reject) => {
    const {
      expense_date, category_id, description, amount, files,
      title, project_id, user_id, tax_id, tax_id2, client_id,
      recurring, recurring_expense_id, repeat_every, repeat_type,
      no_of_cycles, next_recurring_date, no_of_cycles_completed, deleted
    } = expenseData;

    // Calculate next recurring date if recurring
    let nextDate = next_recurring_date || null;
    if (recurring && repeat_every && repeat_type) {
      nextDate = moment(next_recurring_date || expense_date)
        .add(repeat_every, repeat_type)
        .format('YYYY-MM-DD');
    }

    const query = `
      INSERT INTO _expenses 
        (expense_date, category_id, description, amount, files, 
         title, project_id, user_id, tax_id, tax_id2, client_id, 
         recurring, recurring_expense_id, repeat_every, repeat_type, 
         no_of_cycles, next_recurring_date, no_of_cycles_completed, deleted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      expense_date || moment().format('YYYY-MM-DD'),
      category_id || 0,
      description || '',
      amount || 0,
      files || '',
      title || 'Untitled Expense',
      project_id || 0,
      user_id || 0,
      tax_id || 0,
      tax_id2 || 0,
      client_id || 0,
      recurring ? 1 : 0,
      recurring_expense_id || 0,
      repeat_every || 0,
      repeat_type || 'months',
      no_of_cycles || 0,
      nextDate,
      no_of_cycles_completed || 0,
      deleted || 0
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("❌ Error creating expense:", err);
        reject(err);
        return;
      }

      resolve({
        success: true,
        expenseId: result.insertId
      });
    });
  });
};




// Fetching all expenses model (with optional filters)
export const getAllExpenses = (filters = {}) => {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM _expenses WHERE deleted = 0'; // Fetch non-deleted expenses

    const filterKeys = Object.keys(filters);
    const filterValues = Object.values(filters);

    if (filterKeys.length > 0) {
      query += ' AND ' + filterKeys.map(key => `${key} = ?`).join(' AND ');
    }

    db.query(query, filterValues, (err, result) => {
      if (err) {
        console.error("❌ Error fetching expenses:", err);
        return reject({ message: "Error fetching expenses", error: err });
      }

      resolve({
        success: true,
        data: result
      });
    });
  });
};

// Fetching a single expense by ID model
export const getExpenseById = (expenseId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM _expenses WHERE id = ? AND deleted = 0'; // Fetch a single non-deleted expense by ID
    db.query(query, [expenseId], (err, result) => {
      if (err) {
        console.error("❌ Error fetching expense by ID:", err);
        return reject({ message: "Error fetching expense", error: err });
      }
      if (result.length === 0) {
        return reject({ message: 'Expense not found.' });
      }

      resolve({
        success: true,
        data: result[0]  // Return the first result
      });
    });
  });
};

export const updateExpense = (expenseId, updatedData) => {
  return new Promise((resolve, reject) => {
    let updateQuery = 'UPDATE _expenses SET ';
    const updateValues = [];

    const fieldsToUpdate = Object.keys(updatedData);
    
    if (updatedData.recurring && updatedData.repeat_every && updatedData.repeat_type) {
      // Calculate the next recurring date if recurring is being updated
      updatedData.next_recurring_date = moment(updatedData.next_recurring_date || updatedData.expense_date)
        .add(updatedData.repeat_every, updatedData.repeat_type)
        .format('YYYY-MM-DD');
    }

    fieldsToUpdate.forEach((field, index) => {
      updateQuery += `${field} = ?`;
      if (index < fieldsToUpdate.length - 1) {
        updateQuery += ', ';
      }
      updateValues.push(updatedData[field]);
    });

    updateQuery += ' WHERE id = ?';
    updateValues.push(expenseId);

    db.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error("❌ Error updating expense:", err);
        return reject({ message: "Error updating expense", error: err });
      }

      resolve({
        success: true,
        data: result
      });
    });
  });
};


// Soft deleting an expense model
export const deleteExpense = (expenseId) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE _expenses SET deleted = 1 WHERE id = ?';
    db.query(query, [expenseId], (err, result) => {
      if (err) {
        console.error("❌ Error deleting expense:", err);
        return reject({ message: "Error deleting expense", error: err });
      }

      resolve({
        success: true,
        message: "Expense deleted successfully"
      });
    });
  });
};


{/*Expense Categories*/}
// Model for Expense Categories
export const createExpenseCategory = (categoryData) => {
  return new Promise((resolve, reject) => {
    const { title, deleted = 0 } = categoryData;

    const query = `
      INSERT INTO _expense_categories 
        (title, deleted)
      VALUES (?, ?)
    `;

    const values = [title, deleted];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("❌ Error creating expense category:", err);
        return reject({ message: "Error creating expense category", error: err });
      }

      resolve({
        success: true,
        categoryId: result.insertId,
      });
    });
  });
};

// Fetch all expense categories
export const getAllExpenseCategories = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM _expense_categories WHERE deleted = 0';

    db.query(query, (err, result) => {
      if (err) {
        console.error("❌ Error fetching expense categories:", err);
        return reject({ message: "Error fetching expense categories", error: err });
      }

      resolve({
        success: true,
        data: result,
      });
    });
  });
};

// Fetch a single expense category by ID
export const getExpenseCategoryById = (categoryId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM _expense_categories WHERE id = ? AND deleted = 0';

    db.query(query, [categoryId], (err, result) => {
      if (err) {
        console.error("❌ Error fetching expense category by ID:", err);
        return reject({ message: "Error fetching expense category", error: err });
      }

      if (result.length === 0) {
        return reject({ message: "Expense category not found" });
      }

      resolve({
        success: true,
        data: result[0],
      });
    });
  });
};

// Update an expense category
export const updateExpenseCategory = (categoryId, updatedData) => {
  return new Promise((resolve, reject) => {
    const { title, deleted = 0 } = updatedData;

    const query = `
      UPDATE _expense_categories 
      SET title = ?, deleted = ?
      WHERE id = ?
    `;

    const values = [title, deleted, categoryId];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("❌ Error updating expense category:", err);
        return reject({ message: "Error updating expense category", error: err });
      }

      resolve({
        success: true,
        message: "Expense category updated successfully",
      });
    });
  });
};

// Soft delete an expense category
export const deleteExpenseCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE _expense_categories SET deleted = 1 WHERE id = ?';

    db.query(query, [categoryId], (err, result) => {
      if (err) {
        console.error("❌ Error deleting expense category:", err);
        return reject({ message: "Error deleting expense category", error: err });
      }

      resolve({
        success: true,
        message: "Expense category deleted successfully",
      });
    });
  });
};