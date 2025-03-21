import React, { useState, useEffect } from 'react';
import { FiMoreVertical, FiEdit, FiRefreshCw, FiCheck, FiPause, FiX, FiPlus } from 'react-icons/fi';
import classNames from 'classnames';
import api from '../../Services/api.js';
import { useLocation } from 'react-router-dom';
import FormDialog from '../../extra/FormDialog.js';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const EstimateRequest = ({ estimateNumber }) => {
    const [status, setStatus] = useState(''); // Default status
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [clientOptions, setClientOptions] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [createdDate, setCreatedDate] = useState(''); // ✅ Created Date state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [openSingleEstimate, setOpenSingleEstimate] = useState(false);
    const [selectedEstimate, setSelectedEstimate] = useState(false);

    // ✅ Get clientId from URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get("clientId");

    const handleSaveEstimate = () => {
        console.log("Saving estimate...", estimateData);
        // Add logic to save data (e.g., API call)
        setOpenSingleEstimate(false); // Close the modal after saving
    };

    // ✅ Function to Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEstimateData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOpenEditForm = (request) => {
        setEstimateData({
            assigned: request.assigned || "",
        });
        setIsEditMode(true);
        setOpenSingleEstimate(true);
    };

    const handleOpenEstimateForm = () => {
        setEstimateData({
            date: "",
            valid: "",
            tax: "",
            secondtax: "",
            note: "",
        });
        setIsEditMode(false);
        setOpenSingleEstimate(true);
    };

    const AddEstimateFields = [
        { name: "date", label: "Estimate date", type: "date" },
        { name: "valid", label: "Valid until", type: "date" },
        { name: "tax", label: "TAX", type: "select", options: [] },
        { name: "secondtax", label: "Second TAX", type: "select", options: [] },
        { name: "note", label: "Note", type: "textarea", multiline: true, rows: 2 },
    ];

    const EditEstimateFields = [
        { name: "assigned", label: "Assigned", type: "select", options: [] },
    ];

    const [estimateData, setEstimateData] = useState({
        assigned: "",
        date: "",
        valid: "",
        tax: "",
        secondtax: "",
        note: "",
    });

    // ✅ Fetch clients and estimate details from API
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get('/clients');
                if (response.data.success) {
                    const mappedClients = response.data.data.map((client) => ({
                        value: client.id,
                        label: client.company_name,
                    }));
                    setClientOptions(mappedClients);

                    // ✅ Set selected client if found in the list
                    const foundClient = mappedClients.find(client => client.value === parseInt(clientId));
                    if (foundClient) {
                        setSelectedClient(foundClient.label);
                    }
                } else {
                    setError('Failed to fetch clients. Please try again.');
                }
            } catch (err) {
                console.error('Error fetching clients:', err);
                setError('Could not load clients.');
            }
        };

        const fetchEstimateDetails = async () => {
            try {
                const response = await api.get(`/estimates/${estimateNumber}`); // Fetch estimate details
                if (response.data.success) {
                    setStatus(response.data.data.status); // ✅ Update status from API
                    setCreatedDate(new Date(response.data.data.created_at).toLocaleDateString()); // ✅ Format date properly
                } else {
                    setError('Failed to fetch estimate details.');
                }
            } catch (err) {
                console.error('Error fetching estimate details:', err);
                setError('Could not load estimate details.');
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
        fetchEstimateDetails();
    }, [clientId, estimateNumber]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between relative">
                <h2 className="text-2xl font-medium text-gray-800">
                    Estimate Request # {estimateNumber}
                </h2>

                {/* ✅ Dropdown Button */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <span>Actions</span>
                        <FiMoreVertical size={16} />
                    </button>

                    {/* Dropdown Content */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg">
                            <button
                                onClick={() => handleOpenEditForm(selectedEstimate)}
                                className="w-full text-left p-2 flex items-center hover:bg-gray-100">
                                <FiEdit size={18} className="mr-2" />
                                Edit
                            </button>
                            <button onClick={() => setStatus('Processing')} className="w-full text-left p-2 flex items-center hover:bg-gray-100">
                                <FiRefreshCw size={18} className="mr-2" />
                                Mark as Processing
                            </button>
                            <button onClick={() => setStatus('Estimated')} className="w-full text-left p-2 flex items-center hover:bg-gray-100">
                                <FiCheck size={18} className="mr-2" />
                                Mark as Estimated
                            </button>
                            <button onClick={() => setStatus('Hold')} className="w-full text-left p-2 flex items-center hover:bg-gray-100">
                                <FiPause size={18} className="mr-2" />
                                Mark as Hold
                            </button>
                            <button
                                onClick={handleOpenEstimateForm} // ✅ Click to open
                                className="w-full text-left p-2 flex items-center hover:bg-gray-100"
                            >
                                <FiPlus size={18} className="mr-2" />
                                Add Estimate
                            </button>
                            <button onClick={() => setStatus('Canceled')} className="w-full text-left p-2 flex items-center hover:bg-gray-100">
                                <FiX size={18} className="mr-2" />
                                Mark as Canceled
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Status, Client, and Created Date Section */}
            <div className="bg-gray-50 p-4 rounded-md space-y-3">
                <div className="flex flex-wrap gap-6">
                    <div>
                        <span className="text-gray-500 text-sm">Status:</span>
                        <span className={classNames(
                            'ml-2 px-2 py-0.5 rounded-full text-xs font-medium',
                            status === 'New' && 'bg-yellow-100 text-yellow-800',
                            status === 'Processing' && 'bg-blue-100 text-blue-800',
                            status === 'Estimated' && 'bg-green-100 text-green-800',
                            status === 'Hold' && 'bg-orange-100 text-orange-800',
                            status === 'Canceled' && 'bg-red-100 text-red-800'
                        )}>
                            {status}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm">Client:</span>
                        <span className="ml-2 text-sm">{selectedClient || "N/A"}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm">Created:</span>
                        <span className="ml-2 text-sm">{createdDate || "Loading..."}</span> {/* ✅ Show formatted date */}
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm">Estimates:</span>
                    </div>
                </div>
            </div>
            <div className="bg-white p-4 rounded-md border border-gray-100">
                <h3 className="text-xl text-gray-700">Form</h3>
                <div>

                </div>
            </div>

            <FormDialog
                open={openSingleEstimate}
                handleClose={() => setOpenSingleEstimate(false)}
                type={isEditMode ? "Edit Estimate" : "Add Estimate"}
                fields={isEditMode ? EditEstimateFields : AddEstimateFields} // ✅ Use different fields for add/edit
                formData={estimateData}
                handleChange={handleChange}
                handleSave={handleSaveEstimate}
                showUploadButton={true}
                extraButtons={[
                    {
                        label: "Save",
                        onClick: handleSaveEstimate,
                        icon: IoMdCheckmarkCircleOutline,
                        color: "#007bff",
                    },
                ]}
            />
        </div>
    );
};

export default EstimateRequest;
