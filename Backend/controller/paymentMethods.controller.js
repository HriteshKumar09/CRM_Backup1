import { 
  getPaymentMethods, 
  createPaymentMethod, 
  updatePaymentMethod, 
  deletePaymentMethod 
} from "../model/paymentMethods.model.js";

// Fetch all payment methods
export const fetchPaymentMethodsController = async (req, res) => {
  try {
    console.log('Fetching payment methods...'); // Debug log
    const paymentMethods = await getPaymentMethods();
    console.log('Payment methods fetched:', paymentMethods); // Debug log
    res.json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    console.error('❌ Error in fetchPaymentMethodsController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment methods',
      error: error.message
    });
  }
};

// Create a new payment method
export const createPaymentMethodController = async (req, res) => {
  try {
    const {
      title,
      description,
      type = 'custom',
      online_payable = false,
      available_on_invoice = false,
      minimum_payment_amount = 0,
      settings = '',
      sort = 0
    } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    console.log('Creating payment method with data:', req.body); // Debug log

    const paymentMethod = await createPaymentMethod({
      title,
      description,
      type,
      online_payable,
      available_on_invoice,
      minimum_payment_amount,
      settings,
      sort
    });

    console.log('Payment method created:', paymentMethod); // Debug log

    res.status(201).json({
      success: true,
      message: 'Payment method created successfully',
      data: paymentMethod
    });
  } catch (error) {
    console.error('❌ Error in createPaymentMethodController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment method',
      error: error.message
    });
  }
};

// Update a payment method
export const updatePaymentMethodController = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type = 'custom',
      online_payable = false,
      available_on_invoice = false,
      minimum_payment_amount = 0,
      settings = '',
      sort = 0
    } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    console.log(`Updating payment method ${id} with data:`, req.body); // Debug log

    const paymentMethod = await updatePaymentMethod(id, {
      title,
      description,
      type,
      online_payable,
      available_on_invoice,
      minimum_payment_amount,
      settings,
      sort
    });

    console.log('Payment method updated:', paymentMethod); // Debug log

    res.json({
      success: true,
      message: 'Payment method updated successfully',
      data: paymentMethod
    });
  } catch (error) {
    console.error('❌ Error in updatePaymentMethodController:', error);
    if (error.message === 'Payment method not found') {
      return res.status(404).json({
        success: false,
        message: 'Payment method not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update payment method',
      error: error.message
    });
  }
};

// Delete a payment method
export const deletePaymentMethodController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting payment method ${id}`); // Debug log

    await deletePaymentMethod(id);

    res.json({
      success: true,
      message: 'Payment method deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error in deletePaymentMethodController:', error);
    if (error.message === 'Payment method not found') {
      return res.status(404).json({
        success: false,
        message: 'Payment method not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to delete payment method',
      error: error.message
    });
  }
}; 