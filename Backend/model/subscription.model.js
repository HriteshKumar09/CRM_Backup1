import db from "../config/db.js";

// Create a subscription
export const createSubscription = (subscriptionData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _subscriptions (
        title, client_id, bill_date, end_date, note, labels, status,
        payment_status, tax_id, tax_id2, repeat_every, repeat_type,
        no_of_cycles, next_recurring_date, no_of_cycles_completed,
        cancelled_at, cancelled_by, files, company_id, type,
        stripe_subscription_id, stripe_product_id, stripe_product_price_id
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    const values = [
      subscriptionData.title,
      subscriptionData.client_id,
      subscriptionData.bill_date,
      subscriptionData.end_date,
      subscriptionData.note || '',
      subscriptionData.labels || '',
      subscriptionData.status || 'draft',
      subscriptionData.payment_status || 'success',
      subscriptionData.tax_id || 0,
      subscriptionData.tax_id2 || 0,
      subscriptionData.repeat_every || 1,
      subscriptionData.repeat_type || 'days',
      subscriptionData.no_of_cycles || 0,
      subscriptionData.next_recurring_date,
      subscriptionData.no_of_cycles_completed || 0,
      subscriptionData.cancelled_at,
      subscriptionData.cancelled_by || 0,
      subscriptionData.files || 'a:0:{}',
      subscriptionData.company_id || 1,
      subscriptionData.type || 'app',
      subscriptionData.stripe_subscription_id || '',
      subscriptionData.stripe_product_id || '',
      subscriptionData.stripe_product_price_id || ''
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to create subscription',
          error: err.message
        });
      }
      
      resolve({
        success: true,
        message: 'Subscription created successfully',
        data: {
          id: result.insertId,
          ...subscriptionData
        }
      });
    });
  });
};

// Get all subscriptions
export const getSubscriptions = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        s.*,
        c.company_name as client_name,
        t1.title as tax1_title,
        t2.title as tax2_title
      FROM _subscriptions s
      LEFT JOIN _clients c ON s.client_id = c.id
      LEFT JOIN _taxes t1 ON s.tax_id = t1.id
      LEFT JOIN _taxes t2 ON s.tax_id2 = t2.id
      WHERE s.deleted = 0
      ORDER BY s.id DESC
    `;

    console.log('Executing query:', query);

    db.query(query, [], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to fetch subscriptions',
          error: err.message
        });
      }
      
      console.log('Query result:', result);
      
      resolve({
        success: true,
        data: result
      });
    });
  });
};

// Get subscription by ID
export const getSubscriptionById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        s.*,
        c.company_name as client_name,
        t1.title as tax1_title,
        t2.title as tax2_title
      FROM _subscriptions s
      LEFT JOIN _clients c ON s.client_id = c.id
      LEFT JOIN _taxes t1 ON s.tax_id = t1.id
      LEFT JOIN _taxes t2 ON s.tax_id2 = t2.id
      WHERE s.id = ? AND s.deleted = 0
    `;

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to fetch subscription',
          error: err.message
        });
      }
      
      if (result.length === 0) {
        return resolve({
          success: false,
          message: 'Subscription not found'
        });
      }
      
      resolve({
        success: true,
        data: result[0]
      });
    });
  });
};

