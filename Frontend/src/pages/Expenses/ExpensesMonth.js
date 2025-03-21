import React, { useState, useEffect } from "react";
import api from "../../Services/api";
import Select from "react-select";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { LuColumns2 } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import FormDialog from "../../extra/FormDialog";

const ExpensesMonth = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openExpenseForm, setOpenExpenseForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalItems = expenses.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const [categories, setCategories] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [memberOptions, setMemberOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState({
        expense_date: true,
        category_id: true,
        title: true,
        description: true,
        files: true,
        amount: true,
        tax_id: true,
        tax_id2: true,
        total: true,
        action: true,
    });
    const [taxes, setTaxes] = useState([]); // State for taxes

    const columns = [
        { key: "expense_date", label: "Date" },
        { key: "category_id", label: "Category" },
        { key: "title", label: "Title" },
        { key: "description", label: "Description" },
        { key: "files", label: "Files" },
        { key: "amount", label: "Amount" },
        { key: "tax_id", label: "TAX" },
        { key: "tax_id2", label: "Second TAX" },
        { key: "total", label: "Total" },
        { key: "action", label: "Action" },
    ];

    // Helper function to display "-" for missing or empty data
    const getDisplayValue = (value) => {
        if (value === null || value === undefined || value === "") {
            return "-";
        }
        return value;
    };

    // Fetch Expenses
    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const response = await api.get("/expenses");
            if (Array.isArray(response.data.expenses)) {
                setExpenses(response.data.expenses);
            } else {
                console.error("❌ API response is not an array:", response.data);
                setExpenses([]);
            }
        } catch (error) {
            console.error("❌ Error fetching expenses:", error);
        }
        setLoading(false);
    };

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories");
            if (response.data && Array.isArray(response.data.data)) {
                setCategories(response.data.data);
                setCategoryOptions(
                    response.data.data.map((cat) => ({ label: cat.title, value: cat.id }))
                );
            } else {
                console.error("❌ Unexpected API response structure:", response.data);
                setCategories([]);
            }
        } catch (error) {
            console.error("❌ Error fetching categories:", error);
        }
    };

    // Fetch Members
    const fetchMembers = async () => {
        try {
            const response = await api.get("/members");
            setMemberOptions(response.data.map((member) => ({ label: member.name, value: member.id })));
        } catch (error) {
            console.error("❌ Error fetching members:", error);
        }
    };

    // Fetch Taxes
    const fetchTaxes = async () => {
        try {
            const response = await api.get("/taxes");
            if (response.data && Array.isArray(response.data.taxes)) {
                setTaxes(response.data.taxes);
            } else {
                console.error("❌ Unexpected API response structure:", response.data);
                setTaxes([]);
            }
        } catch (error) {
            console.error("❌ Error fetching taxes:", error);
        }
    };

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
        fetchMembers();
        fetchTaxes(); // Fetch taxes on component mount
    }, []);

    // Calculate Total
    const calculateTotal = (expense) => {
        const amount = parseFloat(expense.amount) || 0;
        const tax1 = parseFloat(expense.tax_id) || 0;
        const tax2 = parseFloat(expense.tax_id2) || 0;
        return amount + tax1 + tax2;
    };

    // Get Category Name
    const getCategoryName = (categoryId) => {
        if (!Array.isArray(categories)) {
            console.error("❌ Categories is not an array:", categories);
            return "-"; // Return "-" instead of "Unknown"
        }
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.title : "-"; // Return "-" if no category is found
    };

    // Get Tax Percentage
    const getTaxPercentage = (taxId) => {
        if (!Array.isArray(taxes)) {
            console.error("❌ Taxes is not an array:", taxes);
            return "-"; // Return "-" instead of "Unknown"
        }
        const tax = taxes.find((tax) => tax.id === taxId);
        return tax ? `${tax.percentage}%` : "-"; // Return "-" if no tax is found
    };

    // Open Edit Form
    const handleEditExpense = (expense) => {
        setSelectedExpense(expense);
        setIsEditMode(true);
        setOpenExpenseForm(true);
    };

    // Close Form Dialog
    const handleCloseForm = () => {
        setOpenExpenseForm(false);
        setSelectedExpense(null);
        setIsEditMode(false);
    };

    // Handle Save Expense
    const handleSaveExpense = async () => {
        try {
            if (isEditMode) {
                await api.put(`/expenses/${selectedExpense.id}`, selectedExpense);
                alert("✅ Expense updated successfully!");
            } else {
                await api.post("/expenses", selectedExpense);
                alert("✅ Expense added successfully!");
            }
            fetchExpenses();
            handleCloseForm();
        } catch (error) {
            console.error("❌ Error saving expense:", error);
        }
    };

    // Handle Delete Expense
    const handleDeleteExpense = async (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            try {
                await api.delete(`/expenses/${id}`);
                alert("✅ Expense deleted successfully!");
                fetchExpenses();
            } catch (error) {
                console.error("❌ Error deleting expense:", error);
            }
        }
    };

    // Paginate Data
    const paginatedExpenses = expenses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="border-t bg-white border-gray-200 p-4 rounded-t-md dark:bg-gray-800 dark:text-white">
            {/* Toolbar Section */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                    <DropdownButton
                        icon={LuColumns2}
                        options={columns}
                        visibleItems={visibleColumns}
                        toggleItem={(key) => setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))}
                    />
                    <Select options={categoryOptions} value={selectedCategory} onChange={setSelectedCategory} placeholder="- Category -" className="w-48" />
                    <Select options={memberOptions} value={selectedMember} onChange={setSelectedMember} placeholder="- Member -" className="w-48" />
                </div>
                <div className="flex items-center gap-2">
                    <ExportSearchControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} fileName="Expenses" />
                </div>
            </div>

            {/* Table Section */}
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
                                    <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        {columns.map((col) =>
                                            visibleColumns[col.key] ? (
                                                <td key={col.key} className="px-6 py-4 text-sm">
                                                    {col.key === "category_id" ? (
                                                        getDisplayValue(getCategoryName(expense[col.key]))
                                                    ) : col.key === "expense_date" ? (
                                                        getDisplayValue(new Date(expense[col.key]).toLocaleDateString())
                                                    ) : col.key === "total" ? (
                                                        getDisplayValue(calculateTotal(expense))
                                                    ) : col.key === "tax_id" || col.key === "tax_id2" ? (
                                                        getDisplayValue(getTaxPercentage(expense[col.key]))
                                                    ) : col.key === "files" ? (
                                                        <button className="text-blue-500 hover:underline">
                                                            {getDisplayValue(expense[col.key])}
                                                        </button>
                                                    ) : col.key === "action" ? (
                                                        <div className="flex items-center space-x-2">
                                                            <button onClick={() => handleEditExpense(expense)} className="p-1 rounded hover:bg-green-500 hover:text-white">
                                                                <FiEdit size={20} />
                                                            </button>
                                                            <button onClick={() => handleDeleteExpense(expense.id)} className="p-1 rounded hover:bg-red-500 hover:text-white">
                                                                <SlClose size={20} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        getDisplayValue(expense[col.key]) // Apply to all other columns
                                                    )}
                                                </td>
                                            ) : null
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="py-4 text-center text-gray-500">No expenses found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination Component */}
            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

            {/* Expense Form Dialog */}
            <FormDialog open={openExpenseForm} handleClose={handleCloseForm} fields={columns} formData={selectedExpense || {}} handleChange={(e) => setSelectedExpense({ ...selectedExpense, [e.target.name]: e.target.value })} handleSave={handleSaveExpense} showUploadButton={true} />
        </div>
    );
};

export default ExpensesMonth;