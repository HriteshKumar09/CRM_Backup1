import db from "../config/db.js";

// Create Estimate Form
export const createEstimateForm = (formData) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO _estimate_forms (title, description, status, assigned_to, public, enable_attachment, deleted)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            formData.title,
            formData.description,
            formData.status,
            formData.assigned_to,
            formData.public || 0,
            formData.enable_attachment || 0,
            0 // deleted default to 0
        ];

        db.query(query, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Get All Active Forms
export const getAllEstimateForms = () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM _estimate_forms WHERE deleted = 0";
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Get Single Form by ID
export const getEstimateFormById = (id) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM _estimate_forms WHERE id = ? AND deleted = 0";
        db.query(query, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0] || null);
        });
    });
};

// Update Form
export const updateEstimateForm = (id, formData) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE _estimate_forms 
            SET title = ?, description = ?, status = ?, assigned_to = ?, public = ?, enable_attachment = ?
            WHERE id = ? AND deleted = 0
        `;
        const values = [
            formData.title,
            formData.description,
            formData.status,
            formData.assigned_to,
            formData.public || 0,
            formData.enable_attachment || 0,
            id
        ];
        db.query(query, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Soft Delete Form
export const deleteEstimateForm = (id) => {
    return new Promise((resolve, reject) => {
        const query = "UPDATE _estimate_forms SET deleted = 1 WHERE id = ?";
        db.query(query, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};


{/*Estimate Requests */}
// ➕ Create New Estimate Request
export const createEstimateRequest = (requestData) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO _estimate_requests (
                estimate_form_id, created_by, created_at, client_id, lead_id, 
                assigned_to, status, files, deleted
            ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, 0)
        `;

        const values = [
            requestData.estimate_form_id,
            requestData.created_by,
            requestData.client_id,
            requestData.lead_id,
            requestData.assigned_to,
            requestData.status || 'new',
            requestData.files || '',
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ Error creating estimate request:", err);
                return reject(err);
            }
            resolve({ success: true, requestId: result.insertId });
        });
    });
};

