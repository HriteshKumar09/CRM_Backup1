import express from 'express';
import { 
  createAssetController, 
  getAllAssetsController, 
  getAssetByIdController, 
  updateAssetController, 
  deleteAssetController 
} from '../controller/assets.controller.js';

const router = express.Router();

// Create a new asset
router.post('/assets', createAssetController);

// Get all assets
router.get('/assets', getAllAssetsController);

// Get asset by ID
router.get('/assets/:id', getAssetByIdController);

// Update asset by ID
router.put('/assets/:id', updateAssetController);

// Delete asset by ID
router.delete('/assets/:id', deleteAssetController);

export default router;
