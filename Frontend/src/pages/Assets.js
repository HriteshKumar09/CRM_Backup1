import React, { useState, useEffect } from "react";
import axios from "axios";
import PageHeader from '../extra/PageHeader';
import DropdownButton from "../extra/DropdownButton ";
import Pagination from "../extra/Pagination";
import ExportSearchControls from '../extra/ExportSearchControls';
import { FiEdit, FiPlusCircle, FiPlus } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { LuColumns2 } from "react-icons/lu";
import FormDialog from "../extra/FormDialog";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import * as XLSX from "xlsx";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const BASE_URL = "http://localhost:4008/api"; // API URL

const Assets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [assets, setAssets] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]); // Unit options state
  const [groupOptions, setGroupOptions] = useState([]); // Group options state
  const [locationOptions, setLocationOptions] = useState([]); // Location options state
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog open/close state
  const [isEditMode, setIsEditMode] = useState(false); // Edit mode toggle
  const [visibleColumns, setVisibleColumns] = useState({
    assetId: true,
    asset_code: true,
    asset_name: true,
    group_id: true,
    unit_id: true,
    purchase_date: true,
    quantity: true,
    total_allocation: true,
    unit_price: true,
    action: true,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete confirmation dialog
  const [assetToDelete, setAssetToDelete] = useState(null); // State to store the asset to be deleted

  // Define the columns for the table
  const columns = [
    { key: "assetId", label: "Asset ID" },
    { key: "asset_code", label: "Asset code" },
    { key: "asset_name", label: "Asset name" },
    { key: "group_id", label: "Group" },
    { key: "unit_id", label: "Unit" },
    { key: "purchase_date", label: "Date of purchase" },
    { key: "quantity", label: "Quantity allocated" },
    { key: "total_allocation", label: "Inventory" },
    { key: "unit_price", label: "Original Price" },
    { key: "action", label: "Action" },
  ];

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const totalItems = assets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedAssets = Array.isArray(assets) ? assets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

  // Fetch assets and options from the backend
  const fetchAssets = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/assets`);
      setAssets(Array.isArray(response.data.data) ? response.data.data : []); // Ensure the response is an array
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  const fetchSelectOptions = async () => {
    try {
      // Fetch Unit, Group, Location options from backend
      const unitResponse = await axios.get(`${BASE_URL}/units`);
      const groupResponse = await axios.get(`${BASE_URL}/groups`);
      const locationResponse = await axios.get(`${BASE_URL}/locations`);
      
      setUnitOptions(Array.isArray(unitResponse.data) ? unitResponse.data : []); // Ensure the response is an array
      setGroupOptions(Array.isArray(groupResponse.data) ? groupResponse.data : []); // Ensure the response is an array
      setLocationOptions(Array.isArray(locationResponse.data) ? locationResponse.data : []); // Ensure the response is an array
    } catch (error) {
      console.error("Error fetching select options:", error);
    }
  };

  // Call fetch on component mount
  useEffect(() => {
    fetchAssets();
    fetchSelectOptions(); // Fetch the options data
  }, []);

  // Filter the assets based on the search query
  const filteredAssets = assets.filter((asset) =>
    asset.asset_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.asset_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search functionality
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const [formData, setFormData] = useState({
    asset_code: "",
    asset_name: "",
    quantity: "",
    unit_id: "",
    group_id: "",
    location_id: "",
    series: "",
    purchase_date: "",
    warranty_period: "",
    unit_price: "",
    depreciation: "",
    supplier_name: "",
    supplier_phone: "",
    supplier_address: "",
    description: "",
  });

  const fields = [
    { name: "asset_code", label: "Asset code", type: "text" },
    { name: "asset_name", label: "Asset name", type: "text" },
    { name: "quantity", label: "Quantity", type: "number" },
    { name: "unit_id", label: "Unit", type: "number", options: unitOptions },  // Dynamic data
    { name: "group_id", label: "Group", type: "number", options: groupOptions },  // Dynamic data
    { name: "location_id", label: "Location", type: "number", options: locationOptions },  // Dynamic data
    { name: "series", label: "Series", type: "text" },
    { name: "purchase_date", label: "Date of purchase", type: "date" },
    { name: "warranty_period", label: "Warranty period (Months)", type: "number" },
    { name: "unit_price", label: "Unit price", type: "number" },
    { name: "depreciation", label: "Depreciation (Months)", type: "number" },
    { name: "supplier_name", label: "Supplier name", type: "text" },
    { name: "supplier_phone", label: "Supplier phone", type: "text" },
    { name: "supplier_address", label: "Supplier address", type: "text" },
    { name: "description", label: "Description", type: "textarea", multiline: true, rows: 3 },
  ];

  const handleSaveAsset = async () => {
    try {
      if (isEditMode) {
        await axios.put(`${BASE_URL}/assets/${formData.id}`, formData);
        setAssets((prev) => prev.map((asset) => (asset.id === formData.id ? formData : asset)));
      } else {
        const response = await axios.post(`${BASE_URL}/assets`, formData);
        setAssets((prev) => [...prev, { ...formData, id: response.data.id }]);
      }
      setIsDialogOpen(false);
      resetFormData();
    } catch (error) {
      console.error("Error saving asset:", error);
    }
  };

  const handleEditAsset = (asset) => {
    setIsEditMode(true);
    setFormData(asset);
    setIsDialogOpen(true);
  };

  const handleDeleteAsset = async () => {
    try {
      await axios.delete(`${BASE_URL}/assets/${assetToDelete.id}`);
      setAssets((prev) => prev.filter((asset) => asset.id !== assetToDelete.id));
      setDeleteDialogOpen(false); // Close the delete confirmation dialog
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  const resetFormData = () => {
    setFormData({
      asset_code: "",
      asset_name: "",
      quantity: "",
      unit_id: "",
      group_id: "",
      location_id: "",
      series: "",
      purchase_date: "",
      warranty_period: "",
      unit_price: "",
      depreciation: "",
      supplier_name: "",
      supplier_phone: "",
      supplier_address: "",
      description: "",
    });
    setIsEditMode(false);
  };

  return (
    <div>
      <PageHeader
        title="Assets"
        buttons={[{ label: "Add asset", icon: FiPlusCircle, onClick: () => setIsDialogOpen(true) }]}
      />
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          {/* Dropdown Button */}
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
          />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls searchQuery={searchQuery} setSearchQuery={handleSearchChange} data={assets} fileName="Assets" />
        </div>
      </div>

      {/* Table */}
      <table className="projects-table min-w-full divide-y divide-gray-200 border-t border-gray-200 w-full">
        <thead className="dark:bg-gray-700 dark:text-white">
          <tr>
            {columns.map(
              (col) =>
                visibleColumns[col.key] && (
                  <th key={col.key} className="px-6 py-3 text-left text-xs font-bold  uppercase">
                    {col.label}
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
          {filteredAssets.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center ">
                No data found
              </td>
            </tr>
          ) : (
            paginatedAssets.map((asset) => (
              <tr key={asset.id} className="border-t">
                {visibleColumns.assetId && <td className="px-6 py-4 whitespace-nowrap text-sm ">{asset.id}</td>}
                {visibleColumns.asset_code && <td className="px-6 py-4 whitespace-nowrap text-sm ">{asset.asset_code}</td>}
                {visibleColumns.asset_name && <td className="px-6 py-4 whitespace-nowrap text-sm ">{asset.asset_name}</td>}
                {visibleColumns.group_id && <td className="px-6 py-4 whitespace-nowrap text-sm ">{asset.group_id}</td>}
                {visibleColumns.unit_id && <td className="px-6 py-4 whitespace-nowrap text-sm ">{asset.unit_id}</td>}
                {visibleColumns.purchase_date && <td className="px-6 py-4 whitespace-nowrap text-sm ">{new Date(asset.purchase_date).toLocaleDateString()}</td>}
                {visibleColumns.quantity && <td className="px-6 py-4 whitespace-nowrap text-sm ">{asset.quantity}</td>}
                {visibleColumns.total_allocation && <td className="px-6 py-4 whitespace-nowrap text-sm ">{asset.total_allocation}</td>}
                {visibleColumns.unit_price && <td className="px-6 py-4 whitespace-nowrap text-sm ">{asset.unit_price}</td>}
                {visibleColumns.action && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">
                    <button
                      onClick={() => handleEditAsset(asset)}
                      className="p-1 rounded transition-colors duration-200 mr-2">
                      <FiEdit className=" hover:text-white hover:bg-green-500 rounded-lg" size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setAssetToDelete(asset);
                        setDeleteDialogOpen(true);
                      }}
                      className="p-1 rounded transition-colors duration-200">
                      <SlClose className=" hover:text-white hover:bg-red-500 rounded-xl" size={20} />
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Add/Edit Asset Dialog */}
      <FormDialog
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
        type={isEditMode ? "Edit Asset" : "Add Asset"}
        fields={fields}
        formData={formData}
        handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        handleSave={handleSaveAsset}
        isEditMode={isEditMode}
        extraButtons={[
          {
            label: "Save",
            icon: IoMdCheckmarkCircleOutline,
            onClick: handleSaveAsset,
            color: "#4caf50",
          },
        ]}
      />
      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Asset</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this asset? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAsset} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Assets;