// 📄 Get Single Estimate Request By ID
export const getEstimateRequestById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM _estimate_requests WHERE id = ? AND deleted = 0`;
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error("❌ Error fetching estimate request:", err);
                return reject(err);
            }
            resolve(results[0] || null);
        });
    });
};

// 📋 Get All Estimate Requests (with optional filters)
export const getAllEstimateRequests = (filters = {}) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM _estimate_requests WHERE deleted = 0`;
        const values = [];

        if (filters.client_id) {
            query += ` AND client_id = ?`;
            values.push(filters.client_id);
        }

        if (filters.assigned_to) {
            query += ` AND assigned_to = ?`;
            values.push(filters.assigned_to);
        }

        db.query(query, values, (err, results) => {
            if (err) {
                console.error("❌ Error fetching estimate requests:", err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

// ✏️ Update Estimate Request
export const updateEstimateRequest = (id, updateData) => {
    return new Promise((resolve, reject) => {
        const allowedFields = [
            'estimate_form_id', 'client_id', 'lead_id', 'assigned_to',
            'status', 'files'
        ];
        const fieldsToUpdate = [];
        const values = [];

        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                fieldsToUpdate.push(`${field} = ?`);
                values.push(updateData[field]);
            }
        });

        if (fieldsToUpdate.length === 0) {
            return reject(new Error("No valid fields to update."));
        }

        const query = `UPDATE _estimate_requests SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
        values.push(id);

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ Error updating estimate request:", err);
                return reject(err);
            }
            resolve({ success: true, message: "Estimate request updated successfully" });
        });
    });
};

// 🗑️ Soft Delete Estimate Request
export const deleteEstimateRequest = (id) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE _estimate_requests SET deleted = 1 WHERE id = ?`;
        db.query(query, [id], (err, result) => {
            if (err) {
                console.error("❌ Error deleting estimate request:", err);
                return reject(err);
            }
            resolve({ success: true, message: "Estimate request deleted successfully" });
        });
    });
};


{/*Estimates */}
// Function to create a new estimate
export const createEstimate = (requestData) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO _estimates (
          client_id, estimate_request_id, estimate_date, valid_until, note, last_email_sent_date, status,
          tax_id, tax_id2, discount_type, discount_amount, discount_amount_type, project_id,
          accepted_by, meta_data, created_by, signature, public_key, company_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      const values = [
        requestData.client_id,
        requestData.estimate_request_id,
        requestData.estimate_date,
        requestData.valid_until,
        requestData.note || null,
        requestData.last_email_sent_date || null, // Add this field
        requestData.status || 'draft',
        requestData.tax_id || 0,
        requestData.tax_id2 || 0,
        requestData.discount_type || 'before_tax',
        requestData.discount_amount || 0,
        requestData.discount_amount_type || 'percentage',
        requestData.project_id || 0,
        requestData.accepted_by || 0,
        requestData.meta_data || '',
        requestData.created_by,
        requestData.signature || '',
        requestData.public_key || '',
        requestData.company_id || 0
      ];
  
      db.query(query, values, (err, result) => {
        if (err) {
          console.error(err);
          return reject(new Error("Failed to create estimate"));
        }
        resolve(result);
      });
    });
  };
  
  // Function to fetch all estimates
  export const getEstimates = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM _estimates WHERE deleted = 0'; // Only non-deleted estimates
      db.query(query, (err, results) => {
        if (err) {
          console.error(err);
          reject(new Error("Failed to fetch estimates"));
        } else {
          resolve(results);
        }
      });
    });
  };
  
  // Function to fetch an estimate by ID
  export const getEstimateById = (estimateId) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM _estimates WHERE id = ? AND deleted = 0'; // Only active estimates
      db.query(query, [estimateId], (err, results) => {
        if (err) {
          console.error(err);
          reject(new Error("Failed to fetch estimate"));
        } else {
          resolve(results[0]); // Return the first result (estimate)
        }
      });
    });
  };
  
  // Function to update an existing estimate
  export const updateEstimate = (estimateId, requestData) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE _estimates SET
          client_id = ?, estimate_request_id = ?, estimate_date = ?, valid_until = ?, 
          note = ?, last_email_sent_date = ?, status = ?, tax_id = ?, tax_id2 = ?, 
          discount_type = ?, discount_amount = ?, discount_amount_type = ?, project_id = ?, 
          accepted_by = ?, meta_data = ?, created_by = ?, signature = ?, 
          public_key = ?, company_id = ?
        WHERE id = ?
      `;
  
      const values = [
        requestData.client_id,
        requestData.estimate_request_id,
        requestData.estimate_date,
        requestData.valid_until,
        requestData.note || null,
        requestData.last_email_sent_date || null, // Add this field
        requestData.status || 'draft',
        requestData.tax_id || 0,
        requestData.tax_id2 || 0,
        requestData.discount_type || 'before_tax',
        requestData.discount_amount || 0,
        requestData.discount_amount_type || 'percentage',
        requestData.project_id || 0,
        requestData.accepted_by || 0,
        requestData.meta_data || '',
        requestData.created_by,
        requestData.signature || '',
        requestData.public_key || '',
        requestData.company_id || 0,
        estimateId
      ];
  
      db.query(query, values, (err, result) => {
        if (err) {
          console.error(err);
          return reject(new Error("Failed to update estimate"));
        }
        resolve(result);
      });
    });
  };
  

  // Soft delete an estimate
  export const deleteEstimate = (estimateId) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE _estimates SET deleted = 1 WHERE id = ?';
      db.query(query, [estimateId], (err, result) => {
        if (err) {
          console.error(err);
          return reject(new Error("Failed to delete estimate"));
        }
        resolve(result);
      });
    });
  };


  {/*Estimate Items */}
// Create new estimate item
export const createEstimateItem = (itemData) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO _estimate_items (
                title, description, quantity, unit_type, rate, total, sort, 
                estimate_id, item_id, deleted
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            itemData.title || '',
            itemData.description || '',
            itemData.quantity || 1,
            itemData.unit_type || 'unit',
            itemData.rate || 0,
            itemData.total || 0,
            itemData.sort || 0,
            itemData.estimate_id || null,
            itemData.item_id || 0,
            0 // deleted = 0 by default
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ Error creating estimate item:", err);
                return reject(err);
            }
            resolve({
                success: true,
                data: {
                    id: result.insertId,
                    ...itemData
                }
            });
        });
    });
};

// Get all items for specific estimate
export const getAllEstimateItems = (estimate_id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM _estimate_items WHERE estimate_id = ? AND deleted = 0`;
        db.query(query, [estimate_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Update estimate item
export const updateEstimateItem = (id, itemData) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE _estimate_items SET 
                title = ?, description = ?, quantity = ?, unit_type = ?, 
                rate = ?, total = ?, sort = ?, item_id = ?
            WHERE id = ? AND deleted = 0
        `;

        const values = [
            itemData.title || '',
            itemData.description || '',
            itemData.quantity || 1,
            itemData.unit_type || 'unit',
            itemData.rate || 0,
            itemData.total || 0,
            itemData.sort || 0,
            itemData.item_id || 0,
            id
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ Error updating estimate item:", err);
                return reject(err);
            }
            resolve({
                success: true,
                message: "Estimate item updated successfully"
            });
        });
    });
};

// Soft delete estimate item
export const deleteEstimateItem = (id) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE _estimate_items SET deleted = 1 WHERE id = ?`;
        db.query(query, [id], (err, result) => {
            if (err) return reject(err);
            resolve({
                success: true,
                message: "Estimate item deleted successfully"
            });
        });
    });
};

