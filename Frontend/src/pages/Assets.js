import React, { useState, useEffect } from "react";
import api from "../Services/api";
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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading, assetName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <SlClose className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Delete Asset
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this asset? This action cannot be undone.
                    {assetName && (
                      <span className="block mt-2 font-medium text-gray-700">
                        Asset: {assetName}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                'Delete'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Assets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [assets, setAssets] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  
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

  // Fetch assets from the backend
  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/assets');
      if (response.data.success) {
        setAssets(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        toast.error('Failed to fetch assets');
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error(error.response?.data?.message || 'Failed to fetch assets');
    } finally {
      setIsLoading(false);
    }
  };

  // Call fetch on component mount
  useEffect(() => {
    fetchAssets();
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
    files: "",
    status: 1,
    total_allocation: 0,
    total_lost: 0,
    total_liquidation: 0,
    total_damages: 0,
    total_warranty: 0,
    added_by: 1,
    created_date: new Date(),
    deleted: 0
  });

  const fields = [
    { name: "asset_code", label: "Asset Code", type: "text", required: true, placeholder: "Enter asset code" },
    { name: "asset_name", label: "Asset Name", type: "text", required: true, placeholder: "Enter asset name" },
    { name: "quantity", label: "Quantity", type: "number", required: true, placeholder: "Enter quantity", min: 0 },
    { name: "unit_id", label: "Unit ID", type: "number", required: true, placeholder: "Enter unit ID (numbers only)", min: 0, pattern: "[0-9]*", title: "Please enter only numbers for Unit ID" },
    { name: "group_id", label: "Group ID", type: "number", required: true, placeholder: "Enter group ID (numbers only)", min: 0, pattern: "[0-9]*", title: "Please enter only numbers for Group ID" },
    { name: "location_id", label: "Location ID", type: "number", required: true, placeholder: "Enter location ID (numbers only)", min: 0, pattern: "[0-9]*", title: "Please enter only numbers for Location ID" },
    { name: "series", label: "Series", type: "text", placeholder: "Enter series" },
    { name: "purchase_date", label: "Date of Purchase", type: "date", required: true },
    { name: "warranty_period", label: "Warranty Period (Months)", type: "number", placeholder: "Enter warranty period in months", min: 0 },
    { name: "unit_price", label: "Unit Price", type: "number", required: true, placeholder: "Enter unit price", min: 0 },
    { name: "depreciation", label: "Depreciation (Months)", type: "number", placeholder: "Enter depreciation period in months", min: 0 },
    { name: "supplier_name", label: "Supplier Name", type: "text", placeholder: "Enter supplier name" },
    { name: "supplier_phone", label: "Supplier Phone", type: "text", placeholder: "Enter supplier phone" },
    { name: "supplier_address", label: "Supplier Address", type: "text", placeholder: "Enter supplier address" },
    { name: "description", label: "Description", type: "textarea", multiline: true, rows: 3, placeholder: "Enter description" }
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    let finalValue = value;
    
    // Handle number fields
    if (type === "number") {
      // Only allow numbers for unit_id, group_id, and location_id
      if (['unit_id', 'group_id', 'location_id'].includes(name)) {
        if (!/^\d*$/.test(value)) {
          toast.error(`Please enter only numbers for ${name.replace('_', ' ')}`);
          return;
        }
      }
      finalValue = value === "" ? 0 : Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSaveAsset = async () => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      const requiredFields = fields.filter(field => field.required);
      const missingFields = requiredFields.filter(field => !formData[field.name]);
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in: ${missingFields.map(f => f.label).join(', ')}`);
        return;
      }

      // Calculate amount based on quantity and unit price
      const amount = (Number(formData.unit_price) || 0) * (Number(formData.quantity) || 0);

      // Format dates to YYYY-MM-DD format
      const purchaseDate = formData.purchase_date ? new Date(formData.purchase_date).toISOString().split('T')[0] : null;
      const createdDate = new Date().toISOString().split('T')[0];

      const assetPayload = {
        ...formData,
        quantity: Number(formData.quantity) || 0,
        unit_price: Number(formData.unit_price) || 0,
        amount: amount,
        warranty_period: Number(formData.warranty_period) || 0,
        depreciation: Number(formData.depreciation) || 0,
        status: 1,
        total_allocation: Number(formData.quantity) || 0,
        total_lost: 0,
        total_liquidation: 0,
        total_damages: 0,
        total_warranty: 0,
        added_by: 1,
        created_date: createdDate,
        purchase_date: purchaseDate,
        deleted: 0,
        files: ''
      };

      if (isEditMode) {
        const response = await api.put(`/assets/${formData.id}`, assetPayload);
        if (response.data.success) {
          setAssets((prev) => prev.map((asset) => (asset.id === formData.id ? response.data.data : asset)));
          setIsDialogOpen(false);
          resetFormData();
          toast.success('Asset updated successfully');
          fetchAssets();
        } else {
          toast.error(response.data.message || 'Failed to update asset');
        }
      } else {
        const response = await api.post('/assets', assetPayload);
        if (response.data.success) {
          setAssets((prev) => [...prev, response.data.data]);
          setIsDialogOpen(false);
          resetFormData();
          toast.success('Asset created successfully');
          fetchAssets();
        } else {
          toast.error(response.data.message || 'Failed to create asset');
        }
      }
    } catch (error) {
      console.error("Error saving asset:", error);
      toast.error(error.response?.data?.message || "Error saving asset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAsset = (asset) => {
    setIsEditMode(true);
    setFormData(asset);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (asset) => {
    setAssetToDelete(asset);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await api.delete(`/assets/${assetToDelete.id}`);
      if (response.data.success) {
        toast.success('Asset deleted successfully');
        fetchAssets();
      } else {
        toast.error(response.data.message || 'Failed to delete asset');
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast.error(error.response?.data?.message || "Error deleting asset");
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setAssetToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAssetToDelete(null);
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
      files: "",
      status: 1,
      total_allocation: 0,
      total_lost: 0,
      total_liquidation: 0,
      total_damages: 0,
      total_warranty: 0,
      added_by: 1,
      created_date: new Date(),
      deleted: 0
    });
    setIsEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <PageHeader
            title="Assets Management"
            buttons={[{ 
              label: "Add New Asset", 
              icon: FiPlusCircle, 
              onClick: () => setIsDialogOpen(true),
              className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
            }]}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
            <div className="flex items-center space-x-4">
              <DropdownButton
                icon={LuColumns2}
                options={columns}
                visibleItems={visibleColumns}
                toggleItem={toggleColumn}
              />
            </div>
            <div className="flex items-center gap-2">
              <ExportSearchControls 
                searchQuery={searchQuery} 
                setSearchQuery={handleSearchChange} 
                data={assets} 
                fileName="Assets" 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  {columns.map(
                    (col) =>
                      visibleColumns[col.key] && (
                        <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {col.label}
                        </th>
                      )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-8 text-center">
                      <div className="text-gray-500 text-sm">No assets found</div>
                    </td>
                  </tr>
                ) : (
                  paginatedAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50 transition-colors duration-150">
                      {visibleColumns.assetId && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{asset.id}
                        </td>
                      )}
                      {visibleColumns.asset_code && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {asset.asset_code}
                        </td>
                      )}
                      {visibleColumns.asset_name && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {asset.asset_name}
                        </td>
                      )}
                      {visibleColumns.group_id && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Group {asset.group_id}
                          </span>
                        </td>
                      )}
                      {visibleColumns.unit_id && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Unit {asset.unit_id}
                          </span>
                        </td>
                      )}
                      {visibleColumns.purchase_date && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(asset.purchase_date).toLocaleDateString()}
                        </td>
                      )}
                      {visibleColumns.quantity && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {asset.quantity}
                        </td>
                      )}
                      {visibleColumns.total_allocation && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {asset.total_allocation}
                        </td>
                      )}
                      {visibleColumns.unit_price && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${asset.unit_price.toLocaleString()}
                        </td>
                      )}
                      {visibleColumns.action && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleEditAsset(asset)}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50">
                              <FiEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(asset)}
                              className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 rounded-full hover:bg-red-50">
                              <SlClose size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      </div>

      {/* Custom Delete Modal */}
      <DeleteConfirmationModal
        isOpen={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
        assetName={assetToDelete?.asset_name}
      />

      {/* Add/Edit Asset Dialog */}
      <FormDialog
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
        type={isEditMode ? "Edit Asset" : "Add Asset"}
        fields={fields}
        formData={formData}
        handleChange={handleChange}
        handleSave={handleSaveAsset}
        isEditMode={isEditMode}
        isLoading={isLoading}
        extraButtons={[
          {
            label: "Save",
            icon: IoMdCheckmarkCircleOutline,
            onClick: handleSaveAsset,
            color: "#4caf50",
            className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
          },
        ]}
      />
    </div>
  );
};

export default Assets;