// Update subscription
export const updateSubscription = (id, subscriptionData) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE subscriptions 
      SET title = ?,
          client_id = ?,
          bill_date = ?,
          end_date = ?,
          note = ?,
          labels = ?,
          status = ?,
          payment_status = ?,
          tax_id = ?,
          tax_id2 = ?,
          repeat_every = ?,
          repeat_type = ?,
          no_of_cycles = ?,
          next_recurring_date = ?,
          no_of_cycles_completed = ?,
          cancelled_at = ?,
          cancelled_by = ?,
          files = ?,
          company_id = ?,
          type = ?,
          stripe_subscription_id = ?,
          stripe_product_id = ?,
          stripe_product_price_id = ?
      WHERE id = ? AND deleted = 0
    `;

    const values = [
      subscriptionData.title,
      subscriptionData.client_id,
      subscriptionData.bill_date,
      subscriptionData.end_date,
      subscriptionData.note,
      subscriptionData.labels,
      subscriptionData.status,
      subscriptionData.payment_status,
      subscriptionData.tax_id,
      subscriptionData.tax_id2,
      subscriptionData.repeat_every,
      subscriptionData.repeat_type,
      subscriptionData.no_of_cycles,
      subscriptionData.next_recurring_date,
      subscriptionData.no_of_cycles_completed,
      subscriptionData.cancelled_at,
      subscriptionData.cancelled_by,
      subscriptionData.files,
      subscriptionData.company_id,
      subscriptionData.type,
      subscriptionData.stripe_subscription_id,
      subscriptionData.stripe_product_id,
      subscriptionData.stripe_product_price_id,
      id
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to update subscription',
          error: err.message
        });
      }
      
      if (result.affectedRows === 0) {
        return resolve({
          success: false,
          message: 'Subscription not found'
        });
      }
      
      resolve({
        success: true,
        message: 'Subscription updated successfully',
        data: {
          id,
          ...subscriptionData
        }
      });
    });
  });
};

// Delete subscription (soft delete)
export const deleteSubscription = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE subscriptions 
      SET deleted = 1 
      WHERE id = ?
    `;

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to delete subscription',
          error: err.message
        });
      }
      
      if (result.affectedRows === 0) {
        return resolve({
          success: false,
          message: 'Subscription not found'
        });
      }
      
      resolve({
        success: true,
        message: 'Subscription deleted successfully'
      });
    });
  });
};

// Get subscription items
export const getSubscriptionItems = (subscriptionId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        si.*,
        i.title as item_title,
        i.description as item_description
      FROM _subscription_items si
      LEFT JOIN _items i ON si.item_id = i.id
      WHERE si.subscription_id = ? AND si.deleted = 0
      ORDER BY si.sort ASC
    `;

    db.query(query, [subscriptionId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to fetch subscription items',
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

// Add subscription item
export const addSubscriptionItem = (subscriptionId, itemData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _subscription_items (
        title, description, quantity, unit_type, rate, total,
        sort, subscription_id, item_id
      ) VALUES (?,?,?,?,?,?,?,?,?)
    `;

    const values = [
      itemData.title,
      itemData.description,
      itemData.quantity,
      itemData.unit_type,
      itemData.rate,
      itemData.total,
      itemData.sort || 0,
      subscriptionId,
      itemData.item_id
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to add subscription item',
          error: err.message
        });
      }
      
      resolve({
        success: true,
        message: 'Subscription item added successfully',
        data: {
          id: result.insertId,
          ...itemData
        }
      });
    });
  });
};

// Update subscription item
export const updateSubscriptionItem = (itemId, itemData) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _subscription_items 
      SET title = ?,
          description = ?,
          quantity = ?,
          unit_type = ?,
          rate = ?,
          total = ?,
          sort = ?,
          item_id = ?
      WHERE id = ? AND deleted = 0
    `;

    const values = [
      itemData.title,
      itemData.description,
      itemData.quantity,
      itemData.unit_type,
      itemData.rate,
      itemData.total,
      itemData.sort,
      itemData.item_id,
      itemId
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to update subscription item',
          error: err.message
        });
      }
      
      if (result.affectedRows === 0) {
        return resolve({
          success: false,
          message: 'Subscription item not found'
        });
      }
      
      resolve({
        success: true,
        message: 'Subscription item updated successfully',
        data: {
          id: itemId,
          ...itemData
        }
      });
    });
  });
};

// Delete subscription item (soft delete)
export const deleteSubscriptionItem = (itemId) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _subscription_items 
      SET deleted = 1 
      WHERE id = ?
    `;

    db.query(query, [itemId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to delete subscription item',
          error: err.message
        });
      }
      
      if (result.affectedRows === 0) {
        return resolve({
          success: false,
          message: 'Subscription item not found'
        });
      }
      
      resolve({
        success: true,
        message: 'Subscription item deleted successfully'
      });
    });
  });
}; 