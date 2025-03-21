import { getGeneralSettings, updateSettings, saveUploadedFile } from "../model/settings.model.js";

// Get general settings
export const getGeneralSettingsController = async (req, res) => {
    try {
        const settings = await getGeneralSettings();
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error fetching general settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching general settings'
        });
    }
};

// Update settings
export const updateSettingsController = async (req, res) => {
    try {
        const settings = req.body;
        await updateSettings(settings);
        res.json({
            success: true,
            message: 'Settings updated successfully'
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating settings'
        });
    }
};

// Upload file (logo, favicon, background)
export const uploadFileController = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const file = req.files.file;
        const field = req.body.field;

        const url = await saveUploadedFile(file, field);
        res.json({
            success: true,
            url,
            message: 'File uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading file'
        });
    }
}; 