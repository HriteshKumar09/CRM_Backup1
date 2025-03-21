import React, { useState, useEffect } from 'react';
import DropdownButton from '../../extra/DropdownButton ';
import ExportSearchControls from '../../extra/ExportSearchControls';
import Pagination from '../../extra/Pagination';
import { LuColumns2 } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { GrShare } from "react-icons/gr";
import { Link } from "react-router-dom";
import api from "../../Services/api"; // ✅ API Integration

const Estimatelistmonth = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [estimates, setEstimates] = useState([]);
    const [clients, setClients] = useState({});
    const [projects, setProjects] = useState({});
    const [loading, setLoading] = useState(true);

    // ✅ Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Adjust items per page as needed

    // ✅ Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState({
        estimate: true,
        client: true,
        estimateDate: true,
        amount: true,
        status: true,
        action: true,
    });

    // ✅ Column Headers
    const columns = [
        { key: "estimate", label: "Estimate" },
        { key: "client", label: "Client" },
        { key: "estimateDate", label: "Estimate Date" },
        { key: "validUntil", label: "Valid Until" },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status" },
        { key: "action", label: "Action" },
    ];

    // ✅ Fetch Estimates from API with Pagination
    const fetchEstimates = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/estimate/estimates?page=${currentPage}&limit=${itemsPerPage}`);
            console.log("📌 API Response:", response.data); // Debugging
            setEstimates(response.data.data || []);
        } catch (error) {
            console.error("❌ Error fetching estimates:", error);
            setEstimates([]);
        }
        setLoading(false);
    };

    // ✅ Fetch Clients (for Client Name Mapping)
    const fetchClients = async () => {
        try {
            const response = await api.get(`/clients`);
            console.log("📌 API Response (Clients):", response.data);
            const clientMap = {};
            response.data.data.forEach(client => {
                clientMap[client.id] = client.company_name; // Map client ID to Company Name
            });
            setClients(clientMap);
        } catch (error) {
            console.error("❌ Error fetching clients:", error);
        }
    };

    // ✅ Fetch Projects (for Project Title Mapping)
    const fetchProjects = async () => {
        try {
            const response = await api.get(`/projects`);
            console.log("📌 API Response (Projects):", response.data);
            const projectMap = {};
            response.data.data.forEach(project => {
                projectMap[project.id] = project.title; // Map project ID to Title
            });
            setProjects(projectMap);
        } catch (error) {
            console.error("❌ Error fetching projects:", error);
        }
    };

    // ✅ Fetch all data on component mount
    useEffect(() => {
        fetchEstimates();
        fetchClients();
        fetchProjects();
    }, [currentPage]);

    // ✅ Toggle Column Visibility
    const toggleColumn = (key) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // ✅ Filter Data Based on Search Query
    const filteredEstimates = estimates.map((estimate) => ({
        ...estimate,
        client: clients[estimate.client_id] || "-", // Correct mapping for client name
        project: projects[estimate.project_id] || "-", // Correct mapping for project title
        estimateAmount: estimate.amount ? `Rs. ${estimate.amount}` : "Rs. 0.0", // Amount Formatting
        estimateId: `ESTIMATES-#${estimate.id}`, // Correct Estimate ID format
    })).filter(estimate =>
        Object.values(estimate).some(value =>
            value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // ✅ Handle Edit Action
    const handleEdit = (estimate) => {
        console.log("Edit Estimate:", estimate);
    };

    // ✅ Handle Delete Estimate
    const handleDelete = async (id) => {
        if (window.confirm("❗ Are you sure you want to delete this estimate?")) {
            try {
                await api.delete(`/estimate/estimates/${id}`);
                alert("✅ Estimate deleted successfully!");
                fetchEstimates(); // Refresh list after deletion
            } catch (error) {
                console.error("❌ Error deleting estimate:", error);
                alert("⚠️ Failed to delete estimate. Please try again.");
            }
        }
    };

    return (
        <div>
            {/* ✅ Top Bar */}
            <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 dark:bg-gray-700 dark:text-white">
                <div className="flex items-center space-x-4">
                    <DropdownButton
                        icon={LuColumns2}
                        options={columns}
                        visibleItems={visibleColumns}
                        toggleItem={toggleColumn}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <ExportSearchControls
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        fileName="estimates"
                    />
                </div>
            </div>

            {/* ✅ Table Section */}
            <div className="overflow-x-auto">
                {loading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading estimates...</p>
                ) : (
                    <table className="min-w-full border border-gray-300 bg-white dark:bg-gray-800">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-600">
                                {columns.map(col =>
                                    visibleColumns[col.key] && (
                                        <th key={col.key} className="px-4 py-2 text-left border">
                                            {col.label}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEstimates.length > 0 ? (
                                filteredEstimates.map((estimate) => (
                                    <tr key={estimate.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
                                        {columns.map((col) =>
                                            visibleColumns[col.key] && (
                                                <td key={col.key} className="px-4 py-2 border">
                                                    {col.key === "estimate" ? (
                                                        // ✅ Clickable Link for Estimate
                                                        <Link
                                                            to={`/dashboard/Estimate-List/Views/${estimate.id}`}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {estimate.estimateId} {/* Displaying ESTIMATES-#id */}
                                                        </Link>
                                                    ) : col.key === "client" ? (
                                                        // ✅ Display company name of client
                                                        <Link
                                                            to={`/dashboard/clients/view/${estimate.client_id}/contacts`}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {estimate.client}
                                                        </Link>
                                                    ) : col.key === "status" ? (
                                                        <span
                                                            className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${estimate[col.key] === "draft"
                                                                    ? "bg-blue-300"
                                                                    : estimate[col.key] === "sent"
                                                                        ? "bg-yellow-300"
                                                                        : "bg-gray-300"
                                                                }`}
                                                        >
                                                            {estimate[col.key]}
                                                        </span>
                                                    ) : col.key === "action" ? (
                                                        <div className="flex gap-2">
                                                            <button className="p-1 rounded transition-colors duration-200 hover:bg-green-200">
                                                                <GrShare size={18} className="text-green-600" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEdit(estimate)}
                                                                className="p-1 rounded transition-colors duration-200 hover:bg-blue-200"
                                                            >
                                                                <FiEdit size={18} className="text-blue-600" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(estimate.id)}
                                                                className="p-1 rounded transition-colors duration-200 hover:bg-red-200"
                                                            >
                                                                <SlClose size={18} className="text-red-500" />
                                                            </button>
                                                        </div>
                                                    ) : col.key === "amount" ? (
                                                        estimate.estimateAmount // ✅ Display formatted amount
                                                    ) : (
                                                        estimate[col.key] ?? "N/A"
                                                    )}
                                                </td>
                                            )
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="text-center p-4">
                                        No estimates found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ✅ Pagination Component */}
            <div>
                <Pagination
                    currentPage={currentPage}
                    totalItems={estimates.length} // Replace with total from API if available
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default Estimatelistmonth;
