import React, { useState, useEffect } from 'react';
import api from '../Services/api.js'; // Correct import path for API

const ExpenseModal = ({ expenseData, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    expense_date: "",
    category_id: "",
    description: "",
    amount: 0,
    title: "",
    recurring: false,
    repeat_every: 1,
    repeat_type: "months",
    ...expenseData,
  });

  // State to store dropdown data
  const [categories, setCategories] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (expenseData) {
        setFormData({ ...expenseData });
      }
    }
  }, [isOpen, expenseData]);

  const fetchData = async () => {
    try {
      // Fetch categories
      const categoryResponse = await api.get('/categories');
      setCategories(categoryResponse.data.categories || []);

      // Fetch taxes
      const taxResponse = await api.get('/taxes');
      setTaxes(taxResponse.data.taxes || []);

      // Fetch projects, clients, and team members
      const projectResponse = await api.get('/projects');
      setProjects(projectResponse.data.projects || []);

      const clientResponse = await api.get('/clients');
      setClients(clientResponse.data.clients || []);

      const teamResponse = await api.get('/team-members');
      setTeamMembers(teamResponse.data.members || []);
    } catch (error) {
      console.error("Error fetching data for dropdowns:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (expenseData) {
        // Update Expense
        const response = await api.put(`/api/expenses/${expenseData.id}`, formData);
        onSave(response.data);
      } else {
        // Create Expense
        const response = await api.post('/api/expenses', formData);
        onSave(response.data);
      }
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error('Error creating/updating expense:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-6">Add Expense</h2>
        <form onSubmit={handleSubmit}>
          {/* Expense Date */}
          <div className="mb-4">
            <label className="block text-gray-700">Date of Expense</label>
            <input
              type="date"
              name="expense_date"
              value={formData.expense_date || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Category</option>
              {categories.length > 0 && categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Recurring */}
          <div className="mb-4 flex items-center">
            <label className="mr-2 text-gray-700">Recurring</label>
            <input
              type="checkbox"
              name="recurring"
              checked={formData.recurring}
              onChange={() => setFormData({ ...formData, recurring: !formData.recurring })}
              className="p-2"
            />
          </div>

          {/* Repeat Every and Type */}
          {formData.recurring && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Repeat Every</label>
                <input
                  type="number"
                  name="repeat_every"
                  value={formData.repeat_every}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Repeat Type</label>
                <select
                  name="repeat_type"
                  value={formData.repeat_type}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </>
          )}

          {/* Client */}
          <div className="mb-4">
            <label className="block text-gray-700">Client</label>
            <select
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Client</option>
              {clients.length > 0 && clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Project */}
          <div className="mb-4">
            <label className="block text-gray-700">Project</label>
            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Project</option>
              {projects.length > 0 && projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          {/* Team Member */}
          <div className="mb-4">
            <label className="block text-gray-700">Team Member</label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Team Member</option>
              {teamMembers.length > 0 && teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="p-2 bg-gray-400 text-white rounded">
              Cancel
            </button>
            <button type="submit" className="p-2 bg-blue-600 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
