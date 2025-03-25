import db from "../config/db.js";

// salesandprospects related
// Get all companies
export const getAllCompanies = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM _company 
            WHERE deleted = 0 
            ORDER BY is_default DESC, name ASC
        `;

        db.query(query, (err, result) => {
            if (err) {
                console.error("Error fetching companies:", err);
                return reject(err);
            }
            resolve(result);
        });
    });
};

// Get company by ID
export const getCompanyById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM _company 
            WHERE id = ? AND deleted = 0
        `;

        db.query(query, [id], (err, result) => {
            if (err) {
                console.error("Error fetching company:", err);
                return reject(err);
            }
            resolve(result[0]);
        });
    });
};

// Create new company
export const createCompany = (companyData) => {
    return new Promise((resolve, reject) => {
        // If this is set as default, unset other defaults first
        const updateQuery = companyData.is_default ? 
            "UPDATE _company SET is_default = 0 WHERE is_default = 1;" : "";

        const query = `
            ${updateQuery}
            INSERT INTO _company (
                name, address, phone, email, website, 
                vat_number, is_default, logo, deleted
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
        `;

        const values = [
            companyData.name,
            companyData.address || '',
            companyData.phone || '',
            companyData.email || '',
            companyData.website || '',
            companyData.vat_number || '',
            companyData.is_default || 0,
            companyData.logo || ''
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error creating company:", err);
                return reject(err);
            }
            resolve({ id: result.insertId, ...companyData });
        });
    });
};

// Update company
export const updateCompany = (id, companyData) => {
    return new Promise((resolve, reject) => {
        // If this is set as default, unset other defaults first
        const updateQuery = companyData.is_default ? 
            "UPDATE _company SET is_default = 0 WHERE id != ? AND is_default = 1;" : "";

        const query = `
            ${updateQuery}
            UPDATE _company 
            SET name = ?, 
                address = ?, 
                phone = ?, 
                email = ?, 
                website = ?, 
                vat_number = ?, 
                is_default = ?,
                logo = ?
            WHERE id = ? AND deleted = 0
        `;

        const values = [
            companyData.name,
            companyData.address || '',
            companyData.phone || '',
            companyData.email || '',
            companyData.website || '',
            companyData.vat_number || '',
            companyData.is_default || 0,
            companyData.logo || '',
            id
        ];

        if (updateQuery) {
            values.unshift(id); // Add id for the first update query
        }

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error updating company:", err);
                return reject(err);
            }
            resolve({ id, ...companyData });
        });
    });
};

// Delete company (soft delete)
export const deleteCompany = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE _company 
            SET deleted = 1 
            WHERE id = ? AND is_default = 0
        `;

        db.query(query, [id], (err, result) => {
            if (err) {
                console.error("Error deleting company:", err);
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return reject(new Error("Cannot delete default company"));
            }
            resolve({ success: true });
        });
    });
};

// Upload company logo
export const uploadCompanyLogo = (id, logoPath) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE _company 
            SET logo = ? 
            WHERE id = ? AND deleted = 0
        `;

        db.query(query, [logoPath, id], (err, result) => {
            if (err) {
                console.error("Error uploading company logo:", err);
                return reject(err);
            }
            resolve({ success: true, logo: logoPath });
        });
    });
}; 