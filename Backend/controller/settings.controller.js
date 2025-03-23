import { getGeneralSettings, updateSettings, saveUploadedFile, getLocalizationSettings, updateLocalizationSettings, getEmailSettings, updateEmailSettings, sendTestEmail } from "../model/settings.model.js";

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

// Get localization settings
export const getLocalizationSettingsController = async (req, res) => {
    try {
        const settings = await getLocalizationSettings();
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error fetching localization settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching localization settings'
        });
    }
};

// Update localization settings
export const updateLocalizationSettingsController = async (req, res) => {
    try {
        const settings = req.body;
        await updateLocalizationSettings(settings);
        res.json({
            success: true,
            message: 'Localization settings updated successfully'
        });
    } catch (error) {
        console.error('Error updating localization settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating localization settings'
        });
    }
};

// Get email settings
export const getEmailSettingsController = async (req, res) => {
    try {
        const settings = await getEmailSettings();
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error fetching email settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching email settings'
        });
    }
};

// Update email settings
export const updateEmailSettingsController = async (req, res) => {
    try {
        const settings = req.body;
        await updateEmailSettings(settings);
        res.json({
            success: true,
            message: 'Email settings updated successfully'
        });
    } catch (error) {
        console.error('Error updating email settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating email settings'
        });
    }
};

// Send test email
export const sendTestEmailController = async (req, res) => {
    try {
        const { test_email } = req.body;
        
        if (!test_email) {
            return res.status(400).json({
                success: false,
                message: 'Test email address is required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(test_email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address format'
            });
        }

        const result = await sendTestEmail(test_email);
        
        if (!result.success) {
            let statusCode = 500;
            let errorMessage = result.message;
            let errorDetails = result.error;

            // Handle specific error cases
            if (result.message.includes('required')) {
                statusCode = 400;
            } else if (result.message.includes('Gmail authentication failed')) {
                statusCode = 401;
                // Keep the detailed instructions from the model
                errorMessage = result.message;
            } else if (result.message.includes('authentication failed') || result.message.includes('Invalid login')) {
                statusCode = 401;
                errorMessage = 'Email authentication failed. Please check your credentials.';
            } else if (result.message.includes('SMTP')) {
                errorMessage = 'SMTP configuration error. Please verify your email settings.';
            }

            return res.status(statusCode).json({
                success: false,
                message: errorMessage,
                details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
            });
        }

        res.json({
            success: true,
            message: 'Test email sent successfully',
            messageId: result.messageId
        });
    } catch (error) {
        console.error('Error sending test email:', error);
        
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while sending the test email',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}; 