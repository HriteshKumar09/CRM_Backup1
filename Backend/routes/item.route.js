import express from 'express';
import { createItemCategoryController, createItemController,
     deleteItemCategoryController, deleteItemController,
      getAllItemCategoriesController,
      getAllItemsController, getItemByIdController, getItemCategoryByIdController, 
      updateItemCategoryController, updateItemController } from '../controller/items.controller.js';


const router = express.Router();

// Item Category Routes - KEEP THIS AT TOP
  router.get('/item-categories', getAllItemCategoriesController);
  router.get('/item-categories/:id', getItemCategoryByIdController);
  router.post('/item-categories', createItemCategoryController);
  router.put('/item-categories/:id', updateItemCategoryController);
  router.delete('/item-categories/:id', deleteItemCategoryController);
  
  // Item Routes - KEEP THIS BELOW
  router.post('/', createItemController);
  router.get('/', getAllItemsController);
  router.get('/:id', getItemByIdController);
  router.put('/:id', updateItemController);
  router.delete('/:id', deleteItemController);
  

export default router;
