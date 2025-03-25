import db from "../config/db.js";

// Get all payment methods
export const getPaymentMethods = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, title, type, description, online_payable, available_on_invoice, 
             minimum_payment_amount, settings, sort 
      FROM _payment_methods 
      WHERE deleted = 0 
      ORDER BY sort ASC, id DESC`;

    console.log('Executing query:', query); // Debug log

    db.query(query, (err, result) => {
      if (err) {
        console.error("❌ Error fetching payment methods:", err);
        return reject(err);
      }
      console.log('Payment methods fetched:', result); // Debug log
      resolve(result);
    });
  });
};

// Create a new payment method
export const createPaymentMethod = (data) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _payment_methods (
        title, type, description, online_payable, available_on_invoice,
        minimum_payment_amount, settings, sort, deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`;

    const values = [
      data.title,
      data.type || 'custom',
      data.description,
      data.online_payable ? 1 : 0,
      data.available_on_invoice ? 1 : 0,
      data.minimum_payment_amount || 0,
      data.settings || '',
      data.sort || 0
    ];

    console.log('Creating payment method with values:', values); // Debug log

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("❌ Error creating payment method:", err);
        return reject(err);
      }

      // Fetch the newly created payment method
      const selectQuery = `
        SELECT id, title, type, description, online_payable, available_on_invoice,
               minimum_payment_amount, settings, sort 
        FROM _payment_methods 
        WHERE id = ?`;

      db.query(selectQuery, [result.insertId], (err, rows) => {
        if (err) {
          console.error("❌ Error fetching created payment method:", err);
          return reject(err);
        }
        console.log('Created payment method:', rows[0]); // Debug log
        resolve(rows[0]);
      });
    });
  });
};

// Update a payment method
export const updatePaymentMethod = (id, data) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _payment_methods 
      SET title = ?, 
          type = ?,
          description = ?,
          online_payable = ?,
          available_on_invoice = ?,
          minimum_payment_amount = ?,
          settings = ?,
          sort = ?
      WHERE id = ? AND deleted = 0`;

    const values = [
      data.title,
      data.type || 'custom',
      data.description,
      data.online_payable ? 1 : 0,
      data.available_on_invoice ? 1 : 0,
      data.minimum_payment_amount || 0,
      data.settings || '',
      data.sort || 0,
      id
    ];

    console.log('Updating payment method with values:', values); // Debug log

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("❌ Error updating payment method:", err);
        return reject(err);
      }

      if (result.affectedRows === 0) {
        return reject(new Error('Payment method not found'));
      }

      // Fetch the updated payment method
      const selectQuery = `
        SELECT id, title, type, description, online_payable, available_on_invoice,
               minimum_payment_amount, settings, sort 
        FROM _payment_methods 
        WHERE id = ?`;

      db.query(selectQuery, [id], (err, rows) => {
        if (err) {
          console.error("❌ Error fetching updated payment method:", err);
          return reject(err);
        }
        console.log('Updated payment method:', rows[0]); // Debug log
        resolve(rows[0]);
      });
    });
  });
};

// Delete a payment method (soft delete)
export const deletePaymentMethod = (id) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE _payment_methods SET deleted = 1 WHERE id = ?`;

    console.log('Deleting payment method with ID:', id); // Debug log

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("❌ Error deleting payment method:", err);
        return reject(err);
      }

      if (result.affectedRows === 0) {
        return reject(new Error('Payment method not found'));
      }

      console.log('Payment method deleted successfully'); // Debug log
      resolve({ success: true });
    });
  });
}; 