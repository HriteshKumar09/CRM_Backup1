import { createExpense, deleteExpense, getAllExpenses, getExpenseById, updateExpense } from "../model/expense.model.js";
import { startCronJobs } from '../cron/cronJob.js';  // Import the cron job logic

// ✅ Create expense controller
export const createExpenseController = async (req, res) => {
  try {
    const expenseData = req.body; // Get the expense data from the request body

    // Call the model to create the expense
    const result = await createExpense(expenseData);

    // Start the cron job dynamically based on user input
    if (expenseData.recurring) {
      startCronJobs(expenseData.repeat_every, expenseData.repeat_type, expenseData.next_recurring_date);
    }

    res.status(201).json({
      message: 'Expense created successfully',
      expenseId: result.expenseId  // Return the ID of the created expense
    });
  } catch (error) {
    console.error('❌ Error creating expense:', error);
    res.status(500).json({ message: 'Error creating expense', error: error.message });
  }
};

// ✅ Get all expenses controller
export const getAllExpensesController = async (req, res) => {
  try {
    const filters = req.query; // Get query parameters (e.g., filter by category, date)

    // Call the model to fetch all expenses
    const result = await getAllExpenses(filters); 

    res.status(200).json({
      message: 'Expenses fetched successfully',
      expenses: result.data
    });
  } catch (error) {
    console.error('❌ Error fetching expenses:', error);
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
};


// ✅ Get single expense controller
export const getSingleExpenseController = async (req, res) => {
  try {
    const expenseId = req.params.id; // Get the expense ID from the URL

    // Call the model to fetch the expense by ID
    const result = await getExpenseById(expenseId);

    if (!result.data) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({
      message: 'Expense fetched successfully',
      expense: result.data
    });
  } catch (error) {
    console.error('❌ Error fetching expense:', error);
    res.status(500).json({ message: 'Error fetching expense', error: error.message });
  }
};


// ✅ Update expense controller
export const updateExpenseController = async (req, res) => {
  try {
    const expenseId = req.params.id; // Get the expense ID from the URL
    const updatedData = req.body;    // Get the updated data from the request body

    // If recurring data is updated, start the cron job
    if (updatedData.recurring || updatedData.repeat_every || updatedData.repeat_type) {
      startCronJobs(updatedData.repeat_every, updatedData.repeat_type, updatedData.next_recurring_date);
    }

    // Call the model to update the expense
    const result = await updateExpense(expenseId, updatedData);

    if (result.data.affectedRows === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({
      message: 'Expense updated successfully',
      expense: result.data
    });
  } catch (error) {
    console.error('❌ Error updating expense:', error);
    res.status(500).json({ message: 'Error updating expense', error: error.message });
  }
};



// ✅ Delete expense controller
export const deleteExpenseController = async (req, res) => {
  try {
    const expenseId = req.params.id; // Get the expense ID from the URL

    // Call the model to delete the expense (soft delete)
    const result = await deleteExpense(expenseId);

    if (!result.success) {
      return res.status(404).json({ message: "Expense not found or already deleted" });
    }

    res.status(200).json({
      message: result.message // Return success message
    });
  } catch (error) {
    console.error('❌ Error deleting expense:', error);
    res.status(500).json({ message: 'Error deleting expense', error: error.message });
  }
};
