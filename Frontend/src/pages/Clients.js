import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [formData, setFormData] = useState({
    company_name: "",
    type: "organization",
    address: "",
    city: "",
    state: "",
    website: "",
    phone: "",
    currency_symbol: "",
  });

  const baseURL = "http://localhost:4008/api/clients";

  // Fetch clients
  const fetchClients = async () => {
    try {
      const response = await axios.get(baseURL);
      if (response.data.success) {
        setClients(response.data.data);
      } else {
        console.error("Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  // Open modal for create client
  const openCreateModal = () => {
    setCurrentClient(null);
    setFormData({
      company_name: "",
      type: "organization",
      address: "",
      city: "",
      state: "",
      website: "",
      phone: "",
      currency_symbol: "",
    });
    setModalOpen(true);
  };

  // Open modal for update client
  const openUpdateModal = (client) => {
    setCurrentClient(client);
    setFormData({
      company_name: client.company_name || "",
      type: client.type || "organization",
      address: client.address || "",
      city: client.city || "",
      state: client.state || "",
      website: client.website || "",
      phone: client.phone || "",
      currency_symbol: client.currency_symbol || "",
    });
    setModalOpen(true);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Save (create or update) client
  const saveClient = async () => {
    try {
      if (!formData.company_name || !formData.type) {
        alert("Company Name and Type are required.");
        return;
      }

      if (currentClient) {
        // Update client
        const response = await axios.put(`${baseURL}/${currentClient.id}`, formData);
        if (response.data.success) {
          fetchClients();
        } else {
          console.error("Failed to update client");
        }
      } else {
        // Create new client
        const response = await axios.post(baseURL, formData);
        if (response.data.success) {
          setClients([...clients, response.data.data]);
        } else {
          console.error("Failed to create client");
        }
      }

      setModalOpen(false);
      setCurrentClient(null);
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  // Open delete modal
  const openDeleteModal = (client) => {
    setClientToDelete(client);
    setDeleteModalOpen(true);
  };

  // Delete client
  const deleteClient = async () => {
    try {
      const response = await axios.delete(`${baseURL}/${clientToDelete.id}`);
      if (response.data.success) {
        fetchClients();
        setDeleteModalOpen(false);
      } else {
        console.error("Failed to delete client");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* Header with Tabs and Action Buttons */}
      <div className="flex justify-between items-center mb-6 dark:bg-gray-700 dark:text-white">
        <h2 className="text-3xl font-bold text-gray-800">Client Management</h2>
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600">Active Clients</button>
          <button className="bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300">Inactive Clients</button>
        </div>
        <div className="space-x-4">
          <button onClick={openCreateModal} className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600">+ Add Client</button>
          <button className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600">Send Invitation</button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-6 text-left font-semibold text-sm">Company Name</th>
              <th className="py-3 px-6 text-left font-semibold text-sm">Type</th>
              <th className="py-3 px-6 text-left font-semibold text-sm">Email</th>
              <th className="py-3 px-6 text-left font-semibold text-sm">Phone</th>
              <th className="py-3 px-6 text-left font-semibold text-sm">Status</th>
              <th className="py-3 px-6 text-left font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 border-b">
                <td className="py-3 px-6 text-sm text-gray-700">{client.company_name}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{client.type}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{client.email}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{client.phone}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{client.status}</td>
                <td className="py-3 px-6 text-sm">
                  <button
                    onClick={() => openUpdateModal(client)}
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(client)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrashAlt size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-gray-600">
          Showing 1 to 10 of {clients.length} entries
        </div>
        <div className="space-x-2">
          <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300">Prev</button>
          <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300">1</button>
          <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300">2</button>
          <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300">Next</button>
        </div>
      </div>

      {/* Create/Update Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
              {currentClient ? "Update Client" : "Create New Client"}
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                placeholder="Company Name"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                placeholder="Type (e.g., Organization)"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </form>
            <div className="mt-6 flex justify-between">
              <button
                onClick={saveClient}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                {currentClient ? "Update Client" : "Create Client"}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-6 text-gray-700">Are you sure you want to delete this client?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={deleteClient}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;