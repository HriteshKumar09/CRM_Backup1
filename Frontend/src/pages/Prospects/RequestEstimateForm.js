import React, { useState, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import Select from 'react-select';
import api from "../../Services/api.js";
import { useNavigate } from "react-router-dom";

const RequestEstimateForm = ({ setShowForm }) => {
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientOptions, setClientOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch clients from API
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get("/clients");
                if (response.data.success) {
                    // ✅ Extract only `id` & `company_name` for the dropdown
                    const mappedClients = response.data.data.map((client) => ({
                        value: client.id, // Unique client ID
                        label: client.company_name, // Company name for display
                    }));
                    setClientOptions(mappedClients);
                } else {
                    setError("Failed to fetch clients. Please try again.");
                    console.error("API Error:", response.data.message);
                }
            } catch (err) {
                console.error("Error fetching clients:", err);
                setError("Could not load clients.");
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
            <h2 className="text-2xl font-medium text-gray-800">Form</h2>
            <p className="text-gray-600 mb-4">form</p>

            <div className="space-y-4">
                <label htmlFor="client" className="block text-gray-700 font-medium">
                    Client
                </label>
                {loading ? (
                    <p className="text-gray-500">Loading clients...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <Select
                        id="client"
                        value={selectedClient}
                        onChange={setSelectedClient}
                        options={clientOptions} // ✅ Only shows `company_name`
                        placeholder="Select a client"
                        className="w-full"
                        classNamePrefix="react-select"
                    />
                )}
            </div>

            <button
                className="bg-blue-500 text-white rounded-md px-4 py-2.5 flex items-center justify-end space-x-2 hover:bg-blue-600 transition-colors  mt-4"
            >
                <FiSend size={18} />
                <span  onClick={() => navigate(`/dashboard/view_estimate_request`)}>Request an estimate</span>
            </button>
        </div>
    );
};

export default RequestEstimateForm;
