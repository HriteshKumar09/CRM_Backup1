import express from 'express';
import { 
    getAllCompaniesController,
    getCompanyByIdController,
    createCompanyController,
    updateCompanyController,
    deleteCompanyController,
    uploadCompanyLogoController
} from '../controller/company.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = express.Router();

// Get all companies
router.get('/', authenticate, getAllCompaniesController);

// Get company by ID
router.get('/:id', authenticate, getCompanyByIdController);

// Create new company
router.post('/', authenticate, authorizeRoles('admin'), createCompanyController);

// Update company
router.put('/:id', authenticate, authorizeRoles('admin'), updateCompanyController);

// Delete company
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteCompanyController);

// Upload company logo
router.post('/:id/logo', authenticate, authorizeRoles('admin'), uploadCompanyLogoController);

export default router; 