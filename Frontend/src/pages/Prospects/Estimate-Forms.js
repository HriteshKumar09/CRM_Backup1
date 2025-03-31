import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EstimateForms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forms, setForms] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Active",
    assigned_to: "",
    public: false,
    enable_attachment: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    description: true,
    status: true,
    assigned: true,
    public: true,
    action: true,
  });

  // Column Headers
  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "status", label: "Status" },
    { key: "assigned", label: "Assigned To" },
    { key: "public", label: "Public" },
    { key: "action", label: "Action" },
  ];

  // Fetch Forms from API
  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      try {
        const response = await api.get("/estimate/forms/all");
        if (response.data.success) {
          setForms(response.data.forms);
        } else {
          setError("Failed to fetch forms.");
          toast.error("Failed to fetch forms");
        }
      } catch (err) {
        setError("Failed to fetch forms.");
        toast.error(err.response?.data?.message || "Failed to fetch forms");
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  // Filter Forms Based on Search Query
  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentForms = filteredForms.slice(indexOfFirstItem, indexOfLastItem);

  // Handle Add/Edit Form
  const handleSaveFields = async () => {
    try {
      if (isEditMode) {
        const response = await api.put(`/estimate/forms/${formData.id}`, formData);
        if (response.data.success) {
          setForms(forms.map((item) => (item.id === formData.id ? formData : item)));
          toast.success("Form updated successfully");
        } else {
          toast.error("Failed to update form");
        }
      } else {
        const response = await api.post("/estimate/forms/create", formData);
        if (response.data.success) {
          setForms([...forms, response.data.form]);
          toast.success("Form created successfully");
        } else {
          toast.error("Failed to create form");
        }
      }
      setIsFormOpen(false);
      setFormData({
        title: "",
        description: "",
        status: "Active",
        assigned_to: "",
        public: false,
        enable_attachment: false
      });
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error(error.response?.data?.message || "Error saving form");
    }
  };

  // Handle Edit Click
  const handleEdit = (form) => {
    setFormData(form);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this form?")) {
      return;
    }

    try {
      const response = await api.delete(`/estimate/forms/${id}`);
      if (response.data.success) {
        setForms(forms.filter((item) => item.id !== id));
        toast.success("Form deleted successfully");
      } else {
        toast.error("Failed to delete form");
      }
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.error(error.response?.data?.message || "Failed to delete form");
    }
  };

  // Form Fields
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
    { name: "assigned_to", label: "Assigned To", type: "text" },
    { name: "public", label: "Public", type: "checkbox" },
    { name: "enable_attachment", label: "Enable Attachment", type: "checkbox" },
  ];

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <PageNavigation
        title="Estimate Request Forms"
        buttons={[
          {
            label: "Add Form",
            icon: FiPlusCircle,
            onClick: () => {
              setIsEditMode(false);
              setFormData({
                title: "",
                description: "",
                status: "Active",
                assigned_to: "",
                public: false,
                enable_attachment: false
              });
              setIsFormOpen(true);
            }
          },
        ]}
      />

      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={(key) => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))}
          />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={filteredForms}
            fileName="estimate_forms"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading forms...</p>
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
              {currentForms.map((form) => (
                <tr key={form.id}>
                  {visibleColumns.title && (
                    <td className="px-4 py-2 border">
                      <Link
                        to={`/dashboard/Prospects-Estimate Forms/edit/${form.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {form.title}
                      </Link>
                    </td>
                  )}
                  {visibleColumns.description && (
                    <td className="px-4 py-2 border">{form.description}</td>
                  )}
                  {visibleColumns.status && (
                    <td className="px-4 py-2 border">
                      <span className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${
                        form.status === "Active" ? "bg-green-500" : "bg-gray-400"
                      }`}>
                        {form.status}
                      </span>
                    </td>
                  )}
                  {visibleColumns.assigned && (
                    <td className="px-4 py-2 border">{form.assigned_to}</td>
                  )}
                  {visibleColumns.public && (
                    <td className="px-4 py-2 border">
                      {form.public ? "Yes" : "No"}
                    </td>
                  )}
                  {visibleColumns.action && (
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleEdit(form)}
                        className="p-1 rounded hover:bg-blue-200 mr-2"
                      >
                        <FiEdit className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(form.id)}
                        className="p-1 rounded hover:bg-red-200"
                      >
                        <SlClose className="text-red-500" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        totalItems={filteredForms.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <FormDialog
        open={isFormOpen}
        handleClose={() => setIsFormOpen(false)}
        type={isEditMode ? "Edit Form" : "Add Form"}
        fields={FormFields}
        formData={formData}
        handleChange={(e) => {
          const { name, value, type, checked } = e.target;
          setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
          }));
        }}
        handleSave={handleSaveFields}
        showUploadButton={true}
        extraButtons={[
          {
            label: "Save",
            onClick: handleSaveFields,
            icon: IoMdCheckmarkCircleOutline,
            color: "#007bff"
          },
        ]}
      />
    </div>
  );
};

export default EstimateForms;
