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
import { toast } from "react-toastify";

const ExpensesMonth = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openExpenseForm, setOpenExpenseForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [categories, setCategories] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [memberOptions, setMemberOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [taxes, setTaxes] = useState([]);

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

    const columns = [
        { key: "expense_date", label: "Date", type: "date" },
        { key: "category_id", label: "Category", type: "select" },
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "files", label: "Files", type: "file" },
        { key: "amount", label: "Amount", type: "number" },
        { key: "tax_id", label: "TAX", type: "select" },
        { key: "tax_id2", label: "Second TAX", type: "select" },
        { key: "total", label: "Total", type: "number" },
        { key: "action", label: "Action", type: "button" },
    ];

    // Fetch Expenses
    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const response = await api.get("/expenses");
            if (response.data && response.data.expenses) {
                setExpenses(response.data.expenses);
            } else {
                console.error("❌ API response is not in expected format:", response.data);
                setExpenses([]);
            }
        } catch (error) {
            console.error("❌ Error fetching expenses:", error);
            toast.error("Failed to fetch expenses");
        }
        setLoading(false);
    };

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories");
            if (response.data && response.data.data) {
                setCategories(response.data.data);
                setCategoryOptions(
                    response.data.data.map((cat) => ({
                        label: cat.title,
                        value: cat.id
                    }))
                );
            }
        } catch (error) {
            console.error("❌ Error fetching categories:", error);
            toast.error("Failed to fetch categories");
        }
    };

    // Fetch Team Members
    const fetchMembers = async () => {
        try {
            const response = await api.get("/auth/team-members");
            if (response.data && response.data.users) {
                setMemberOptions(
                    response.data.users.map((member) => ({
                        label: `${member.first_name} ${member.last_name}`,
                        value: member.id
                    }))
                );
            }
        } catch (error) {
            console.error("❌ Error fetching team members:", error);
            toast.error("Failed to fetch team members");
        }
    };

    // Fetch Taxes
    const fetchTaxes = async () => {
        try {
            const response = await api.get("/taxes");
            if (response.data && response.data.taxes) {
                setTaxes(response.data.taxes);
            }
        } catch (error) {
            console.error("❌ Error fetching taxes:", error);
            toast.error("Failed to fetch taxes");
        }
    };

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
        fetchMembers();
        fetchTaxes();
    }, []);

    // Calculate Total
    const calculateTotal = (expense) => {
        const amount = parseFloat(expense.amount) || 0;
        const tax1Percentage = getTaxPercentage(expense.tax_id);
        const tax2Percentage = getTaxPercentage(expense.tax_id2);
        
        const tax1Amount = (amount * tax1Percentage) / 100;
        const tax2Amount = (amount * tax2Percentage) / 100;
        
        return amount + tax1Amount + tax2Amount;
    };

    // Get Category Name
    const getCategoryName = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.title : "-";
    };

    // Get Tax Percentage
    const getTaxPercentage = (taxId) => {
        const tax = taxes.find((t) => t.id === taxId);
        return tax ? parseFloat(tax.percentage) : 0;
    };

    // Filter expenses based on search and selected filters
    const filteredExpenses = expenses.filter((expense) => {
        const matchesSearch = Object.values(expense).some(
            (value) => value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        const matchesCategory = !selectedCategory || expense.category_id === selectedCategory.value;
        const matchesMember = !selectedMember || expense.user_id === selectedMember.value;
        
        return matchesSearch && matchesCategory && matchesMember;
    });

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, selectedMember, itemsPerPage]);

    // Paginate filtered expenses
    const paginatedExpenses = filteredExpenses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

    // Handle Edit
    const handleEditExpense = (expense) => {
        setSelectedExpense({
            ...expense,
            category: categoryOptions.find(cat => cat.value === expense.category_id),
            tax: taxes.find(tax => tax.id === expense.tax_id),
            tax2: taxes.find(tax => tax.id === expense.tax_id2)
        });
        setIsEditMode(true);
        setOpenExpenseForm(true);
    };

    // Handle Save
    const handleSaveExpense = async () => {
        try {
            const expenseData = {
                ...selectedExpense,
                category_id: selectedExpense.category?.value,
                tax_id: selectedExpense.tax?.id,
                tax_id2: selectedExpense.tax2?.id
            };

            if (isEditMode) {
                await api.put(`/expenses/${selectedExpense.id}`, expenseData);
                toast.success("Expense updated successfully!");
            } else {
                await api.post("/expenses", expenseData);
                toast.success("Expense added successfully!");
            }
            fetchExpenses();
            handleCloseForm();
        } catch (error) {
            console.error("❌ Error saving expense:", error);
            toast.error(error.response?.data?.message || "Error saving expense");
        }
    };

    // Handle Delete
    const handleDeleteExpense = async (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            try {
                await api.delete(`/expenses/${id}`);
                toast.success("Expense deleted successfully!");
                fetchExpenses();
            } catch (error) {
                console.error("❌ Error deleting expense:", error);
                toast.error("Failed to delete expense");
            }
        }
    };

    // Close Form
    const handleCloseForm = () => {
        setOpenExpenseForm(false);
        setSelectedExpense(null);
        setIsEditMode(false);
    };

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
                    <Select 
                        options={categoryOptions} 
                        value={selectedCategory} 
                        onChange={setSelectedCategory} 
                        placeholder="- Category -" 
                        className="w-48"
                        isClearable
                    />
                    <Select 
                        options={memberOptions} 
                        value={selectedMember} 
                        onChange={setSelectedMember} 
                        placeholder="- Member -" 
                        className="w-48"
                        isClearable
                    />
                </div>
                <div className="flex items-center gap-2">
                    <ExportSearchControls 
                        searchQuery={searchQuery} 
                        setSearchQuery={setSearchQuery} 
                        fileName="Monthly_Expenses" 
                    />
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
                                {columns.map((col) => 
                                    visibleColumns[col.key] && (
                                        <th key={col.key} className="text-left py-3 px-4">{col.label}</th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedExpenses.length > 0 ? (
                                paginatedExpenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        {columns.map((col) =>
                                            visibleColumns[col.key] ? (
                                                <td key={col.key} className="px-6 py-4 text-sm">
                                                    {col.key === "action" ? (
                                                        <div className="flex items-center space-x-2">
                                                            <button 
                                                                onClick={() => handleEditExpense(expense)}
                                                                className="p-1 rounded hover:bg-green-500 hover:text-white"
                                                            >
                                                                <FiEdit size={20} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteExpense(expense.id)}
                                                                className="p-1 rounded hover:bg-red-500 hover:text-white"
                                                            >
                                                                <SlClose size={20} />
                                                            </button>
                                                        </div>
                                                    ) : col.key === "category_id" ? (
                                                        getCategoryName(expense[col.key])
                                                    ) : col.key === "tax_id" || col.key === "tax_id2" ? (
                                                        `${getTaxPercentage(expense[col.key])}%`
                                                    ) : col.key === "total" ? (
                                                        calculateTotal(expense).toFixed(2)
                                                    ) : col.key === "expense_date" ? (
                                                        new Date(expense[col.key]).toLocaleDateString()
                                                    ) : col.key === "amount" ? (
                                                        parseFloat(expense[col.key]).toFixed(2)
                                                    ) : (
                                                        expense[col.key] || "—"
                                                    )}
                                                </td>
                                            ) : null
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="py-4 text-center text-gray-500">
                                        No expenses found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
            />

            {/* Form Dialog */}
            <FormDialog 
                open={openExpenseForm} 
                handleClose={handleCloseForm} 
                type={isEditMode ? "Edit Expense" : "Add Expense"} 
                fields={columns} 
                formData={selectedExpense || {}} 
                handleChange={(e) => setSelectedExpense({ 
                    ...selectedExpense, 
                    [e.target.name]: e.target.value 
                })} 
                handleSave={handleSaveExpense}
                handleSelectChange={(name, value) => setSelectedExpense({
                    ...selectedExpense,
                    [name]: value
                })}
                categoryOptions={categoryOptions}
                taxOptions={taxes.map(tax => ({
                    label: `${tax.title} (${tax.percentage}%)`,
                    value: tax.id
                }))}
            />
        </div>
    );
};

export default ExpensesMonth;