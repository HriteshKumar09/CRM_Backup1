import { createItem, createItemCategory,
     deleteItem, deleteItemCategory, getAllItemCategories, 
     getAllItems, getItemById, 
     getItemCategoryById, updateItem,
      updateItemCategory } from "../model/item.model.js";

//////////
{/*Item Categories */}
//////////

// Create Item Category
export const createItemCategoryController = async (req, res) => {
    try {
        const categoryData = req.body;
        const result = await createItemCategory(categoryData);
        res.status(201).json({ 
            success: true,
            message: "Item category created successfully", 
            data: result 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Failed to create item category", 
            error: error.message 
        });
    }
};

export const getAllItemCategoriesController = async (req, res) => {
    console.log("🚀 getAllItemCategoriesController is triggered");
    try {
        const result = await getAllItemCategories();
        console.log("Fetched categories:", result);
        res.status(200).json({ 
            success: true,
            message: result.length ? "Item categories fetched successfully" : "No item categories found", 
            data: result || [] 
        });
    } catch (error) {
        console.error("Error in getAllItemCategoriesController:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch item categories", 
            error: error.message 
        });
    }
};
// Get Item Category by ID
export const getItemCategoryByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getItemCategoryById(id);
        if (result.length === 0) {
            return res.status(404).json({ message: "Item category not found" });
        }
        res.status(200).json({ message: "Item category fetched successfully", data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch item category", error: error.message });
    }
};

// Update Item Category
export const updateItemCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryData = req.body;
        const result = await updateItemCategory(id, categoryData);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item category not found or not updated" });
        }
        res.status(200).json({ message: "Item category updated successfully", data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update item category", error: error.message });
    }
};

// Delete Item Category (Soft Delete)
export const deleteItemCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteItemCategory(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item category not found or not deleted" });
        }
        res.status(200).json({ message: "Item category deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete item category", error: error.message });
    }
};


/////////////
{/*Items */}
/////////////
// Create Item
export const createItemController = async (req, res) => {
    try {
        const itemData = req.body;
        const result = await createItem(itemData);
        res.status(201).json({ message: "Item created successfully", data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create item", error: error.message });
    }
};

// Get All Items
export const getAllItemsController = async (req, res) => {
    try {
        const result = await getAllItems();
        res.status(200).json({ message: "Items fetched successfully", data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch items", error: error.message });
    }
};

// Get Item by ID
export const getItemByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getItemById(id);
        if (result.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: "Item fetched successfully", data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch item", error: error.message });
    }
};

// Update Item
export const updateItemController = async (req, res) => {
    try {
        const { id } = req.params;
        const itemData = req.body;
        const result = await updateItem(id, itemData);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item not found or not updated" });
        }
        res.status(200).json({ message: "Item updated successfully", data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update item", error: error.message });
    }
};

// Delete Item (Soft Delete)
export const deleteItemController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteItem(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item not found or not deleted" });
        }
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete item", error: error.message });
    }
};
