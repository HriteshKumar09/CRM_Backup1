import {
  createExpenseCategory,
  getAllExpenseCategories,
  getExpenseCategoryById,
  updateExpenseCategory,
  deleteExpenseCategory,
} from "../model/categories.model.js";

// Create a new expense category
export const createCategory = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required for creating a category.",
      });
    }

    const result = await createExpenseCategory({ title });
    res.status(201).json({
      success: true,
      message: "Expense category created successfully.",
      categoryId: result.categoryId,
    });
  } catch (error) {
    console.error("❌ Error creating expense category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create expense category.",
      error: error.message,
    });
  }
};

// Fetch all expense categories
export const getAllCategories = async (req, res) => {
  try {
    const result = await getAllExpenseCategories();
    res.status(200).json({
      success: true,
      message: "Expense categories fetched successfully.",
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Error fetching expense categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch expense categories.",
      error: error.message,
    });
  }
};

// Fetch a single expense category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getExpenseCategoryById(id);
    res.status(200).json({
      success: true,
      message: "Expense category fetched successfully.",
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Error fetching expense category by ID:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch expense category.",
      error: error.message,
    });
  }
};

// Update an expense category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required for updating a category.",
      });
    }

    await updateExpenseCategory(id, { title });
    res.status(200).json({
      success: true,
      message: "Expense category updated successfully.",
    });
  } catch (error) {
    console.error("❌ Error updating expense category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update expense category.",
      error: error.message,
    });
  }
};

// Soft delete an expense category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteExpenseCategory(id);
    res.status(200).json({
      success: true,
      message: "Expense category deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Error deleting expense category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete expense category.",
      error: error.message,
    });
  }
};