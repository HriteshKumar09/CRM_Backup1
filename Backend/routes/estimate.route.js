import express from 'express';
import {
    createEstimateFormController,
    getAllEstimateFormsController,
    getEstimateFormByIdController,
    updateEstimateFormController,
    deleteEstimateFormController,
    createRequest,
    getRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
    createEstimateController,
    getEstimatesController,
    getEstimateByIdController,
    updateEstimateController,
    deleteEstimateController,
    createItem,
    getItemsByEstimate,
    updateItem,
    deleteItem,
    createCommentController,
    getCommentsController,
    updateCommentController,
    deleteCommentController,
    createProposalController,
    getAllProposalsController,
    getProposalByIdController,
    updateProposalController,
    deleteProposalController,
    getProposalItems,
    addProposalItem,
    editProposalItem,
    removeProposalItem,
    getProposalTemplate,
    editProposalTemplate,
    removeProposalTemplate
} from '../controller/estimateController.js';

const router = express.Router();

// Estimate Forms Routes
router.post('/forms/create', createEstimateFormController);
router.get('/forms/all', getAllEstimateFormsController);
router.get('/forms/:id', getEstimateFormByIdController);
router.put('/forms/:id', updateEstimateFormController);
router.delete('/forms/:id', deleteEstimateFormController);

// Estimate Requests Routes
router.post('/estimate-requests', createRequest);
router.get('/estimate-requests', getRequests);
router.get('/estimate-requests/:id', getRequestById);
router.put('/estimate-requests/:id', updateRequest);
router.delete('/estimate-requests/:id', deleteRequest);

// Estimates Routes
router.post('/estimates/create', createEstimateController);
router.get('/estimates', getEstimatesController);
router.get('/estimates/:id', getEstimateByIdController);
router.put('/estimates/:id', updateEstimateController);
router.delete('/estimates/:id', deleteEstimateController);


// ✅ Estimate Items Routes (renamed to avoid confusion)
router.post('/estimate-items', createItem);
router.get('/estimate-items/:estimate_id', getItemsByEstimate);
router.put('/estimate-items/:id', updateItem);
router.delete('/estimate-items/:id', deleteItem);

// Comment Routes
router.post('/estimate-comments', createCommentController);
router.get('/estimate-comments/:estimate_id', getCommentsController);
router.put('/estimate-comments/:id', updateCommentController);
router.delete('/estimate-comments/:id', deleteCommentController);

//Proposals Routes
router.post('/proposals', createProposalController);          // Create Proposal
router.get('/proposals', getAllProposalsController);
router.get('/proposals/:id', getProposalByIdController);
router.put('/proposals/:id', updateProposalController);
router.delete('/proposals/:id', deleteProposalController);


// 📌 Proposal Items Routes (Inside the same file)
router.get('/proposals/:id/items', getProposalItems);         // Get all items for a specific proposal
router.post('/proposals/:id/items', addProposalItem);         // Add new item to a proposal
router.put('/proposal-items/:itemId', editProposalItem);      // Update a proposal item
router.delete('/proposal-items/:itemId', removeProposalItem); // Soft delete a proposal item


// 📌 Proposal Templates Routes (No conflicts)
router.get('/proposal-templates/:id', getProposalTemplate);    // Get a single template
router.put('/proposal-templates/:id', editProposalTemplate);   // Update a template
router.delete('/proposal-templates/:id', removeProposalTemplate); // Soft delete a template


export default router;


