import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Services/api.js";
import PageNavigation from "../../extra/PageNavigation.js";
import { FiPlusCircle, FiEdit } from "react-icons/fi";
import FormDialog from "../../extra/FormDialog.js";
import { SlClose } from "react-icons/sl";
import DropdownButton from "../../extra/DropdownButton .js";
import ExportSearchControls from "../../extra/ExportSearchControls.js";
import { LuColumns2 } from "react-icons/lu";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Pagination from "../../extra/Pagination.js";

const EstimateForms = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estimates, setEstimates] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // ✅ Pagination: Show 5 items per page

  // ✅ Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    public: true,
    embed: true,
    status: true,
    action: true,
  });

  // ✅ Column Headers
  const columns = [
    { key: "title", label: "Title" },
    { key: "public", label: "Public" },
    { key: "embed", label: "Embed" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  // ✅ Toggle Column Visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Fetch Estimates from API
  useEffect(() => {
    const fetchEstimates = async () => {
      setLoading(true);
      try {
        const response = await api.get("/estimates");
        setEstimates(response.data);
      } catch (err) {
        setError("Failed to fetch estimates.");
      }
      setLoading(false);
    };
    fetchEstimates();
  }, []);

  // ✅ Filter Estimates Based on Search Query
  const filteredEstimates = estimates.filter((estimate) =>
    estimate.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEstimates = filteredEstimates.slice(indexOfFirstItem, indexOfLastItem);

  // ✅ Handle Add/Edit Estimate
  const handleSaveFields = async () => {
    try {
      if (isEditMode) {
        await api.put(`/estimates/${formData.id}`, formData);
        setEstimates(estimates.map((item) => (item.id === formData.id ? formData : item)));
      } else {
        const response = await api.post("/estimates", formData);
        setEstimates([...estimates, response.data]);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving estimate:", error);
    }
  };

  // ✅ Handle Edit Click
  const handleEdit = (estimate) => {
    setFormData(estimate);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/estimates/${id}`);
      setEstimates(estimates.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting estimate:", error);
    }
  };

  // ✅ Form Fields
  const FormFields = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", multiline: true, rows: 2 },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" }
      ]
    },
    { name: "assign", label: "Auto assign estimate request to", type: "select", options: [] },
    { name: "public", label: "Public", type: "checkbox" },
    { name: "attachment", label: "Enable attachment", type: "checkbox" },
  ];

  return (
    <div>
      {/* Page Navigation with Add Form Button */}
      <PageNavigation
        title="Estimate Request Forms"
        buttons={[
          {
            label: "Add Form", icon: FiPlusCircle, onClick: () => {
              setIsEditMode(false);
              setFormData({});
              setIsFormOpen(true);
            }
          },
        ]}
      />

      {/* Toolbar */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 dark:bg-gray-700 dark:text-white">
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
            setSearchQuery={setSearchQuery}
            fileName="yearly_estimates"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading estimates...</p>
        ) : error ? (
          <p className="text-center text-red-500 dark:text-red-400 py-4">{error}</p>
        ) : (
          <table className="min-w-full border border-gray-300 bg-white dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-600">
                {columns.map(
                  (col) =>
                    visibleColumns[col.key] && (
                      <th key={col.key} className="px-4 py-2 text-left border">
                        {col.label}
                      </th>
                    )
                )}
              </tr>
            </thead>
            <tbody>
              {currentEstimates.map((estimate) => (
                <tr key={estimate.id}>
                  <td>
                    {/* ✅ Navigate to another page when clicking the title */}
                    <Link
                      to={`/dashboard/edit_estimate_form/${estimate.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {estimate.title}
                    </Link>
                  </td>
                  <td>
                    {/* ✅ Show "Active" or "Inactive" with different styles */}
                    <span className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${estimate.status === "Active" ? "bg-green-500" : "bg-gray-400"
                      }`}>
                      {estimate.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(estimate)} className="p-1 rounded hover:bg-blue-200">
                      <FiEdit className="text-blue-600" />
                    </button>
                    <button onClick={() => handleDelete(estimate.id)} className="p-1 rounded hover:bg-red-200">
                      <SlClose className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Pagination */}
      <Pagination
        totalItems={filteredEstimates.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <FormDialog
        open={isFormOpen}
        handleClose={() => setIsFormOpen(false)}
        type={isEditMode ? " Form" : "Form"}
        fields={FormFields}
        formData={formData}
        handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        handleSave={handleSaveFields}
        showUploadButton={true}
        extraButtons={[
          { label: "Save", onClick: handleSaveFields, icon: IoMdCheckmarkCircleOutline, color: "#007bff" },
        ]}
      />
    </div>
  );
};

export default EstimateForms;
