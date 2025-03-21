import React, { useState, useEffect } from "react";
import api from "../../Services/api"; // ✅ Import central API instance
import Select from "react-select";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import FormDialog from "../../extra/FormDialog";
import { LuColumns2 } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { SlClose } from "react-icons/sl";

const ExpensesRecurring = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [recurringExpenses, setRecurringExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ State for category & member filters
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [memberOptions, setMemberOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    // ✅ Form Dialog State
    const [openExpenseForm, setOpenExpenseForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    // ✅ Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const totalItems = recurringExpenses.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // ✅ Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState({
        date: true,
        category: true,
        title: true,
        description: true,
        file: true,
        amount: true,
        tax: true,
        secondtax: true,
        total: true,
        action: true,
    });

    // ✅ Define Table Columns
    const columns = [
        { key: "date", label: "Date" },
        { key: "category", label: "Category" },
        { key: "title", label: "Title" },
        { key: "description", label: "Description" },
        { key: "file", label: "Files" },
        { key: "amount", label: "Amount" },
        { key: "tax", label: "TAX" },
        { key: "secondtax", label: "Second TAX" },
        { key: "total", label: "Total" },
        { key: "action", label: "Action" },
    ];

    // ✅ Fetch Recurring Expenses from Backend
    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const response = await api.get("/expenses/recurring"); // ✅ Use central API
            console.log("📌 API Response:", response.data); // ✅ Debugging
            if (Array.isArray(response.data) && response.data.length > 0) {
                setRecurringExpenses(response.data);
            } else {
                console.warn("⚠️ No Expenses Found in API Response");
                setRecurringExpenses([]);
            }
        } catch (error) {
            console.error("❌ Error fetching expenses:", error);
            setRecurringExpenses([]); // ✅ Prevent UI crash
        }
        setLoading(false);
    };

    // ✅ Fetch Categories from Backend
    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories"); // ✅ Use central API
            setCategoryOptions(response.data.map((cat) => ({ label: cat.name, value: cat.id })));
        } catch (error) {
            console.error("❌ Error fetching categories:", error);
        }
    };

    // ✅ Fetch Members from Backend
    const fetchMembers = async () => {
        try {
            const response = await api.get("/members"); // ✅ Use central API
            setMemberOptions(response.data.map((member) => ({ label: member.name, value: member.id })));
        } catch (error) {
            console.error("❌ Error fetching members:", error);
        }
    };

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
        fetchMembers();
    }, []);

    // ✅ Open FormDialog for Editing
    const handleEditExpense = (expense) => {
        setSelectedExpense(expense);
        setIsEditMode(true);
        setOpenExpenseForm(true);
    };

    // ✅ Close Form Dialog
    const handleCloseForm = () => {
        setOpenExpenseForm(false);
        setSelectedExpense(null);
        setIsEditMode(false);
    };

    // ✅ Handle Save Expense (Edit & Save)
    const handleSaveExpense = async () => {
        try {
            if (isEditMode) {
                await api.put(`/expenses/${selectedExpense._id}`, selectedExpense); // ✅ Use central API
                alert("✅ Expense updated successfully!");
            } else {
                await api.post("/expenses", selectedExpense); // ✅ Use central API
                alert("✅ Expense added successfully!");
            }
            fetchExpenses();
            handleCloseForm();
        } catch (error) {
            console.error("❌ Error saving expense:", error);
        }
    };

    // ✅ Handle Delete Expense
    const handleDeleteExpense = async (id) => {
        if (window.confirm("❗ Are you sure you want to delete this expense?")) {
            try {
                await api.delete(`/expenses/${id}`); // ✅ Use central API
                alert("✅ Expense deleted successfully!");
                fetchExpenses(); // ✅ Refresh table after deletion
            } catch (error) {
                console.error("❌ Error deleting expense:", error);
                alert("⚠️ Failed to delete expense. Please try again.");
            }
        }
    };

    // ✅ Toggle Column Visibility
    const toggleColumn = (key) => {
        setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // ✅ Filtered Expenses (Based on Search Query)
    const filteredExpenses = recurringExpenses.filter((expense) =>
        Object.values(expense).some(
            (value) => value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // ✅ Paginate Data
    const paginatedExpenses = filteredExpenses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="border-t bg-white border-gray-200 p-4 rounded-t-md dark:bg-gray-800 dark:text-white">
            {/* ✅ Toolbar Section */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                    {/* Column Visibility Dropdown */}
                    <DropdownButton
                        icon={LuColumns2}
                        options={columns}
                        visibleItems={visibleColumns}
                        toggleItem={toggleColumn}
                    />

                    {/* Select Filters */}
                    <Select options={categoryOptions} value={selectedCategory} onChange={setSelectedCategory} placeholder="- Category -" className="w-48" />
                    <Select options={memberOptions} value={selectedMember} onChange={setSelectedMember} placeholder="- Member -" className="w-48" />
                </div>

                {/* Export & Search Controls */}
                <div className="flex items-center gap-2">
                    <ExportSearchControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} fileName="Recurring_Expenses" />
                </div>
            </div>

            {/* ✅ Table Section */}
            <div className="overflow-x-auto rounded-md">
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
                                        {columns.map((col) =>
                                            visibleColumns[col.key] ? (
                                                <td key={col.key} className="px-6 py-4 text-sm">
                                                    {col.key === "action" ? (
                                                        <div className="flex items-center space-x-2">
                                                            <button onClick={() => handleEditExpense(expense)} className="p-1 rounded hover:bg-green-500 hover:text-white">
                                                                <FiEdit size={20} />
                                                            </button>
                                                            <button onClick={() => handleDeleteExpense(expense._id)} className="p-1 rounded hover:bg-red-500 hover:text-white">
                                                                <SlClose size={20} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        expense[col.key] ?? "N/A" // ✅ Fix: Show "N/A" if no value
                                                    )}
                                                </td>
                                            ) : null
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="py-4 text-center text-gray-500">No results found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            <FormDialog open={openExpenseForm} handleClose={handleCloseForm} formData={selectedExpense || {}} handleSave={handleSaveExpense} />
        </div>
    );
};

export default ExpensesRecurring;