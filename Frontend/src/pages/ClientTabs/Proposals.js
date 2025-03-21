import React, { useState, useEffect } from "react";
import axios from "axios";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { LuColumns2 } from "react-icons/lu";
import { FiEdit, FiTrash2,FiPlusCircle } from "react-icons/fi";

const API_BASE_URL = "http://localhost:4008/api"; // ✅ Backend URL

const Proposals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    proposal: true,
    proposalDate: true,
    validUntil: true,
    amount: true,
    status: true,
    action: true,
  });

  const columns = [
    { key: "id", label: "ID" },
    { key: "proposal", label: "Proposal" },
    { key: "proposalDate", label: "Proposal Date" },
    { key: "validUntil", label: "Valid Until" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  // ✅ Fetch Proposals from Backend
  const fetchProposals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/proposals`);
      setProposals(response.data);
    } catch (error) {
      console.error("❌ Error fetching proposals:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Pagination Logic
  const totalItems = proposals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedProposals = proposals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ Delete Proposal
  const handleDelete = async (id) => {
    if (window.confirm("❗ Are you sure you want to delete this proposal?")) {
      try {
        await axios.delete(`${API_BASE_URL}/proposals/${id}`);
        alert("✅ Proposal deleted successfully!");
        fetchProposals();
      } catch (error) {
        console.error("❌ Error deleting proposal:", error);
      }
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <PageHeader title="Proposals" buttons={[{ label: "Add proposal", icon: FiPlusCircle }]} />

      {/* ✅ Toolbar: Column Selection & Search */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton icon={LuColumns2} options={columns} visibleItems={visibleColumns} toggleItem={toggleColumn} />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} fileName="Proposals" />
        </div>
      </div>

      {/* ✅ Table Section */}
      <div className="overflow-x-auto rounded-md">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading proposals...</p>
        ) : (
          <table className="min-w-full border border-gray-200 rounded-md dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                {columns.map((col) => visibleColumns[col.key] && <th key={col.key} className="text-left py-3 px-4">{col.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginatedProposals.length > 0 ? (
                paginatedProposals.map((proposal, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {columns.map((col) =>
                      visibleColumns[col.key] ? (
                        <td key={col.key} className="px-6 py-4 text-sm">
                          {col.key === "status" ? (
                            // ✅ Status Badges
                            <span className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${
                              proposal.status.toLowerCase() === "approved"
                                ? "bg-green-500"
                                : proposal.status.toLowerCase() === "pending"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}>
                              {proposal.status}
                            </span>
                          ) : col.key === "action" ? (
                            // ✅ Action Buttons (Edit & Delete)
                            <div className="flex items-center space-x-2">
                              <button className="p-1 rounded hover:bg-green-500 hover:text-white">
                                <FiEdit size={20} />
                              </button>
                              <button onClick={() => handleDelete(proposal._id)} className="p-1 rounded hover:bg-red-500 hover:text-white">
                                <FiTrash2 size={20} />
                              </button>
                            </div>
                          ) : (
                            proposal[col.key] || "—"
                          )}
                        </td>
                      ) : null
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-4 text-center text-gray-500">❌ No proposals found.</td>
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

export default Proposals;
