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

const Estimatelistyear = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [estimates, setEstimates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Set items per page

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
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status" },
        { key: "action", label: "Action" },
    ];

    // ✅ Fetch Yearly Estimates from API with Pagination
    const fetchEstimates = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/estimates?page=${currentPage}&limit=${itemsPerPage}`);
            console.log("📌 API Response:", response.data); // Debugging
            setEstimates(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("❌ Error fetching estimates:", error);
            setEstimates([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEstimates();
    }, [currentPage]); // ✅ Fetch data when page changes


    // ✅ Toggle Column Visibility
    const toggleColumn = (key) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // ✅ Filter Data Based on Search Query
    const filteredEstimates = estimates.filter(estimate =>
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
                await api.delete(`/estimates/${id}`);
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
                        fileName="yearly_estimates"
                    />
                </div>
            </div>

            {/* ✅ Table Section */}
            <div className="overflow-x-auto">
                {loading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading estimates...</p>
                ) : error ? (
                    <p className="text-center text-red-500 dark:text-red-400 py-4">{error}</p>
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
                                filteredEstimates.map((project) => (
                                    <tr key={project.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
                                        {columns.map((col) =>
                                            visibleColumns[col.key] && (
                                                <td key={col.key} className="px-4 py-2 border">
                                                    {col.key === "estimate" ? (
                                                        // ✅ Clickable Link for Estimate
                                                        <Link
                                                            to={`/dashboard/Estimate-List/Views/${project.id}`}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {project[col.key]}
                                                        </Link>
                                                    ) : col.key === "client" ? (
                                                        // ✅ Clickable Link for Client
                                                        <Link
                                                            to={`/dashboard/clients/view/${project.clientId}/contacts`}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {project[col.key]}
                                                        </Link>
                                                    ) : col.key === "status" ? (
                                                        <span
                                                            className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${project[col.key] === "Draft"
                                                                    ? "bg-blue-300"
                                                                    : project[col.key] === "sent"
                                                                        ? "bg-yellow-300"
                                                                        : project[col.key] === "Declined"
                                                                            ? "bg-red-300"
                                                                            : project[col.key] === "Accepted"
                                                                                ? "bg-green-300"
                                                                                : "bg-gray-300"
                                                                }`}
                                                        >
                                                            {project[col.key]}
                                                        </span>
                                                    ) : col.key === "action" ? (
                                                        <div className="flex gap-2">
                                                            <button className="p-1 rounded transition-colors duration-200 hover:bg-green-200">
                                                                <GrShare size={18} className="text-green-600" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEdit(project)}
                                                                className="p-1 rounded transition-colors duration-200 hover:bg-blue-200"
                                                            >
                                                                <FiEdit size={18} className="text-blue-600" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(project.id)}
                                                                className="p-1 rounded transition-colors duration-200 hover:bg-red-200"
                                                            >
                                                                <SlClose size={18} className="text-red-500" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        project[col.key] ?? "N/A"
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
                    totalItems={estimates.length} // Replace with total count from API if available
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default Estimatelistyear;
