import React, { useState, useEffect } from 'react';
import axios from '../Services/api.js'; // Assuming api.js is in 'services' folder
import ExpenseModal from './ExpenseModal.js'; // Modal for creating or updating expenses

const ExpenseTable = () => {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Fetch Expenses from API
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('/expenses'); // Fetch expenses using the API
        console.log(response.data); // Debug: log the response
        setExpenses(response.data.expenses); // Make sure this matches the backend response format
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, []);  // Run once when the component mounts

  // Handle Edit of Expense
  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  // Handle Delete Expense
  const handleDelete = async (expenseId) => {
    try {
      await axios.delete(`/expenses/${expenseId}`);
      setExpenses(expenses.filter((expense) => expense.id !== expenseId));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Handle New Expense Save
  const handleSave = (newExpense) => {
    setExpenses([...expenses, newExpense]);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 p-2 bg-green-600 text-white rounded"
      >
        Add Expense
      </button>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Files</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">TAX</th>
            <th className="border p-2">Second TAX</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses && expenses.length > 0 ? expenses.map((expense) => (
            <tr key={expense.id}>
              <td className="border p-2">{new Date(expense.expense_date).toLocaleDateString()}</td>
              <td className="border p-2">{expense.category_id}</td> {/* Replace with category name */}
              <td className="border p-2">{expense.title}</td>
              <td className="border p-2">{expense.description}</td>
              <td className="border p-2">{expense.files || 'No Files'}</td>
              <td className="border p-2">{expense.amount}</td>
              <td className="border p-2">{expense.tax_id ? 'Tax 10%' : 'No Tax'}</td> {/* Replace with tax names */}
              <td className="border p-2">{expense.tax_id2 ? 'Tax 5%' : 'No Second Tax'}</td>
              <td className="border p-2">{expense.amount + (expense.tax_id ? 10 : 0) + (expense.tax_id2 ? 5 : 0)}</td> {/* Calculate total dynamically */}
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(expense)}
                  className="p-2 bg-blue-600 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="p-2 bg-red-600 text-white rounded ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="10" className="text-center p-4">No Expenses Found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Add/Edit Expense */}
      <ExpenseModal
        expenseData={selectedExpense}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default ExpenseTable;
