import db from "../config/db.js";
import nodemailer from "nodemailer";

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

// Get localization settings
export const getLocalizationSettings = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT setting_name, setting_value 
            FROM _settings 
            WHERE type = 'app' 
            AND deleted = 0 
            AND setting_name IN (
                'language',
                'timezone',
                'date_format',
                'time_format',
                'first_day_of_week',
                'weekends',
                'default_currency',
                'currency_symbol',
                'currency_position',
                'decimal_separator',
                'no_of_decimals',
                'conversion_rate'
            )`;

        db.query(query, (err, result) => {
            if (err) {
                console.error("Error fetching localization settings:", err);
                return reject(err);
            }

            // Convert array of settings to object
            const settings = result.reduce((acc, curr) => {
                try {
                    // Handle special cases for conversion rate
                    if (curr.setting_name === 'conversion_rate') {
                        acc[curr.setting_name] = JSON.parse(curr.setting_value);
                    } else {
                        acc[curr.setting_name] = curr.setting_value;
                    }
                } catch (e) {
                    acc[curr.setting_name] = curr.setting_value;
                }
                return acc;
            }, {});

            resolve(settings);
        });
    });
};

// Update localization settings
export const updateLocalizationSettings = (settings) => {
    return new Promise((resolve, reject) => {
        const updates = Object.entries(settings).map(([name, value]) => {
            return new Promise((resolveUpdate, rejectUpdate) => {
                // Convert objects/arrays to JSON strings for conversion rate
                const settingValue = name === 'conversion_rate' ? JSON.stringify(value) : value;
                
                const query = `
                    UPDATE _settings 
                    SET setting_value = ?
                    WHERE setting_name = ? 
                    AND type = 'app' 
                    AND deleted = 0`;

                db.query(query, [settingValue, name], (err, result) => {
                    if (err) {
                        console.error(`Error updating localization setting ${name}:`, err);
                        return rejectUpdate(err);
                    }
                    resolveUpdate(result);
                });
            });
        });

        Promise.all(updates)
            .then(() => resolve({ success: true, message: "Localization settings updated successfully" }))
            .catch(err => reject(err));
    });
};

// Get email settings
export const getEmailSettings = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT setting_name, setting_value 
            FROM _settings 
            WHERE type = 'app' 
            AND deleted = 0 
            AND setting_name IN (
                'email_protocol',
                'email_sent_from_name',
                'email_sent_from_address',
                'email_smtp_host',
                'email_smtp_port',
                'email_smtp_user',
                'email_smtp_pass',
                'email_smtp_security_type'
            )`;

        db.query(query, (err, result) => {
            if (err) {
                console.error("Error fetching email settings:", err);
                return reject(err);
            }

            const settings = result.reduce((acc, curr) => {
                acc[curr.setting_name] = curr.setting_value;
                return acc;
            }, {});

            resolve(settings);
        });
    });
};

// Update email settings
export const updateEmailSettings = (settings) => {
    return new Promise((resolve, reject) => {
        const updates = Object.entries(settings).map(([name, value]) => {
            return new Promise((resolveUpdate, rejectUpdate) => {
                const query = `
                    UPDATE _settings 
                    SET setting_value = ?
                    WHERE setting_name = ? 
                    AND type = 'app' 
                    AND deleted = 0`;

                db.query(query, [value, name], (err, result) => {
                    if (err) {
                        console.error(`Error updating email setting ${name}:`, err);
                        return rejectUpdate(err);
                    }
                    resolveUpdate(result);
                });
            });
        });

        Promise.all(updates)
            .then(() => resolve({ success: true, message: "Email settings updated successfully" }))
            .catch(err => reject(err));
    });
};

