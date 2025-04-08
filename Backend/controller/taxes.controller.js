//import { getTaxes } from '../model/taxes.model.js'; // Import the getTaxes model

import { getTaxes, createTax, updateTax, deleteTax } from "../model/taxes.model.js";

export const fetchTaxesController = async (req, res) => {
  try {
    const taxes = await getTaxes();
    res.status(200).json({
      success: true,
      message: 'Taxes fetched successfully',
      taxes  // Return taxes array directly
    });
  } catch (error) {
    console.error('❌ Error fetching taxes:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching taxes'
    });
  }
};

export const createTaxController = async (req, res) => {
  try {
    const { title, percentage } = req.body;
    
    // Validate input
    if (!title || percentage === undefined || percentage === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Title and percentage are required'
      });
    }

    // Convert percentage to number and validate
    const percentageNum = parseFloat(percentage);
    if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Percentage must be a number between 0 and 100'
      });
    }

    const newTax = await createTax({ title, percentage: percentageNum });
    res.status(201).json({
      success: true,
      message: 'Tax created successfully',
      tax: newTax
    });
  } catch (error) {
    console.error('❌ Error creating tax:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating tax'
    });
  }
};

export const updateTaxController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, percentage } = req.body;
    
    // Validate input
    if (!id || !title || percentage === undefined || percentage === '') {
      return res.status(400).json({ 
        success: false,
        message: 'ID, title, and percentage are required'
      });
    }

    // Convert percentage to number and validate
    const percentageNum = parseFloat(percentage);
    if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Percentage must be a number between 0 and 100'
      });
    }

    const updatedTax = await updateTax({ id, title, percentage: percentageNum });
    res.status(200).json({
      success: true,
      message: 'Tax updated successfully',
      tax: updatedTax
    });
  } catch (error) {
    console.error('❌ Error updating tax:', error);
    if (error.message === "Tax not found or already deleted") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Error updating tax'
    });
  }
};

export const deleteTaxController = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate input
    if (!id) {
      return res.status(400).json({ 
        success: false,
        message: 'Tax ID is required'
      });
    }

    const result = await deleteTax(id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('❌ Error deleting tax:', error);
    if (error.message === "Tax not found or already deleted") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Error deleting tax'
    });
  }
};
