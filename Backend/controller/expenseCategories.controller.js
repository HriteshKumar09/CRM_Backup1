import { 
  createExpenseCategory, 
  getAllExpenseCategories, 
  getExpenseCategoryById, 
  updateExpenseCategory, 
  deleteExpenseCategory 
} from '../model/expense.model.js';

// Get all expense categories
export const getAllExpenseCategoriesController = async (req, res) => {
  try {
    const result = await getAllExpenseCategories();
    res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Error fetching expense categories:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch expense categories'
    });
  }
};

// Create new expense category
export const createExpenseCategoryController = async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const result = await createExpenseCategory({ title });
    res.status(201).json({
      success: true,
      message: 'Expense category created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error creating expense category:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create expense category'
    });
  }
};

// Get expense category by ID
export const getExpenseCategoryByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getExpenseCategoryById(id);
    res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Error fetching expense category:', error);
    res.status(error.message === 'Expense category not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to fetch expense category'
    });
  }
};

// Update expense category
export const updateExpenseCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const result = await updateExpenseCategory(id, { title });
    res.status(200).json({
      success: true,
      message: 'Expense category updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating expense category:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update expense category'
    });
  }
};

// Delete expense category
export const deleteExpenseCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteExpenseCategory(id);
    res.status(200).json({
      success: true,
      message: 'Expense category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting expense category:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete expense category'
    });
  }
}; 