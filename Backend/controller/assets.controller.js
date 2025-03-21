import { 
    createAsset, 
    getAllAssets, 
    getAssetById, 
    updateAsset, 
    deleteAsset 
  } from '../model/assets.model.js';
  
  // Controller to handle the creation of an asset
  export const createAssetController = async (req, res) => {
    try {
      const assetData = req.body;
      const result = await createAsset(assetData);
  
      // Send a response with the asset ID and any other relevant data
      res.status(201).json({
        success: true,
        message: 'Asset created successfully',
        data: {
          assetId: result.insertId, // ID of the newly created asset
          ...assetData, // You can also return the asset data that was inserted
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Error: ${err.message}`,
      });
    }
  };
  
  // Controller to handle fetching all assets
  export const getAllAssetsController = async (req, res) => {
    try {
      const assets = await getAllAssets();
      res.status(200).json({
        success: true,
        data: assets,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Error: ${err.message}`,
      });
    }
  };
  
  // Controller to handle fetching a specific asset by ID
  export const getAssetByIdController = async (req, res) => {
    try {
      const assetId = req.params.id;
      const asset = await getAssetById(assetId);
  
      if (!asset) {
        return res.status(404).json({
          success: false,
          message: 'Asset not found',
        });
      }
  
      res.status(200).json({
        success: true,
        data: asset,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Error: ${err.message}`,
      });
    }
  };
  
  // Controller to handle updating an asset
  export const updateAssetController = async (req, res) => {
    try {
      const assetId = req.params.id;
      const assetData = req.body;
  
      // Perform the update
      const result = await updateAsset(assetId, assetData);
  
      // Check if the update was successful
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Asset not found',
        });
      }
  
      // Fetch the updated asset data
      const updatedAsset = await getAssetById(assetId);
  
      // Respond with the updated data
      res.status(200).json({
        success: true,
        message: 'Asset updated successfully',
        data: updatedAsset, // Send updated asset data
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Error: ${err.message}`,
      });
    }
  };
  
  // Controller to handle soft deleting an asset
  export const deleteAssetController = async (req, res) => {
    try {
      const assetId = req.params.id;
      const result = await deleteAsset(assetId);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Asset not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Asset deleted successfully',
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Error: ${err.message}`,
      });
    }
  };
  