import db from "../config/db.js";

// Helper function to format dates
const formatDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d) ? d.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
};

// Helper function to validate client data
const validateClientData = (clientData) => {
  if (!clientData.company_name) throw new Error("Company name is required");
  if (!clientData.type) throw new Error("Client type is required");
  // ...additional validation logic...
};

// Function to create a new client
export const createClient = (clientData) => {
  return new Promise((resolve, reject) => {
    try {
      validateClientData(clientData);
      const query = `
        INSERT INTO _clients (
          company_name, type, address, city, state, zip, country, created_date, website, phone,
          currency_symbol, starred_by, group_ids, deleted, is_lead, lead_status_id, owner_id, created_by,
          sort, lead_source_id, last_lead_status, client_migration_date, vat_number, gst_number,
          stripe_customer_id, stripe_card_ending_digit, currency, disable_online_payment, labels,
          from_ma_form_id, ma_point, ma_unsubscribed, client_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        clientData.company_name || '', // NOT NULL
        clientData.type || 'organization', // NOT NULL, default 'organization'
        clientData.address || null,
        clientData.city || null,
        clientData.state || null,
        clientData.zip || null,
        clientData.country || null,
        formatDate(clientData.created_date || new Date()), // NOT NULL
        clientData.website || null,
        clientData.phone || null,
        clientData.currency_symbol || null,
        clientData.starred_by || '', // NOT NULL
        clientData.group_ids || '', // NOT NULL
        clientData.deleted || 0, // NOT NULL, default 0
        clientData.is_lead || 0, // NOT NULL, default 0
        clientData.lead_status_id || 0, // NOT NULL, default 0
        clientData.owner_id || 0, // NOT NULL, default 0
        clientData.created_by || 0, // NOT NULL, default 0
        clientData.sort || 0, // NOT NULL, default 0
        clientData.lead_source_id || 0, // NOT NULL, default 0
        clientData.last_lead_status || '', // NOT NULL
        formatDate(clientData.client_migration_date || new Date()), // NOT NULL
        clientData.vat_number || null,
        clientData.gst_number || null,
        clientData.stripe_customer_id || '', // NOT NULL
        clientData.stripe_card_ending_digit || 0, // NOT NULL, default 0
        clientData.currency || null,
        clientData.disable_online_payment || 0, // NOT NULL, default 0
        clientData.labels || '', // NOT NULL
        clientData.from_ma_form_id || 0, // NOT NULL, default 0
        clientData.ma_point || 0, // NOT NULL, default 0
        clientData.ma_unsubscribed || 0, // NOT NULL, default 0
        clientData.client_type || null,
      ];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error(err);
          return reject(new Error(`Failed to create client: ${err.message}`));
        }
        resolve(result);
      });
    } catch (error) {
      console.error(error);
      reject(new Error(`Error: ${error.message}`));
    }
  });
};


// Function to fetch all clients
export const getClients = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM _clients WHERE deleted = 0';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        reject(new Error("Failed to fetch clients"));
      } else {
        resolve(results);
      }
    });
  });
};

// Update an existing client
export const updateClient = (clientId, clientData) => {
  return new Promise((resolve, reject) => {
    try {
      validateClientData(clientData);
      const query = `
        UPDATE _clients SET
          company_name = ?, type = ?, address = ?, city = ?, state = ?, zip = ?, 
          country = ?, created_date = ?, website = ?, phone = ?, currency_symbol = ?, 
          starred_by = ?, group_ids = ?, deleted = ?, is_lead = ?, lead_status_id = ?, 
          owner_id = ?, created_by = ?, sort = ?, lead_source_id = ?, last_lead_status = ?, 
          client_migration_date = ?, vat_number = ?, gst_number = ?, stripe_customer_id = ?, 
          stripe_card_ending_digit = ?, currency = ?, disable_online_payment = ?, labels = ?, 
          from_ma_form_id = ?, ma_point = ?, ma_unsubscribed = ?, client_type = ?
        WHERE id = ?
      `;

      const values = [
        clientData.company_name || '',
        clientData.type || 'organization',
        clientData.address || null,
        clientData.city || null,
        clientData.state || null,
        clientData.zip || null,
        clientData.country || null,
        formatDate(clientData.created_date || new Date()),
        clientData.website || null,
        clientData.phone || null,
        clientData.currency_symbol || null,
        clientData.starred_by || '',
        clientData.group_ids || '',
        clientData.deleted || 0,
        clientData.is_lead || 0,
        clientData.lead_status_id || 0,
        clientData.owner_id || 0,
        clientData.created_by || 0,
        clientData.sort || 0,
        clientData.lead_source_id || 0,
        clientData.last_lead_status || '',
        formatDate(clientData.client_migration_date || new Date()),
        clientData.vat_number || null,
        clientData.gst_number || null,
        clientData.stripe_customer_id || '',
        clientData.stripe_card_ending_digit || 0,
        clientData.currency || null,
        clientData.disable_online_payment || 0,
        clientData.labels || '',
        clientData.from_ma_form_id || 0,
        clientData.ma_point || 0,
        clientData.ma_unsubscribed || 0,
        clientData.client_type || null,
        clientId,
      ];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error(err);
          return reject(new Error("Failed to update client"));
        }
        resolve(result);
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

// Function to fetch a client by ID
export const getClientById = (clientId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT group_ids FROM _clients WHERE id = ? AND deleted = 0';  // Ensure only necessary fields are selected
    db.query(query, [clientId], (err, results) => {
      if (err) {
        console.error("Database error", err);
        reject(new Error("Error while fetching client"));
      } else if (results.length === 0) {
        reject(new Error("Client not found"));
      } else {
        resolve(results[0]);  // Only returning group_ids
      }
    });
  });
};

// Soft delete a client
export const deleteClient = (clientId) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE _clients SET deleted = 1 WHERE id = ?';
    db.query(query, [clientId], (err, result) => {
      if (err) {
        console.error(err);
        return reject(new Error("Failed to delete client"));
      }
      resolve(result);
    });
  });
};

////////////
// Function to fetch all clients in a group
///////////


// Helper function to update client groups
const updateClientGroups = (clientId, groupIds) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE _clients SET group_ids = ? WHERE id = ?';
    db.query(query, [groupIds.join(','), clientId], (err, result) => {
      if (err) {
        console.error(err);
        reject(new Error("Failed to update client groups"));
      } else {
        resolve(result);
      }
    });
  });
};

// Function to add a client to a group
export const addClientToGroup = (clientId, groupId) => {
  return new Promise((resolve, reject) => {
    getClientById(clientId)
      .then(client => {
        const currentGroups = client.group_ids ? client.group_ids.split(',') : [];

        // If groupId is not already associated, add it
        if (!currentGroups.includes(groupId.toString())) {
          currentGroups.push(groupId.toString());

          // Update the client's group_ids
          updateClientGroups(clientId, currentGroups)
            .then(() => resolve({ message: 'Client added to group successfully' }))
            .catch(err => reject(err));
        } else {
          resolve({ message: 'Client is already in this group' });
        }
      })
      .catch(err => reject(err));
  });
};

// Function to remove a client from a group
export const removeClientFromGroup = (clientId, groupId) => {
  return new Promise((resolve, reject) => {
    getClientById(clientId)
      .then(client => {
        const currentGroups = client.group_ids ? client.group_ids.split(',') : [];

        // If the groupId is not part of the current groups, reject
        if (!currentGroups.includes(groupId.toString())) {
          return reject(new Error('Client is not part of this group'));
        }

        // Remove the groupId from the array
        const updatedGroups = currentGroups.filter(group => group !== groupId.toString());

        // Update the client's group_ids in the database
        updateClientGroups(clientId, updatedGroups)
          .then(() => resolve({ message: 'Client removed from group successfully' }))
          .catch(err => reject(new Error(`Failed to update client groups: ${err.message}`)));
      })
      .catch(err => reject(new Error(`Failed to fetch client data: ${err.message}`)));
  });
};


// Function to move a client from one group to another
export const moveClientToAnotherGroup = async (clientId, fromGroupId, toGroupId) => {
  try {
    await removeClientFromGroup(clientId, fromGroupId);  // Remove from current group
    await addClientToGroup(clientId, toGroupId);  // Add to new group
    return { message: 'Client moved to another group successfully' };
  } catch (err) {
    throw new Error(`Failed to move client: ${err.message}`);
  }
};


// Function to soft delete a client from a group
export const softDeleteClientFromGroup = (clientId, groupId) => {
  return new Promise((resolve, reject) => {
    getClientById(clientId)
      .then(client => {
        const currentGroups = client.group_ids ? client.group_ids.split(',') : [];

        if (!currentGroups.includes(groupId.toString())) {
          return reject(new Error('Client is not in this group'));
        }

        // Remove the group from the client’s groups
        const updatedGroups = currentGroups.filter(group => group !== groupId.toString());

        updateClientGroups(clientId, updatedGroups)
          .then(() => resolve({ message: 'Client soft deleted from group successfully' }))
          .catch(err => reject(new Error(`Failed to update client groups: ${err.message}`)));
      })
      .catch(err => reject(new Error(`Failed to fetch client data: ${err.message}`)));
  });
};
