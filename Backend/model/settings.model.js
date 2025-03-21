import db from "../config/db.js";

// Get all general settings
export const getGeneralSettings = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT setting_name, setting_value 
            FROM _settings 
            WHERE type = 'app' 
            AND deleted = 0 
            AND setting_name IN (
                'site_logo', 
                'favicon', 
                'show_logo_in_signin_page',
                'show_background_image_in_signin_page',
                'signin_page_background',
                'app_title',
                'accepted_file_formats',
                'rows_per_page',
                'scrollbar',
                'enable_rich_text_editor',
                'item_purchase_code',
                'show_theme_color_changer',
                'default_theme_color'
            )`;

        db.query(query, (err, result) => {
            if (err) {
                console.error("Error fetching settings:", err);
                return reject(err);
            }

            // Convert array of settings to object
            const settings = result.reduce((acc, curr) => {
                // Handle serialized values (like images)
                try {
                    const value = JSON.parse(curr.setting_value);
                    acc[curr.setting_name] = value;
                } catch (e) {
                    acc[curr.setting_name] = curr.setting_value;
                }
                return acc;
            }, {});

            resolve(settings);
        });
    });
};

// Update settings
export const updateSettings = (settings) => {
    return new Promise((resolve, reject) => {
        const updates = Object.entries(settings).map(([name, value]) => {
            return new Promise((resolveUpdate, rejectUpdate) => {
                // Convert objects/arrays to JSON strings
                const settingValue = typeof value === 'object' ? JSON.stringify(value) : value;
                
                const query = `
                    UPDATE _settings 
                    SET setting_value = ?, 
                        updated_at = CURRENT_TIMESTAMP 
                    WHERE setting_name = ? 
                    AND type = 'app' 
                    AND deleted = 0`;

                db.query(query, [settingValue, name], (err, result) => {
                    if (err) {
                        console.error(`Error updating setting ${name}:`, err);
                        return rejectUpdate(err);
                    }
                    resolveUpdate(result);
                });
            });
        });

        Promise.all(updates)
            .then(() => resolve({ success: true, message: "Settings updated successfully" }))
            .catch(err => reject(err));
    });
};

// Handle file upload
export const saveUploadedFile = (file, field) => {
    return new Promise((resolve, reject) => {
        // Generate unique filename
        const fileName = `${field}_${Date.now()}${file.name.substring(file.name.lastIndexOf('.'))}`;
        const uploadPath = `uploads/${fileName}`;

        // Move file to uploads directory
        file.mv(uploadPath, async (err) => {
            if (err) {
                console.error("Error moving file:", err);
                return reject(err);
            }

            try {
                // Update the settings table with the new file path
                const query = `
                    UPDATE _settings 
                    SET setting_value = ?,
                        updated_at = CURRENT_TIMESTAMP 
                    WHERE setting_name = ? 
                    AND type = 'app' 
                    AND deleted = 0`;

                await db.query(query, [fileName, field]);
                resolve(`/uploads/${fileName}`);
            } catch (error) {
                console.error("Error saving file info to database:", error);
                reject(error);
            }
        });
    });
}; 