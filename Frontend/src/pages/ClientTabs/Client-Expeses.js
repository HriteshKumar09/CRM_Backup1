import React, { useState, useEffect } from "react";
import axios from "axios";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { LuColumns2 } from "react-icons/lu";
import { FiPlusCircle, FiTrash2, FiEdit, FiDownload } from "react-icons/fi";

const API_BASE_URL = "http://localhost:4008/api"; // ✅ Adjust according to backend

const ClientExpenses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    category: true,
    title: true,
    description: true,
    files: true,
    amount: true,
    tax: true,
    secondtax: true,
    total: true,
    action: true,
  });

  // ✅ Table columns definition
  const columns = [
    { key: "date", label: "Date" },
    { key: "category", label: "Category" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "files", label: "Files" },
    { key: "amount", label: "Amount" },
    { key: "tax", label: "TAX" },
    { key: "secondtax", label: "Second TAX" },
    { key: "total", label: "Total" },
    { key: "action", label: "Action" },
  ];

  // ✅ Fetch expenses from API
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/expenses`);
      setExpenses(response.data);
    } catch (error) {
      console.error("❌ Error fetching expenses:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ✅ Pagination Logic
  const totalItems = expenses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedExpenses = expenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ✅ Edit Expense
  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  // ✅ Save Edited Expense
  const handleSaveEdit = async () => {
    try {
      await axios.put(`${API_BASE_URL}/expenses/${selectedExpense._id}`, selectedExpense);
      alert("✅ Expense updated successfully!");
      fetchExpenses();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("❌ Error updating expense:", error);
      alert("⚠️ Failed to update expense.");
    }
  };

  // ✅ Delete Expense
  const handleDelete = async (id) => {
    if (!window.confirm("❗ Are you sure you want to delete this expense?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/expenses/${id}`);
      alert("✅ Expense deleted successfully!");
      fetchExpenses();
    } catch (error) {
      console.error("❌ Error deleting expense:", error);
      alert("⚠️ Failed to delete expense.");
    }
  };

  // ✅ Toggle column visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
      {/* ✅ Page Header */}
      <PageHeader title="Client Expenses" buttons={[{ label: "Add Expense", icon: FiPlusCircle }]} />

      {/* ✅ Toolbar: Column Selection & Search */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton icon={LuColumns2} options={columns} visibleItems={visibleColumns} toggleItem={toggleColumn} />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} fileName="ClientExpenses" />
        </div>
      </div>

      {/* ✅ Table Section */}
      <div className="overflow-x-auto rounded-md bg-white dark:bg-gray-800 mt-3">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading expenses...</p>
        ) : (
          <table className="min-w-full border border-gray-200 rounded-md dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                {columns.map((col) => visibleColumns[col.key] && <th key={col.key} className="text-left py-3 px-4">{col.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginatedExpenses.length > 0 ? (
                paginatedExpenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {columns.map(
                      (col) =>
                        visibleColumns[col.key] && (
                          <td key={col.key} className="px-6 py-4 text-sm">
                            {col.key === "files" ? (
                              <a href={`${API_BASE_URL}${expense[col.key]}`} download className="text-blue-500 hover:text-blue-700">
                                <FiDownload size={18} />
                              </a>
                            ) : (
                              expense[col.key] || "—"
                            )}
                          </td>
                        )
                    )}
                    <td className="px-6 py-4 text-sm flex space-x-2">
                      <button onClick={() => handleEdit(expense)} className="p-1 rounded hover:bg-blue-500 hover:text-white">
                        <FiEdit size={18} />
                      </button>
                      <button onClick={() => handleDelete(expense._id)} className="p-1 rounded hover:bg-red-500 hover:text-white">
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-4 text-center text-gray-500">❌ No expenses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Pagination Component */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      {/* ✅ Edit Modal */}
      {isEditModalOpen && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Expense</h2>
            <input type="text" value={selectedExpense.title} onChange={(e) => setSelectedExpense({ ...selectedExpense, title: e.target.value })} className="w-full p-2 border rounded mb-4" placeholder="Title" />
            <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientExpenses;
