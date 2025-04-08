import {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  getSubscriptionItems,
  addSubscriptionItem,
  updateSubscriptionItem,
  deleteSubscriptionItem
} from '../model/subscription.model.js';

// Create a subscription
export const createSubscriptionController = async (req, res) => {
  try {
    const result = await createSubscription(req.body);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating subscription',
      error: error.message
    });
  }
};

// Get all subscriptions
export const getSubscriptionsController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    const result = await getSubscriptions(limit, offset);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data || []
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Failed to fetch subscriptions'
      });
    }
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscriptions',
      error: error.message
    });
  }
};

// Get subscription by ID
export const getSubscriptionByIdController = async (req, res) => {
  try {
    const result = await getSubscriptionById(req.params.id);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription',
      error: error.message
    });
  }
};

// Update subscription
export const updateSubscriptionController = async (req, res) => {
  try {
    const result = await updateSubscription(req.params.id, req.body);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating subscription',
      error: error.message
    });
  }
};

// Delete subscription
export const deleteSubscriptionController = async (req, res) => {
  try {
    const result = await deleteSubscription(req.params.id);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting subscription',
      error: error.message
    });
  }
};

// Get subscription items
export const getSubscriptionItemsController = async (req, res) => {
  try {
    const result = await getSubscriptionItems(req.params.subscriptionId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error fetching subscription items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription items',
      error: error.message
    });
  }
};

// Add subscription item
export const addSubscriptionItemController = async (req, res) => {
  try {
    const result = await addSubscriptionItem(req.params.subscriptionId, req.body);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error adding subscription item:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding subscription item',
      error: error.message
    });
  }
};

// Update subscription item
export const updateSubscriptionItemController = async (req, res) => {
  try {
    const result = await updateSubscriptionItem(req.params.itemId, req.body);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error updating subscription item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating subscription item',
      error: error.message
    });
  }
};

// Delete subscription item
export const deleteSubscriptionItemController = async (req, res) => {
  try {
    const result = await deleteSubscriptionItem(req.params.itemId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error deleting subscription item:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting subscription item',
      error: error.message
    });
  }
}; 