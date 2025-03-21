import db from "../config/db.js";  // Import the database connection

// // _expense_categories model
// // Fetching categories model
// export const getCategories = () => {
//   return new Promise((resolve, reject) => {
//     const query = `SELECT id, title FROM _expense_categories WHERE deleted = 0`; // Query to fetch non-deleted categories

//     db.query(query, (err, result) => {
//       if (err) {
//         console.error("❌ Error fetching categories:", err);
//         return reject(err); // Reject if there's an error
//       }

//       resolve({
//         success: true, // Return success flag
//         data: result   // Return the categories data
//       });
//     });
//   });
// };



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