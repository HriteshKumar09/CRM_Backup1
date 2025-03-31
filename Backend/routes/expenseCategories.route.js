import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getAllExpenseCategoriesController,
  createExpenseCategoryController,
  getExpenseCategoryByIdController,
  updateExpenseCategoryController,
  deleteExpenseCategoryController
} from '../controller/expenseCategories.controller.js';

const router = express.Router();

// Get all expense categories
router.get('/expense-categories', authenticate, getAllExpenseCategoriesController);

// Create a new expense category
router.post('/expense-categories', authenticate, createExpenseCategoryController);

// Get a single expense category
router.get('/expense-categories/:id', authenticate, getExpenseCategoryByIdController);

// Update an expense category
router.put('/expense-categories/:id', authenticate, updateExpenseCategoryController);

// Delete an expense category
router.delete('/expense-categories/:id', authenticate, deleteExpenseCategoryController);

export default router; 