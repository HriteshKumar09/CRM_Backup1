import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  fetchPaymentMethodsController,
  createPaymentMethodController,
  updatePaymentMethodController,
  deletePaymentMethodController
} from '../controller/paymentMethods.controller.js';

const router = express.Router();

// Get all payment methods
router.get('/', authenticate, fetchPaymentMethodsController);

// Create a new payment method
router.post('/', authenticate, createPaymentMethodController);

// Update a payment method
router.put('/:id', authenticate, updatePaymentMethodController);

// Delete a payment method
router.delete('/:id', authenticate, deletePaymentMethodController);

export default router; 