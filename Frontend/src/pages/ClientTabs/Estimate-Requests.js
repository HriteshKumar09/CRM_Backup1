import React, { useState, useEffect } from "react";
import axios from "axios";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { LuColumns2 } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { SlClose } from "react-icons/sl";

const API_BASE_URL = "http://localhost:4008/api"; // ✅ Backend URL

const EstimateRequests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    assigned: true,
    createdate: true,
    status: true,
    action: true,
  });

  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "assigned", label: "Assigned To" },
    { key: "createdate", label: "Created Date" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  // ✅ Fetch Estimate Requests from Backend
  const fetchEstimates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/estimates`);
      setEstimates(response.data);
    } catch (error) {
      console.error("❌ Error fetching estimates:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEstimates();
  }, []);

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Pagination Logic
  const totalItems = estimates.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedEstimates = estimates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <PageHeader title="Estimate Requests" />

      {/* ✅ Toolbar: Column Selection & Search */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton icon={LuColumns2} options={columns} visibleItems={visibleColumns} toggleItem={toggleColumn} />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} fileName="Estimates" />
        </div>
      </div>

      {/* ✅ Table Section */}
      <div className="overflow-x-auto rounded-md">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading estimates...</p>
        ) : (
          <table className="min-w-full border border-gray-200 rounded-md dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                {columns.map((col) => visibleColumns[col.key] && <th key={col.key} className="text-left py-3 px-4">{col.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginatedEstimates.length > 0 ? (
                paginatedEstimates.map((estimate, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {columns.map((col) =>
                      visibleColumns[col.key] ? (
                        <td key={col.key} className="px-6 py-4 text-sm">
                          {col.key === "status" ? (
                            // ✅ Status Badges
                            <span className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${
                              estimate.status.toLowerCase() === "completed"
                                ? "bg-green-500"
                                : estimate.status.toLowerCase() === "pending"
                                ? "bg-yellow-500"
                                : "bg-gray-300"
                            }`}>
                              {estimate.status}
                            </span>
                          ) : col.key === "action" ? (
                            // ✅ Action Buttons (Edit & Delete)
                            <div className="flex items-center space-x-2">
                              <button onClick={() => alert(`Editing estimate ${estimate._id}`)} className="p-1 rounded hover:bg-green-500 hover:text-white">
                                <FiEdit size={20} />
                              </button>
                              <button onClick={() => alert(`Deleting estimate ${estimate._id}`)} className="p-1 rounded hover:bg-red-500 hover:text-white">
                                <SlClose size={20} />
                              </button>
                            </div>
                          ) : (
                            estimate[col.key] || "—"
                          )}
                        </td>
                      ) : null
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-4 text-center text-gray-500">❌ No estimates found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Pagination Component */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default EstimateRequests;
