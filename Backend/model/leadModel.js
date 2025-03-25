import db from "../config/db.js"; // Import MySQL connection

// Create a new lead
export const createLead = (leadData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _leads (
        company_name, first_name, last_name, email, phone, address, city, state, zip, country, 
        created_date, website, deleted
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)
    `;

    const values = [
      leadData.company_name || '',
      leadData.first_name || '',
      leadData.last_name || '',
      leadData.email || '',
      leadData.phone || null,
      leadData.address || null,
      leadData.city || null,
      leadData.state || null,
      leadData.zip || null,
      leadData.country || null,
      leadData.website || null,
      leadData.deleted || 0 // Soft delete is 0 by default (active lead)
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error creating lead:", err);
        reject(err);
      } else {
        resolve({ success: true, lead_id: result.insertId });
      }
    });
  });
};

// Get all leads
export const getAllLeads = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM _leads WHERE deleted = 0 ORDER BY created_date DESC
    `;

    db.query(query, (err, leadsResults) => {
      if (err) {
        console.error("Error fetching leads:", err);
        reject(err);
      } else {
        resolve(leadsResults); // Return all leads
      }
    });
  });
};

// Get a single lead by ID
export const getLeadById = (leadId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM _leads WHERE id = ? AND deleted = 0
    `;

    db.query(query, [leadId], (err, result) => {
      if (err) {
        console.error("Error fetching lead by ID:", err);
        reject(err);
      } else {
        resolve(result[0] || null); // Return the lead if exists, otherwise null
      }
    });
  });
};

// Update lead details
export const updateLead = (leadId, leadData) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _leads 
      SET company_name = ?, first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, 
          city = ?, state = ?, zip = ?, country = ?, website = ? 
      WHERE id = ? AND deleted = 0
    `;

    const values = [
      leadData.company_name || '',
      leadData.first_name || '',
      leadData.last_name || '',
      leadData.email || '',
      leadData.phone || null,
      leadData.address || null,
      leadData.city || null,
      leadData.state || null,
      leadData.zip || null,
      leadData.country || null,
      leadData.website || null,
      leadId
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error updating lead:", err);
        reject(err);
      } else {
        resolve({ success: true, affectedRows: result.affectedRows });
      }
    });
  });
};

// Soft delete a lead (Mark as deleted)
export const deleteLead = (leadId) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _leads SET deleted = 1 WHERE id = ?
    `;

    db.query(query, [leadId], (err, result) => {
      if (err) {
        console.error("Error deleting lead:", err);
        reject(err);
      } else {
        resolve({ success: true, affectedRows: result.affectedRows });
      }
    });
  });
};

// Lead Source CRUD Operations
export const createLeadSource = (sourceData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _lead_source (title, sort, deleted)
      VALUES (?, (SELECT COALESCE(MAX(sort), 0) + 1 FROM _lead_source ls), 0)
    `;

    db.query(query, [sourceData.title], (err, result) => {
      if (err) {
        console.error("Error creating lead source:", err);
        reject(err);
      } else {
        resolve({
          success: true,
          sourceId: result.insertId
        });
      }
    });
  });
};

export const getAllLeadSources = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM _lead_source WHERE deleted = 0 ORDER BY sort ASC';

    db.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching lead sources:", err);
        reject(err);
      } else {
        resolve({
          success: true,
          data: result
        });
      }
    });
  });
};

export const updateLeadSource = (sourceId, sourceData) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE _lead_source SET title = ? WHERE id = ? AND deleted = 0';

    db.query(query, [sourceData.title, sourceId], (err, result) => {
      if (err) {
        console.error("Error updating lead source:", err);
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

export const deleteLeadSource = (sourceId) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE _lead_source SET deleted = 1 WHERE id = ?';

    db.query(query, [sourceId], (err, result) => {
      if (err) {
        console.error("Error deleting lead source:", err);
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

// Lead Status CRUD Operations
export const createLeadStatus = (statusData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _lead_status (title, color, sort, deleted)
      VALUES (?, ?, (SELECT COALESCE(MAX(sort), 0) + 1 FROM _lead_status ls), 0)
    `;

    db.query(query, [statusData.title, statusData.color], (err, result) => {
      if (err) {
        console.error("Error creating lead status:", err);
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

export const getAllLeadStatuses = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM _lead_status WHERE deleted = 0 ORDER BY sort ASC';

    db.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching lead statuses:", err);
        reject(err);
      } else {
        resolve({
          success: true,
          data: result
        });
      }
    });
  });
};

export const updateLeadStatus = (statusId, statusData) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE _lead_status SET title = ?, color = ? WHERE id = ? AND deleted = 0';

    db.query(query, [statusData.title, statusData.color, statusId], (err, result) => {
      if (err) {
        console.error("Error updating lead status:", err);
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

export const deleteLeadStatus = (statusId) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE _lead_status SET deleted = 1 WHERE id = ?';

    db.query(query, [statusId], (err, result) => {
      if (err) {
        console.error("Error deleting lead status:", err);
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
