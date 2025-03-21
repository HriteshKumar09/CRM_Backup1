//import { getTaxes } from '../model/taxes.model.js'; // Import the getTaxes model

import { getTaxes } from "../model/taxes.model.js";

export const fetchTaxesController = async (req, res) => {
  try {
    const result = await getTaxes(); // Call the model to fetch taxes
    res.status(200).json({
      message: 'Taxes fetched successfully',
      taxes: result.data  // Return taxes data
    });
  } catch (error) {
    console.error('❌ Error fetching taxes:', error);
    res.status(500).json({ message: 'Error fetching taxes', error: error.message });
  }
};
