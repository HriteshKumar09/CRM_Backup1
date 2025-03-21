import React, { useState, useEffect } from "react";
import axios from "axios";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { FiPlusCircle, FiEdit, FiTrash2 } from "react-icons/fi";
import { LuColumns2 } from "react-icons/lu";
import Select from "react-select";
import FormDialog from "../../extra/FormDialog";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const API_BASE_URL = "http://localhost:4008/api"; // Update with your API URL

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categoriesData, setCategoriesData] = useState({
    title: "",
    description: "",
    sort: "",
    status: "Active", // Default status set to Active
    articlesorder: "",
  });

  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    description: true,
    status: true,
    sort: true,
    action: true,
  });

  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "status", label: "Status" },
    { key: "sort", label: "Sort" },
    { key: "action", label: "Action" },
  ];

  // ✅ Toggle Column Visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Fetch Categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Handle Form Changes (Add/Edit Category)
  const handleCategoryChange = (e) => {
    setCategoriesData({ ...categoriesData, [e.target.name]: e.target.value });
  };

  // ✅ Open Form Dialog (for Add or Edit)
  const handleOpenForm = (category = null) => {
    if (category) {
      setCategoriesData(category);
      setIsEditMode(true);
    } else {
      setCategoriesData({
        title: "",
        description: "",
        sort: "",
        status: "Active", // Reset status to "Active"
        articlesorder: "",
      });
      setIsEditMode(false);
    }
    setIsDialogOpen(true);
  };

  const CategoriesFields = [
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Description", type: "textarea", multiline: true, rows: 3 },
    { name: "sort", label: "Sort", type: "number" },
    { name: "status", label: "Status", type: "radio", options: ["Active", "Inactive"] },
    { name: "articlesorder", label: "Articles Order", type: "select", options: [] },
  ];

  // ✅ Handle Save Category (Add or Edit)
  const handleSaveCategory = async () => {
    try {
      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/categories/${categoriesData._id}`, categoriesData);
        alert("✅ Category updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/categories`, categoriesData);
        alert("✅ Category added successfully!");
      }
      fetchCategories();
      setIsDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("❌ Error saving category:", error);
      alert("⚠️ Failed to save category.");
    }
  };

  // ✅ Delete Category
  const handleDeleteCategory = async (id) => {
    if (window.confirm("❗ Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`${API_BASE_URL}/categories/${id}`);
        alert("✅ Category deleted successfully!");
        fetchCategories();
      } catch (error) {
        console.error("❌ Error deleting category:", error);
        alert("⚠️ Failed to delete category.");
      }
    }
  };

  // ✅ Filter Categories based on Search Query
  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination Logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageHeader title="Categories (Help)" buttons={[{ label: "Add category", icon: FiPlusCircle,onClick: () => setIsDialogOpen(true) }]} />

      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton icon={LuColumns2} options={columns} visibleItems={visibleColumns} toggleItem={toggleColumn} />
        </div>
        <div className="flex items-center gap-2 dark:bg-gray-700 dark:text-white">
          <ExportSearchControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} fileName="Categories" />
        </div>
      </div>

      {/* ✅ Table Section */}
      <div className="overflow-x-auto rounded-md bg-white dark:bg-gray-800">
        <table className="min-w-full border border-gray-200 rounded-md dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
            <tr>
              {columns.map(
                (col) =>
                  visibleColumns[col.key] && (
                    <th key={col.key} className="text-left py-3 px-4">
                      {col.label}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.length > 0 ? (
              paginatedCategories.map((category, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {columns.map(
                    (col) =>
                      visibleColumns[col.key] ? (
                        <td key={col.key} className="px-6 py-4 text-sm">
                          {col.key === "status" ? (
                            <span
                              className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${
                                category.status.toLowerCase() === "active" ? "bg-green-500" : "bg-red-500"
                              }`}
                            >
                              {category.status}
                            </span>
                          ) : col.key === "action" ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleOpenForm(category)}
                                className="p-1 rounded hover:bg-green-500 hover:text-white"
                              >
                                <FiEdit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category._id)}
                                className="p-1 rounded hover:bg-red-500 hover:text-white"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          ) : (
                            category[col.key] || "—"
                          )}
                        </td>
                      ) : null
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-4 text-center text-gray-500">
                  ❌ No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      {/* Add/Edit Categories Dialog */}
      <FormDialog
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
        type={isEditMode ? "Edit Categories" : "Add Categories"}
        fields={CategoriesFields}
        formData={categoriesData}
        handleChange={(e) => setCategoriesData({ ...categoriesData, [e.target.name]: e.target.value })}
        handleSave={handleSaveCategory}
        isEditMode={isEditMode}
        extraButtons={[
          {
            label: "Save",
            icon: IoMdCheckmarkCircleOutline,
            onClick: handleSaveCategory,
            color: "#4caf50",
          },
        ]}
      />
    </div>
  );
};

export default Categories;