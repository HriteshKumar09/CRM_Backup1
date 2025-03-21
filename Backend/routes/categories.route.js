import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controller/categories.controller.js';

const router = express.Router();

// Create a new expense category
router.post('/categories', createCategory);

// Fetch all expense categories
router.get('/categories', getAllCategories);

// Fetch a single expense category by ID
router.get('/categories/:id', getCategoryById);

// Update an expense category
router.put('/categories/:id', updateCategory);

// Soft delete an expense category
router.delete('/categories/:id', deleteCategory);

export default router;