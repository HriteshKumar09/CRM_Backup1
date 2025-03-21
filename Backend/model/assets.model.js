import db from "../config/db.js";

// Creating a new asset
export const createAsset = (assetData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _assets (
        asset_code, asset_name, quantity, amount, unit_id, group_id, location_id, 
        series, purchase_date, warranty_period, unit_price, depreciation, 
        supplier_name, supplier_address, supplier_phone, description, files, 
        status, total_allocation, total_lost, total_liquidation, total_damages, 
        total_warranty, added_by, created_date, deleted
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
    `;

    const values = [
      assetData.asset_code || '',
      assetData.asset_name || '',
      assetData.quantity || 0,
      assetData.amount || 0,
      assetData.unit_id || null,
      assetData.group_id || null,
      assetData.location_id || null,
      assetData.series || '',
      assetData.purchase_date || null,
      assetData.warranty_period || 0,
      assetData.unit_price || 0,
      assetData.depreciation || 0,
      assetData.supplier_name || '',
      assetData.supplier_address || '',
      assetData.supplier_phone || '',
      assetData.description || '',
      assetData.files || '',
      assetData.status || 1,
      assetData.total_allocation || 0,
      assetData.total_lost || 0,
      assetData.total_liquidation || 0,
      assetData.total_damages || 0,
      assetData.total_warranty || 0,
      assetData.added_by || 1,  // Default to Admin if not provided
      assetData.created_date || new Date(),
      assetData.deleted || 0
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('❌ Error creating asset:', err);
        return reject(err);
      }

      resolve({
        success: true,
        data: {
          id: result.insertId,
          ...assetData
        }
      });
    });
  });
};

// Get all assets
export const getAllAssets = (limit = 10, offset = 0) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM _assets WHERE deleted = 0 LIMIT ? OFFSET ?`;
    db.query(query, [limit, offset], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Get a specific asset by ID
export const getAssetById = (assetId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM _assets WHERE id = ? AND deleted = 0`;
    db.query(query, [assetId], (err, result) => {
      if (err) return reject(err);
      if (!result.length) {
        return reject(new Error('Asset not found'));
      }
      resolve(result[0]); // Return the asset if found
    });
  });
};

// Update an asset
export const updateAsset = (assetId, assetData) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _assets SET 
        asset_code = ?, asset_name = ?, quantity = ?, amount = ?, unit_id = ?, 
        group_id = ?, location_id = ?, series = ?, purchase_date = ?, warranty_period = ?, 
        unit_price = ?, depreciation = ?, supplier_name = ?, supplier_address = ?, 
        supplier_phone = ?, description = ?, files = ?, status = ?, total_allocation = ?, 
        total_lost = ?, total_liquidation = ?, total_damages = ?, total_warranty = ?, 
        added_by = ?, created_date = ?, deleted = ? 
      WHERE id = ?
    `;

    const values = [
      assetData.asset_code,
      assetData.asset_name,
      assetData.quantity,
      assetData.amount,
      assetData.unit_id,
      assetData.group_id,
      assetData.location_id,
      assetData.series,
      assetData.purchase_date,
      assetData.warranty_period,
      assetData.unit_price,
      assetData.depreciation,
      assetData.supplier_name,
      assetData.supplier_address,
      assetData.supplier_phone,
      assetData.description,
      assetData.files,
      assetData.status,
      assetData.total_allocation,
      assetData.total_lost,
      assetData.total_liquidation,
      assetData.total_damages,
      assetData.total_warranty,
      assetData.added_by,
      assetData.created_date || new Date(),
      assetData.deleted,
      assetId
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('❌ Error updating asset:', err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

// Soft delete an asset (set deleted = 1)
export const deleteAsset = (assetId) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE _assets SET deleted = 1 WHERE id = ?`;
    db.query(query, [assetId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