// Send test email
export const sendTestEmail = async (testEmailAddress) => {
    try {
        // First get the email settings
        const settings = await new Promise((resolve, reject) => {
            const query = `
                SELECT setting_name, setting_value 
                FROM _settings 
                WHERE type = 'app' 
                AND deleted = 0 
                AND setting_name IN (
                    'email_protocol',
                    'email_sent_from_name',
                    'email_sent_from_address',
                    'email_smtp_host',
                    'email_smtp_port',
                    'email_smtp_user',
                    'email_smtp_pass',
                    'email_smtp_security_type'
                )`;

            db.query(query, (err, result) => {
                if (err) {
                    console.error("Error fetching email settings:", err);
                    return reject(err);
                }

                const settings = result.reduce((acc, curr) => {
                    acc[curr.setting_name] = curr.setting_value;
                    return acc;
                }, {});

                resolve(settings);
            });
        });

        // Validate required settings
        if (!settings.email_sent_from_name || !settings.email_sent_from_address) {
            throw new Error('Sender name and email address are required');
        }

        // Configure nodemailer transporter
        let transportConfig;

        // Check if the sender email is from drighna.com
        if (settings.email_sent_from_address.toLowerCase().endsWith('@drighna.com')) {
            // Outlook/Office365 SMTP configuration for drighna.com
            transportConfig = {
                host: 'smtp.office365.com',  // Outlook SMTP server
                port: 587,                   // Standard TLS port for Outlook
                secure: false,               // Use TLS
                auth: {
                    user: settings.email_sent_from_address, // Your @drighna.com email
                    pass: settings.email_smtp_pass          // Your email password
                },
                tls: {
                    ciphers: 'SSLv3',
                    rejectUnauthorized: false
                }
            };
        } else {
            // Fallback to user-specified SMTP settings
            switch (settings.email_protocol) {
                case 'smtp':
                    if (!settings.email_smtp_host || !settings.email_smtp_port) {
                        throw new Error('SMTP host and port are required for SMTP protocol');
                    }
                    transportConfig = {
                        host: settings.email_smtp_host,
                        port: parseInt(settings.email_smtp_port),
                        secure: settings.email_smtp_security_type === 'ssl',
                        auth: settings.email_smtp_user && settings.email_smtp_pass ? {
                            user: settings.email_smtp_user,
                            pass: settings.email_smtp_pass
                        } : undefined,
                        tls: {
                            rejectUnauthorized: false
                        }
                    };
                    break;

                case 'outlook':
                    transportConfig = {
                        host: 'smtp.office365.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: settings.email_sent_from_address,
                            pass: settings.email_smtp_pass
                        },
                        tls: {
                            ciphers: 'SSLv3',
                            rejectUnauthorized: false
                        }
                    };
                    break;

                default:
                    throw new Error('Please configure SMTP settings for your email server');
            }
        }

        // Create transporter
        const transporter = nodemailer.createTransport(transportConfig);

        // Prepare email options
        const mailOptions = {
            from: `"${settings.email_sent_from_name}" <${settings.email_sent_from_address}>`,
            to: testEmailAddress,
            subject: 'Test Email from CRM',
            text: 'This is a test email from your CRM system. If you receive this, your email settings are working correctly.',
            html: `
                <h1>Test Email</h1>
                <p>This is a test email from your CRM system. If you receive this, your email settings are working correctly.</p>
                <p>Sent from: ${settings.email_sent_from_name} (${settings.email_sent_from_address})</p>
                <p>Protocol: ${settings.email_protocol}</p>
            `
        };

        try {
            // Verify connection configuration
            await transporter.verify();
            
            // Send mail
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.messageId);
            
            return { 
                success: true, 
                message: "Test email sent successfully",
                messageId: info.messageId
            };
        } catch (error) {
            console.error('Mail sending error:', error);
            
            // Handle specific Outlook authentication errors
            if (error.code === 'EAUTH') {
                return {
                    success: false,
                    message: 'Authentication failed. For Outlook/Office365:\n1. Verify your email and password are correct\n2. Ensure your Office365 account allows SMTP authentication\n3. You might need to use an App Password if 2FA is enabled',
                    error: error
                };
            }
            
            return {
                success: false,
                message: `Failed to send email: ${error.message}`,
                error: error
            };
        }

    } catch (error) {
        console.error("Error in sendTestEmail:", error);
        return {
            success: false,
            message: error.message || 'Failed to send test email',
            error: error
        };
    }
}; 