///////////////////////
{/*Estimate Comments */}
//////////////////////
// Create Comment
export const createComment = (commentData) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO _estimate_comments (created_by, created_at, description, estimate_id, files, deleted)
            VALUES (?, NOW(), ?, ?, ?, 0)
        `;

        const values = [
            commentData.created_by,
            commentData.description,
            commentData.estimate_id,
            commentData.files || null
        ];

        db.query(query, values, (err, result) => {
            if (err) return reject(err);
            resolve({
                success: true,
                data: { id: result.insertId, ...commentData }
            });
        });
    });
};

// Get Comments for Specific Estimate
export const getCommentsByEstimate = (estimate_id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM _estimate_comments WHERE estimate_id = ? AND deleted = 0`;
        db.query(query, [estimate_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Update Comment
export const updateComment = (id, commentData) => {
  return new Promise((resolve, reject) => {
      const updateQuery = `
          UPDATE _estimate_comments 
          SET description = ?, files = ? 
          WHERE id = ? AND deleted = 0
      `;

      const values = [
          commentData.description,
          commentData.files || null,
          id
      ];

      db.query(updateQuery, values, (err) => {
          if (err) return reject(err);

          // After update, fetch the updated comment
          const fetchQuery = `SELECT * FROM _estimate_comments WHERE id = ? AND deleted = 0`;
          db.query(fetchQuery, [id], (err, results) => {
              if (err) return reject(err);
              if (results.length === 0) return resolve({ success: false, message: "Comment not found" });

              resolve({ success: true, data: results[0] });  // Return updated comment
          });
      });
  });
};


// Soft Delete Comment
export const deleteComment = (id) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE _estimate_comments SET deleted = 1 WHERE id = ?`;
        db.query(query, [id], (err) => {
            if (err) return reject(err);
            resolve({ success: true, message: "Comment deleted successfully" });
        });
    });
};



///////////////
{/*Proposal Models */}
///////////////
{/* Proposals */}
// ➕ Create New Proposal
export const createProposal = (proposalData) => {
  return new Promise((resolve, reject) => {
      const query = `
          INSERT INTO _proposals (
              client_id, proposal_date, valid_until, note, 
              last_email_sent_date, status, tax_id, tax_id2, 
              discount_type, discount_amount, discount_amount_type, 
              content, public_key, accepted_by, meta_data, company_id, deleted
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `;

      const values = [
          proposalData.client_id,
          proposalData.proposal_date,
          proposalData.valid_until,
          proposalData.note || null,
          proposalData.last_email_sent_date || null,
          proposalData.status || 'draft',
          proposalData.tax_id || 0,
          proposalData.tax_id2 || 0,
          proposalData.discount_type,
          proposalData.discount_amount,
          proposalData.discount_amount_type,
          proposalData.content,
          proposalData.public_key,
          proposalData.accepted_by || 0,
          proposalData.meta_data || '',
          proposalData.company_id || 0
      ];

      db.query(query, values, (err, result) => {
          if (err) {
              console.error("❌ Error creating proposal:", err);
              return reject(err);
          }
          resolve({ success: true, proposalId: result.insertId });
      });
  });
};

// 📄 Get Single Proposal By ID
export const getProposalById = (id) => {
  return new Promise((resolve, reject) => {
      const query = `SELECT * FROM _proposals WHERE id = ? AND deleted = 0`;
      db.query(query, [id], (err, results) => {
          if (err) {
              console.error("❌ Error fetching proposal:", err);
              return reject(err);
          }
          resolve(results[0] || null);
      });
  });
};

// 📝 Update Proposal
export const updateProposal = (id, proposalData) => {
  return new Promise((resolve, reject) => {
      const query = `
          UPDATE _proposals
          SET client_id = ?, proposal_date = ?, valid_until = ?, note = ?, 
              last_email_sent_date = ?, status = ?, tax_id = ?, tax_id2 = ?, 
              discount_type = ?, discount_amount = ?, discount_amount_type = ?, 
              content = ?, public_key = ?, accepted_by = ?, meta_data = ?, company_id = ?
          WHERE id = ? AND deleted = 0
      `;

      const values = [
          proposalData.client_id,
          proposalData.proposal_date,
          proposalData.valid_until,
          proposalData.note || null,
          proposalData.last_email_sent_date || null,
          proposalData.status,
          proposalData.tax_id || 0,
          proposalData.tax_id2 || 0,
          proposalData.discount_type,
          proposalData.discount_amount,
          proposalData.discount_amount_type,
          proposalData.content,
          proposalData.public_key,
          proposalData.accepted_by || 0,
          proposalData.meta_data || '',
          proposalData.company_id || 0,
          id
      ];

      db.query(query, values, (err, result) => {
          if (err) {
              console.error("❌ Error updating proposal:", err);
              return reject(err);
          }
          resolve({ success: true });
      });
  });
};

// 🗑️ Soft Delete Proposal (Mark as Deleted)
export const deleteProposal = (id) => {
  return new Promise((resolve, reject) => {
      const query = `UPDATE _proposals SET deleted = 1 WHERE id = ?`;
      db.query(query, [id], (err, result) => {
          if (err) {
              console.error("❌ Error deleting proposal:", err);
              return reject(err);
          }
          resolve({ success: true });
      });
  });
};

// 📋 List All Proposals
export const getAllProposals = () => {
  return new Promise((resolve, reject) => {
      const query = `SELECT * FROM _proposals WHERE deleted = 0 ORDER BY proposal_date DESC`;
      db.query(query, (err, results) => {
          if (err) {
              console.error("❌ Error fetching proposals:", err);
              return reject(err);
          }
          resolve(results);
      });
  });
};


///////////////////////
{/*Proposal Items */}
//////////////////////

// 📄 Get all items for a specific proposal
export const getProposalItemsByProposalId = (proposalId) => {
  return new Promise((resolve, reject) => {
      const query = `SELECT * FROM _proposal_items WHERE proposal_id = ? AND deleted = 0`;
      db.query(query, [proposalId], (err, results) => {
          if (err) return reject(err);
          resolve(results);
      });
  });
};

// ➕ Add a new item to a proposal
export const createProposalItem = (proposalId, itemData) => {
  return new Promise((resolve, reject) => {
      const query = `
          INSERT INTO _proposal_items (
              title, description, quantity, unit_type, rate, total, sort, proposal_id, item_id, deleted
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `;

      const values = [
          itemData.title,
          itemData.description,
          itemData.quantity,
          itemData.unit_type,
          itemData.rate,
          itemData.total,
          itemData.sort || 0,
          proposalId,
          itemData.item_id || 0
      ];

      db.query(query, values, (err, result) => {
          if (err) return reject(err);
          resolve({ success: true, itemId: result.insertId });
      });
  });
};

// ✏️ Update an existing proposal item
export const updateProposalItem = (itemId, itemData) => {
  return new Promise((resolve, reject) => {
      const query = `
          UPDATE _proposal_items 
          SET title = ?, description = ?, quantity = ?, unit_type = ?, 
              rate = ?, total = ?, sort = ?, item_id = ? 
          WHERE id = ? AND deleted = 0
      `;

      const values = [
          itemData.title,
          itemData.description,
          itemData.quantity,
          itemData.unit_type,
          itemData.rate,
          itemData.total,
          itemData.sort || 0,
          itemData.item_id || 0,
          itemId
      ];

      db.query(query, values, (err, result) => {
          if (err) return reject(err);
          resolve({ success: true });
      });
  });
};

// 🗑️ Soft delete an item
export const deleteProposalItem = (itemId) => {
  return new Promise((resolve, reject) => {
      const query = `UPDATE _proposal_items SET deleted = 1 WHERE id = ?`;
      db.query(query, [itemId], (err, result) => {
          if (err) return reject(err);
          resolve({ success: true });
      });
  });
};


///////////////////////
{/* Proposal Templates */}
///////////////////////

// 📄 Get a single proposal template by ID
export const getProposalTemplateById = (templateId) => {
  return new Promise((resolve, reject) => {
      const query = `SELECT * FROM _proposal_templates WHERE id = ? AND deleted = 0`;
      db.query(query, [templateId], (err, results) => {
          if (err) return reject(err);
          resolve(results[0] || null);
      });
  });
};

// ✏️ Update an existing proposal template
export const updateProposalTemplate = (templateId, templateData) => {
  return new Promise((resolve, reject) => {
      const query = `UPDATE _proposal_templates SET title = ?, template = ? WHERE id = ? AND deleted = 0`;
      db.query(query, [templateData.title, templateData.template, templateId], (err, result) => {
          if (err) return reject(err);
          resolve({ success: true });
      });
  });
};

// 🗑️ Soft delete a proposal template
export const deleteProposalTemplate = (templateId) => {
  return new Promise((resolve, reject) => {
      const query = `UPDATE _proposal_templates SET deleted = 1 WHERE id = ?`;
      db.query(query, [templateId], (err, result) => {
          if (err) return reject(err);
          resolve({ success: true });
      });
  });
};