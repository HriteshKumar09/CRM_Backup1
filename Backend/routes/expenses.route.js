import express from 'express';
import {
  createExpenseController,
  getAllExpensesController,
  getSingleExpenseController,
  updateExpenseController,
  deleteExpenseController
} from '../controller/expenses.controller.js'; // Import controllers

const router = express.Router();

// Routes for CRUD operations on expenses

// Create a new expense
router.post('/expenses', createExpenseController);

// Get all expenses
router.get('/expenses', getAllExpensesController);

// Get a single expense by ID
router.get('/expenses/:id', getSingleExpenseController);

// Update an expense by ID
router.put('/expenses/:id', updateExpenseController);

// Delete an expense by ID
router.delete('/expenses/:id', deleteExpenseController);

export default router;
