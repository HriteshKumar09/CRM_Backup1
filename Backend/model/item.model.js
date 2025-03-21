import db from "../config/db.js";


/////////////////////
{/*Item Categories */}
/////////////////////

// Create Item Category
export const createItemCategory = (categoryData) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO _item_categories (title, deleted, commodity_group_code, \`order\`, display, note)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            categoryData.title,
            categoryData.deleted || 0,
            categoryData.commodity_group_code || null,
            categoryData.order || null,   // this can stay "order" in code, only SQL needs backticks
            categoryData.display || 1,
            categoryData.note || null
        ];
        db.query(query, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
// Get All Item Categories
export const getAllItemCategories = () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM _item_categories WHERE deleted = 0";
        db.query(query, (err, result) => {
            if (err) return reject(err);
            resolve(result);  // This will return array of rows
        });
    });
};

// Get Item Category by ID
export const getItemCategoryById = (id) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM _item_categories WHERE id = ? AND deleted = 0";
        db.query(query, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Update Item Category
export const updateItemCategory = (id, categoryData) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE _item_categories
            SET title = ?, commodity_group_code = ?, \`order\` = ?, display = ?, note = ?
            WHERE id = ? AND deleted = 0
        `;
        const values = [
            categoryData.title,
            categoryData.commodity_group_code || null,
            categoryData.order || null,
            categoryData.display || 1,
            categoryData.note || null,
            id
        ];
        db.query(query, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete Item Category (Soft Delete)
export const deleteItemCategory = (id) => {
    return new Promise((resolve, reject) => {
        const query = "UPDATE _item_categories SET deleted = 1 WHERE id = ?";
        db.query(query, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};


////////////
{/*Items */}
////////////
// Create Item
export const createItem = (itemData) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO _items (
                title, description, unit_type, rate, files, show_in_client_portal, category_id, taxable,
                sort, deleted, tax, tax2, commodity_code, commodity_barcode, commodity_type, warehouse_id, origin,
                color_id, style_id, model_id, size_id, unit_id, sku_code, sku_name, purchase_price, sub_group,
                commodity_name, color, guarantee, profif_ratio, parent_id, attributes, parent_attributes,
                can_be_sold, can_be_purchased, can_be_manufacturing, can_be_inventory, without_checking_warehouse,
                long_descriptions, product_type, description_internal_transfers, description_receipts,
                description_delivery_orders, customer_lead_time, replenish_on_order, supplier_taxes_id,
                description_sale, invoice_policy, purchase_unit_measure, manufacture, manufacturing_lead_time,
                weight, volume, hs_code, from_vendor_item
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
             ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
        `;

        const values = [
            itemData.title,
            itemData.description,
            itemData.unit_type,
            itemData.rate,
            itemData.files,
            itemData.show_in_client_portal || 0,
            itemData.category_id,
            itemData.taxable || 0,
            itemData.sort || 0,
            itemData.deleted || 0,
            itemData.tax || null,
            itemData.tax2 || null,
            itemData.commodity_code || null,
            itemData.commodity_barcode || null,
            itemData.commodity_type || null,
            itemData.warehouse_id || null,
            itemData.origin || null,
            itemData.color_id || null,
            itemData.style_id || null,
            itemData.model_id || null,
            itemData.size_id || null,
            itemData.unit_id || null,
            itemData.sku_code || null,
            itemData.sku_name || null,
            itemData.purchase_price || 0.00,
            itemData.sub_group || null,
            itemData.commodity_name,
            itemData.color || null,
            itemData.guarantee || null,
            itemData.profif_ratio || 0.00,
            itemData.parent_id || null,
            JSON.stringify(itemData.attributes || {}),  // ensure JSON columns are stored correctly
            JSON.stringify(itemData.parent_attributes || {}),
            itemData.can_be_sold || 0,
            itemData.can_be_purchased || 0,
            itemData.can_be_manufacturing || 0,
            itemData.can_be_inventory || 0,
            itemData.without_checking_warehouse || 0,
            itemData.long_descriptions || null,
            itemData.product_type || null,
            itemData.description_internal_transfers || null,
            itemData.description_receipts || null,
            itemData.description_delivery_orders || null,
            itemData.customer_lead_time || 0.00,
            itemData.replenish_on_order || 0,
            itemData.supplier_taxes_id || null,
            itemData.description_sale || null,
            itemData.invoice_policy || 'ordered_quantities',
            itemData.purchase_unit_measure || null,
            itemData.manufacture || 0,
            itemData.manufacturing_lead_time || 0.00,
            itemData.weight || 0.00,
            itemData.volume || 0.00,
            itemData.hs_code || null,
            itemData.from_vendor_item || null
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

// Get All Items
export const getAllItems = () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM _items WHERE deleted = 0";
        db.query(query, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Get Item by ID
export const getItemById = (id) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM _items WHERE id = ? AND deleted = 0";
        db.query(query, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Update Item
export const updateItem = (id, itemData) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE _items
            SET title = ?, description = ?, unit_type = ?, rate = ?, files = ?, show_in_client_portal = ?, category_id = ?, taxable = ?, sort = ?, tax = ?, tax2 = ?, commodity_code = ?, commodity_barcode = ?, commodity_type = ?, warehouse_id = ?, origin = ?, color_id = ?, style_id = ?, model_id = ?, size_id = ?, unit_id = ?, sku_code = ?, sku_name = ?, purchase_price = ?, sub_group = ?, commodity_name = ?, color = ?, guarantee = ?, profif_ratio = ?, parent_id = ?, attributes = ?, parent_attributes = ?, can_be_sold = ?, can_be_purchased = ?, can_be_manufacturing = ?, can_be_inventory = ?, without_checking_warehouse = ?, long_descriptions = ?, product_type = ?, description_internal_transfers = ?, description_receipts = ?, description_delivery_orders = ?, customer_lead_time = ?, replenish_on_order = ?, supplier_taxes_id = ?, description_sale = ?, invoice_policy = ?, purchase_unit_measure = ?, manufacture = ?, manufacturing_lead_time = ?, weight = ?, volume = ?, hs_code = ?, from_vendor_item = ?
            WHERE id = ? AND deleted = 0
        `;
        const values = [
            itemData.title,
            itemData.description,
            itemData.unit_type,
            itemData.rate,
            itemData.files,
            itemData.show_in_client_portal || 0,
            itemData.category_id,
            itemData.taxable || 0,
            itemData.sort || 0,
            itemData.tax || null,
            itemData.tax2 || null,
            itemData.commodity_code || null,
            itemData.commodity_barcode || null,
            itemData.commodity_type || null,
            itemData.warehouse_id || null,
            itemData.origin || null,
            itemData.color_id || null,
            itemData.style_id || null,
            itemData.model_id || null,
            itemData.size_id || null,
            itemData.unit_id || null,
            itemData.sku_code || null,
            itemData.sku_name || null,
            itemData.purchase_price || 0.00,
            itemData.sub_group || null,
            itemData.commodity_name,
            itemData.color || null,
            itemData.guarantee || null,
            itemData.profif_ratio || null,
            itemData.parent_id || null,
            itemData.attributes || null,
            itemData.parent_attributes || null,
            itemData.can_be_sold || 'can_be_sold',
            itemData.can_be_purchased || 'can_be_purchased',
            itemData.can_be_manufacturing || 'can_be_manufacturing',
            itemData.can_be_inventory || 'can_be_inventory',
            itemData.without_checking_warehouse || 0,
            itemData.long_descriptions || null,
            itemData.product_type || null,
            itemData.description_internal_transfers || null,
            itemData.description_receipts || null,
            itemData.description_delivery_orders || null,
            itemData.customer_lead_time || 0.00,
            itemData.replenish_on_order || null,
            itemData.supplier_taxes_id || null,
            itemData.description_sale || null,
            itemData.invoice_policy || 'ordered_quantities',
            itemData.purchase_unit_measure || null,
            itemData.manufacture || null,
            itemData.manufacturing_lead_time || 0.00,
            itemData.weight || 0.00,
            itemData.volume || 0.00,
            itemData.hs_code || null,
            itemData.from_vendor_item || null,
            id
        ];

        db.query(query, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete Item (Soft Delete)
export const deleteItem = (id) => {
    return new Promise((resolve, reject) => {
        const query = "UPDATE _items SET deleted = 1 WHERE id = ?";
        db.query(query, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
