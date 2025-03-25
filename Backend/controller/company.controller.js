import {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
    uploadCompanyLogo
} from '../model/company.model.js';

// Get all companies
export const getAllCompaniesController = async (req, res) => {
    try {
        const companies = await getAllCompanies();
        res.json({
            success: true,
            data: companies
        });
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching companies'
        });
    }
};

// Get company by ID
export const getCompanyByIdController = async (req, res) => {
    try {
        const company = await getCompanyById(req.params.id);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }
        res.json({
            success: true,
            data: company
        });
    } catch (error) {
        console.error('Error fetching company:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching company'
        });
    }
};

// Create new company
export const createCompanyController = async (req, res) => {
    try {
        const companyData = req.body;
        
        // Basic validation
        if (!companyData.name) {
            return res.status(400).json({
                success: false,
                message: 'Company name is required'
            });
        }

        const company = await createCompany(companyData);
        res.status(201).json({
            success: true,
            data: company,
            message: 'Company created successfully'
        });
    } catch (error) {
        console.error('Error creating company:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating company'
        });
    }
};

// Update company
export const updateCompanyController = async (req, res) => {
    try {
        const companyData = req.body;
        const companyId = req.params.id;
        
        // Basic validation
        if (!companyData.name) {
            return res.status(400).json({
                success: false,
                message: 'Company name is required'
            });
        }

        const company = await updateCompany(companyId, companyData);
        res.json({
            success: true,
            data: company,
            message: 'Company updated successfully'
        });
    } catch (error) {
        console.error('Error updating company:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating company'
        });
    }
};

// Delete company
export const deleteCompanyController = async (req, res) => {
    try {
        await deleteCompany(req.params.id);
        res.json({
            success: true,
            message: 'Company deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting company:', error);
        if (error.message === 'Cannot delete default company') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error deleting company'
        });
    }
};

// Upload company logo
export const uploadCompanyLogoController = async (req, res) => {
    try {
        if (!req.files || !req.files.logo) {
            return res.status(400).json({
                success: false,
                message: 'No logo file uploaded'
            });
        }

        const logo = req.files.logo;
        const companyId = req.params.id;
        
        // Generate unique filename
        const fileName = `company_logo_${companyId}_${Date.now()}${logo.name.substring(logo.name.lastIndexOf('.'))}`;
        const uploadPath = `uploads/${fileName}`;

        // Move file to uploads directory
        await logo.mv(uploadPath);
        
        // Update company with logo path
        const result = await uploadCompanyLogo(companyId, fileName);
        
        res.json({
            success: true,
            data: result,
            message: 'Company logo uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading company logo:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading company logo'
        });
    }
}; 